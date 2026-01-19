/*
  Privacy policy page for Genify.ai with structured sections and TOC.
*/
export default function PrivacyPage() {
  return (
    <main className="relative">
      <div className="fixed top-0 right-0 -z-10 h-1/2 w-1/3 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 h-1/3 w-1/4 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-30 pointer-events-none" />

      <div className="mx-auto max-w-3xl px-6 py-12">

        <div className="mb-12 border-b border-border/60 pb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Privacy Policy</h1>
          <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center">
            <p>
              Last Updated: <span className="font-semibold text-primary">Janurary 19, 2026</span>
            </p>
            <span className="hidden sm:inline">•</span>
            <p>
              Version: <span className="font-semibold text-primary">v2.0.4-LGL</span>
            </p>
          </div>
        </div>

        <section className="mb-12 rounded-xl border border-border/60 bg-card/60 p-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Contents</h3>
          <ul className="mt-4 grid gap-2 text-sm font-medium text-muted-foreground md:grid-cols-2">
            <li><a className="hover:text-primary transition-colors" href="#data-collection">1. Data Collection and Usage</a></li>
            <li><a className="hover:text-primary transition-colors" href="#ai-model">2. AI Model Usage and Prompts</a></li>
            <li><a className="hover:text-primary transition-colors" href="#credits">3. Credits and Subscriptions</a></li>
            <li><a className="hover:text-primary transition-colors" href="#third-party">4. Third-Party Partners</a></li>
            <li><a className="hover:text-primary transition-colors" href="#security">5. Security Measures</a></li>
            <li><a className="hover:text-primary transition-colors" href="#rights">6. Your Data Rights</a></li>
          </ul>
        </section>

        <article className="space-y-12 text-muted-foreground">
          <section id="introduction">
            <p className="text-lg leading-relaxed">
              At Genify.ai, your privacy is the foundation of our engineering. This policy outlines our commitment to
              transparency regarding your personal information, prompt history, and AI interactions. We aim to empower
              your creativity while protecting your digital footprint.
            </p>
          </section>

          <section id="data-collection">
            <h2 className="text-2xl font-bold text-foreground">1. Data Collection and Usage</h2>
            <div className="mt-4 space-y-4 leading-relaxed">
              <p>We collect information essential to providing our services:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li><span className="font-semibold text-foreground">Account Information:</span> Email, username, and encrypted credentials.</li>
                <li><span className="font-semibold text-foreground">Metadata:</span> IP addresses, browser types, and session duration for security monitoring.</li>
                <li><span className="font-semibold text-foreground">Interaction Logs:</span> Timestamps of prompt submissions for credit calculation.</li>
              </ul>
            </div>
          </section>

          <section id="ai-model">
            <h2 className="text-2xl font-bold text-foreground">2. AI Model Usage and Prompts</h2>
            <div className="mt-4 space-y-4 leading-relaxed">
              <p>
                We do not use your private prompts or generated outputs to train our underlying base models without
                explicit opt-in consent.
              </p>
              <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4 text-sm">
                Prompts are temporarily cached to allow for history retrieval and thread continuity. These are encrypted
                at rest using AES-256 standards.
              </div>
            </div>
          </section>

          <section id="credits">
            <h2 className="text-2xl font-bold text-foreground">3. Credits and Subscription System</h2>
            <div className="mt-4 space-y-4 leading-relaxed">
              <p>Genify.ai operates on a credit-based subscription model. To maintain this system, we store:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Total credit balance and depletion history.</li>
                <li>Transaction IDs from payment processors. We do not store full card numbers on our servers.</li>
                <li>Subscription tier status and renewal dates.</li>
              </ul>
            </div>
          </section>

          <section id="third-party">
            <h2 className="text-2xl font-bold text-foreground">4. Third-Party Partners</h2>
            <p className="mt-4 leading-relaxed">
              To deliver high-performance AI, we interface with downstream providers. Your anonymized data may be
              processed by:
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-card/60 p-4">
                <p className="font-bold text-foreground">OpenAI / Anthropic</p>
                <p className="text-xs text-muted-foreground">Core inference engines</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-card/60 p-4">
                <p className="font-bold text-foreground">Cloudflare</p>
                <p className="text-xs text-muted-foreground">WAF and content delivery</p>
              </div>
            </div>
          </section>

          <section id="security">
            <h2 className="text-2xl font-bold text-foreground">5. Security Measures</h2>
            <div className="mt-4 space-y-4 leading-relaxed">
              <p>
                We apply industry-standard encryption, strict access controls, and continuous monitoring to protect user
                data. Security reviews are conducted regularly to stay ahead of emerging threats.
              </p>
            </div>
          </section>

        </article>
      </div>
    </main>
  )
}
