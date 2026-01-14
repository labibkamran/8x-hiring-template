# Frontend Engineering Assessment

Welcome! This assessment evaluates your frontend engineering skills in a real-world SaaS context.

## Time Expectation

**2-4 hours** — Focus on quality over quantity. It's better to do fewer things well than many things poorly.

## Setup

Before starting, make sure you can run the template locally:

```bash
pnpm install
supabase start
cp .env.example .env.local
# Edit .env.local with your local Supabase keys (from supabase start output)
supabase db push
pnpm dev
```

Verify you can:
- Visit http://localhost:3000
- Sign up with a test account
- Sign in and see the profile page
- Upgrade to Pro and see the tier change

## Your Task

Build a **new feature** that demonstrates your frontend engineering skills.

### Option A: Dashboard Page (Recommended)

Create a `/dashboard` page that is:
- **Protected** — Only accessible to logged-in users
- **Tier-aware** — Shows different content for Free vs Pro users

Requirements:
1. Route protection (redirect to login if not authenticated)
2. Display user information from context
3. Show different UI based on subscription tier:
   - **Free users**: See basic stats + upgrade CTA
   - **Pro users**: See expanded stats + pro-only features
4. Responsive design (mobile + desktop)
5. Loading states

Bonus points for:
- Data visualization (charts, graphs)
- Animations/transitions
- Error handling
- Skeleton loaders

### Option B: Feature of Your Choice

If you have a better idea, go for it! The key is demonstrating:
- Component architecture
- State management
- TypeScript usage
- UI/UX sensibility
- Code organization

## What We're Evaluating

| Skill | What we look for |
|-------|------------------|
| **React/Next.js** | Hooks, server components, App Router patterns |
| **TypeScript** | Type safety, interfaces, proper typing |
| **Component Design** | Reusability, composition, separation of concerns |
| **State Management** | Context usage, data flow, loading/error states |
| **CSS/Tailwind** | Responsive design, consistent styling |
| **Code Quality** | Readability, organization, best practices |

## Deliverables

1. **Code** — Your implementation in a fork/branch
2. **Brief writeup** — Add a section below explaining:
   - What you built
   - Key decisions you made
   - What you'd improve with more time

## Tips

- **Read the existing code first** — Understand the patterns before adding new ones
- **Use the existing components** — Leverage Shadcn/ui and existing utilities
- **Keep it simple** — Clean, working code beats complex, broken code
- **Commit often** — Show your thought process

## Existing Resources

- `contexts/subscription-context.tsx` — Subscription state (tier, isPro)
- `contexts/auth-context.tsx` — Auth state (user, isLoading)
- `components/ui/` — Shadcn/ui components
- `components/navigation.tsx` — Example of using auth/subscription context
- `app/upgrade/page.tsx` — Example of tier-based rendering

---

## Your Implementation

<!-- Add your writeup here -->

### What I Built

[Describe your feature]

### Key Decisions

[Explain your technical decisions]

### What I'd Improve

[What would you do with more time?]
