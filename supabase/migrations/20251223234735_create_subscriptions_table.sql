-- Comprehensive subscriptions + plans + credits + ledger migration
-- This migration creates a plans catalog, subscriptions, credits balance,
-- credit_transactions ledger, tolerant signup trigger, RPCs, RLS, indexes
-- and production hardening (checks, indexes, FOR UPDATE locking).

-- NOTE: This migration is idempotent. Seeded plans use ON CONFLICT DO UPDATE.

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. PLANS TABLE
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  credits_per_month INTEGER NOT NULL DEFAULT 0,
  bonus_credits_on_signup INTEGER NOT NULL DEFAULT 0,
  cost_per_video INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed plans (idempotent)
INSERT INTO public.plans (name, slug, price_monthly, credits_per_month, bonus_credits_on_signup, cost_per_video, display_order)
VALUES
('Free', 'free', 0, 0, 100, 30, 1),
('Basic', 'basic', 15, 600, 100, 30, 2),
('Pro', 'pro', 20, 1500, 100, 30, 3),
('Enterprise', 'enterprise', 50, 4000, 100, 30, 4)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  price_monthly = EXCLUDED.price_monthly,
  credits_per_month = EXCLUDED.credits_per_month,
  bonus_credits_on_signup = EXCLUDED.bonus_credits_on_signup,
  cost_per_video = EXCLUDED.cost_per_video,
  display_order = EXCLUDED.display_order,
  is_active = true;

-- RLS for plans (publicly readable active plans)
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Plans viewable by everyone" ON public.plans;
CREATE POLICY "Plans viewable by everyone"
  ON public.plans FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- 2. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled')),
  last_credit_topup_at TIMESTAMPTZ NULL,
  next_credit_topup_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_topup ON public.subscriptions(next_credit_topup_at);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own subscription" ON public.subscriptions;
CREATE POLICY "Users view own subscription"
  ON public.subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);


-- 3. CREDITS TABLE (Balance)
CREATE TABLE IF NOT EXISTS public.credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credits_user_id ON public.credits(user_id);
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own credits" ON public.credits;
CREATE POLICY "Users view own credits"
  ON public.credits FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 4. CREDIT TRANSACTIONS (Audit Log)
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('earn', 'spend', 'refund')),
  amount INTEGER NOT NULL CHECK (amount > 0),
  balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own transactions" ON public.credit_transactions;
CREATE POLICY "Users view own transactions"
  ON public.credit_transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 5. UPDATED_AT TRIGGERS
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER trg_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_credits_updated_at ON public.credits;
CREATE TRIGGER trg_credits_updated_at
BEFORE UPDATE ON public.credits
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- 6. AUTO-CREATE ON SIGNUP (TOLERANT + IDEMPOTENT)
-- This version is tolerant: it will not abort user creation if plans are missing.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id UUID;
  signup_bonus INTEGER := 0;
  bal_after INTEGER;
BEGIN
  SELECT id, bonus_credits_on_signup
  INTO free_plan_id, signup_bonus
  FROM public.plans
  WHERE slug = 'free' AND is_active = true
  LIMIT 1;

  -- Create subscription (Free tier) if free plan exists; do nothing if subscription already exists
  IF free_plan_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (user_id, plan_id, status, last_credit_topup_at, next_credit_topup_at)
    VALUES (NEW.id, free_plan_id, 'active', NOW(), NOW() + INTERVAL '1 month')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  -- Upsert credits account and capture resulting balance (idempotent)
  WITH upsert AS (
    INSERT INTO public.credits (user_id, balance, lifetime_earned)
    VALUES (NEW.id, COALESCE(signup_bonus,0), COALESCE(signup_bonus,0))
    ON CONFLICT (user_id) DO UPDATE
      SET balance = public.credits.balance,
          lifetime_earned = public.credits.lifetime_earned
    RETURNING balance
  )
  SELECT balance INTO bal_after FROM upsert LIMIT 1;

  -- Fallback: if upsert returned nothing (very unlikely), read the current balance
  IF bal_after IS NULL THEN
    SELECT balance INTO bal_after FROM public.credits WHERE user_id = NEW.id;
  END IF;

  -- Log signup bonus transaction only if bonus > 0
  IF COALESCE(signup_bonus,0) > 0 THEN
    INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, reason)
    VALUES (NEW.id, 'earn', signup_bonus, COALESCE(bal_after, signup_bonus), 'signup_bonus');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. RPC: GET CURRENT USER DASHBOARD (NO PARAMS)
CREATE OR REPLACE FUNCTION public.get_my_dashboard()
RETURNS TABLE (
  plan_name TEXT,
  plan_slug TEXT,
  price_monthly DECIMAL,
  credits_balance INTEGER,
  credits_per_month INTEGER,
  cost_per_video INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.name,
    p.slug,
    p.price_monthly,
    c.balance,
    p.credits_per_month,
    p.cost_per_video
  FROM public.subscriptions s
  JOIN public.plans p ON s.plan_id = p.id
  JOIN public.credits c ON s.user_id = c.user_id
  WHERE s.user_id = auth.uid()
    AND s.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8. RPC: UPGRADE PLAN (Immediate top-up + schedule monthly top-up)
CREATE OR REPLACE FUNCTION public.upgrade_plan(target_plan_slug TEXT)
RETURNS VOID AS $$
DECLARE
  uid UUID;
  target_plan RECORD;
  old_balance INTEGER;
  new_balance INTEGER;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT id, credits_per_month
  INTO target_plan
  FROM public.plans
  WHERE slug = target_plan_slug AND is_active = true
  LIMIT 1;

  IF target_plan.id IS NULL THEN
    RAISE EXCEPTION 'Plan not found or inactive';
  END IF;

  -- Ensure subscription exists and lock credits row to avoid races
  UPDATE public.subscriptions
  SET plan_id = target_plan.id,
      status = 'active',
      last_credit_topup_at = NOW(),
      next_credit_topup_at = NOW() + INTERVAL '1 month'
  WHERE user_id = uid;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription not found for user';
  END IF;

  -- Lock credits row
  SELECT balance INTO old_balance FROM public.credits WHERE user_id = uid FOR UPDATE;

  IF old_balance IS NULL THEN
    RAISE EXCEPTION 'Credits account not found';
  END IF;

  new_balance := old_balance + target_plan.credits_per_month;

  UPDATE public.credits
  SET balance = new_balance,
      lifetime_earned = lifetime_earned + target_plan.credits_per_month
  WHERE user_id = uid;

  INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, reason)
  VALUES (uid, 'earn', target_plan.credits_per_month, new_balance, 'plan_upgrade_topup');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 9. RPC: SPEND CREDITS (Atomic + audited)
CREATE OR REPLACE FUNCTION public.spend_credits(required_credits INTEGER, spend_reason TEXT)
RETURNS VOID AS $$
DECLARE
  uid UUID;
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF required_credits <= 0 THEN
    RAISE EXCEPTION 'required_credits must be positive';
  END IF;

  SELECT balance INTO current_balance
  FROM public.credits
  WHERE user_id = uid
  FOR UPDATE;

  IF current_balance IS NULL THEN
    RAISE EXCEPTION 'Credits account not found';
  END IF;

  IF current_balance < required_credits THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  new_balance := current_balance - required_credits;

  UPDATE public.credits
  SET balance = new_balance,
      lifetime_spent = lifetime_spent + required_credits
  WHERE user_id = uid;

  INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, reason)
  VALUES (uid, 'spend', required_credits, new_balance, spend_reason);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 10. RPC: PROCESS MONTHLY TOP-UPS (Run via scheduler; NOT user-callable)
CREATE OR REPLACE FUNCTION public.process_monthly_topups()
RETURNS INTEGER AS $$
DECLARE
  topped_up_count INTEGER := 0;
  rec RECORD;
  new_balance INTEGER;
BEGIN
  FOR rec IN
    SELECT s.user_id, s.next_credit_topup_at, p.credits_per_month
    FROM public.subscriptions s
    JOIN public.plans p ON p.id = s.plan_id
    WHERE s.status = 'active'
      AND s.next_credit_topup_at IS NOT NULL
      AND s.next_credit_topup_at <= NOW()
      AND p.credits_per_month > 0
  LOOP
    -- Lock and update credits
    UPDATE public.credits
    SET balance = balance + rec.credits_per_month,
        lifetime_earned = lifetime_earned + rec.credits_per_month
    WHERE user_id = rec.user_id
    RETURNING balance INTO new_balance;

    INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, reason)
    VALUES (rec.user_id, 'earn', rec.credits_per_month, new_balance, 'monthly_topup');

    UPDATE public.subscriptions
    SET last_credit_topup_at = NOW(),
        next_credit_topup_at = rec.next_credit_topup_at + INTERVAL '1 month'
    WHERE user_id = rec.user_id;

    topped_up_count := topped_up_count + 1;
  END LOOP;

  RETURN topped_up_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 11. PERMISSIONS (Lock down writes; allow safe RPC usage)
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- Plans are public-readable
GRANT SELECT ON public.plans TO authenticated, anon;

-- Users can read their own rows (RLS enforces ownership)
REVOKE ALL ON public.subscriptions FROM authenticated;
REVOKE ALL ON public.credits FROM authenticated;
REVOKE ALL ON public.credit_transactions FROM authenticated;

GRANT SELECT ON public.subscriptions TO authenticated;
GRANT SELECT ON public.credits TO authenticated;
GRANT SELECT ON public.credit_transactions TO authenticated;

-- Safe RPCs for authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_dashboard() TO authenticated;
GRANT EXECUTE ON FUNCTION public.upgrade_plan(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.spend_credits(INTEGER, TEXT) TO authenticated;

-- Monthly top-up function should NOT be callable by normal users
REVOKE EXECUTE ON FUNCTION public.process_monthly_topups() FROM authenticated;

