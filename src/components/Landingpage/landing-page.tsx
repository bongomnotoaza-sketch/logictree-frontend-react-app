"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Code2, Sigma, Atom } from "lucide-react";
import picImage from './pic.jpeg';
import { GitBranch } from "lucide-react";

// ---------------------------------------------------------------------------
// LogicTree Academy — landing page
// Dark theme: near-black background, dark gray-green surfaces, muted dark
// green accent, off-white foreground. Built with shadcn/ui (Button) + Tailwind.
//
// Requires: shadcn/ui `button` component installed, and `lucide-react`.
//   npx shadcn@latest add button
//   npm install lucide-react
// ---------------------------------------------------------------------------

const codeSnippet = `import math

def range_of(v, angle_deg, g=9.81):
    angle = math.radians(angle_deg)
    return (v**2 * math.sin(2*angle)) / g

for angle in [15, 30, 45, 60, 75]:
    r = range_of(20, angle)
    print(f"{angle:>2}\u00B0  ->  {r:.1f} m")`;

const codeOutput = `15\u00B0  ->  20.4 m
30\u00B0  ->  35.3 m
45\u00B0  ->  40.8 m
60\u00B0  ->  35.3 m
75\u00B0  ->  20.4 m`;

const NAV_LINKS = [
  { href: "#bridge", label: "The gap" },
  { href: "#domains", label: "How it works" },
  { href: "#founder", label: "Founder" },
  { href: "#contact", label: "Contact" },
];

interface LandingPageProps {
  /** Called when the user clicks a "start building" / "create account" / "log in" CTA.
   *  For now this just switches the app into the login/dashboard view. */
  onStartBuilding?: () => void;
}

export default function LandingPage({ onStartBuilding }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-[#070a09] text-[#f4f6f4] font-sans antialiased">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[999] focus:bg-[#101613] focus:border focus:border-[#232f29] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      {/* NAV */}
      <header
        className={`fixed top-0 inset-x-0 z-50 border-b transition-colors duration-300 ${
          scrolled
            ? "bg-[#070a09]/90 backdrop-blur border-[#232f29]"
            : "bg-transparent border-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-zinc-950 shadow-[0_0_14px_2px_rgba(16,185,129,0.45)]">
        <GitBranch className="h-4.5 w-4.5" strokeWidth={2.25} />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold tracking-tight">
          <span className="text-white">Logic</span>
          <span className="text-emerald-500">Tree</span>
        </div>
        <div className="text-[11px] text-zinc-500">by Alikho Mnotoza</div>
      </div>
          </a>

          <div className="hidden md:flex items-center gap-7 text-sm text-[#8a9c94]">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-[#f4f6f4] transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={onStartBuilding}
              className="hidden sm:block text-[#f4f6f4] hover:bg-[#10161380] hover:text-[#f4f6f4]"
            >
              Log in
            </Button>
            <a href="/signup">
              <Button className="bg-[#1f5c3f] text-[#eafaf1] hover:bg-[#276b49]">Sign up</Button>
            </a>
            <button
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden ml-1 p-2 -mr-2 rounded-md hover:bg-[#10161380]"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-b border-[#232f29] bg-[#070a09]">
            <div className="px-5 pb-5 pt-1 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 rounded-md text-sm hover:bg-[#10161380]"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onStartBuilding?.();
                }}
                className="px-3 py-2.5 rounded-md text-sm text-left hover:bg-[#10161380]"
              >
                Log in
              </button>
            </div>
          </div>
        )}
      </header>

      <main id="main">
        {/* HERO */}
        <section
          id="top"
          className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop')",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(7,10,9,0.82) 0%, rgba(7,10,9,0.90) 55%, #070a09 100%)",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-14 md:gap-10 items-center">
            <div>
              <p className="text-sm text-[#5fa382] font-medium mb-5">LogicTree Academy</p>
              <h1 className="font-semibold text-[2.4rem] sm:text-5xl lg:text-[3.3rem] leading-[1.08] tracking-tight">
                Where curiosity is the only prerequisite
              </h1>
              <p className="mt-6 text-[#8a9c94] text-base md:text-lg max-w-md leading-relaxed">
                LogicTree pairs coding with the maths and physics behind it — no expensive
                courses, no abstract theory. Just concepts you can build with.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={onStartBuilding}
                  className="bg-[#1f5c3f] text-[#eafaf1] hover:bg-[#276b49]"
                >
                  Start building
                </Button>
                <a href="#bridge">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#232f29] bg-[#1a1f1a] text-[#f4f6f4] hover:bg-[#101613] hover:border-[#276b49]"
                  >
                    See how it works
                  </Button>
                </a>
              </div>
            </div>

            <div>
              <div className="rounded-xl border border-[#232f29] bg-[#101613] shadow-2xl shadow-black/50 overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#232f29] bg-[#171f1b]">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="ml-2 text-xs text-[#8a9c94] font-mono">projectile.py</span>
                </div>
                <pre className="font-mono text-[12.5px] sm:text-[13px] leading-[1.7] px-5 py-5 overflow-x-auto whitespace-pre">
                  <code>{codeSnippet}</code>
                </pre>
                <div className="border-t border-[#232f29] bg-[#171f1b] px-5 py-4 font-mono text-[12.5px] sm:text-[13px] leading-[1.7] text-[#f4f6f4]/90 whitespace-pre">
                  {codeOutput}
                </div>
                <div className="px-5 py-3 text-xs text-[#8a9c94] border-t border-[#232f29]">
                  Same equation from the textbook. Now it answers a question you asked.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE GAP */}
        <section id="bridge" className="border-t border-[#232f29] py-24">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <div className="max-w-xl mb-14">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                The gap most learners get stuck in
              </h2>
              <p className="mt-4 text-[#8a9c94] leading-relaxed">
                Maths and physics are taught as things to memorise. Coding is taught as something
                you need money and hardware to start. Neither has a reason to exist for you yet.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-[#232f29] rounded-xl overflow-hidden border border-[#232f29]">
              <div className="bg-[#070a09] p-8 md:p-10">
                <h3 className="text-base font-medium mb-5 text-[#8a9c94]">The usual path</h3>
                <ul className="space-y-4 text-[15px] text-[#8a9c94] leading-relaxed">
                  <li className="flex gap-3">
                    <span className="text-[#232f29] mt-0.5">—</span>
                    <span>Equations first, applications later — if ever.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#232f29] mt-0.5">—</span>
                    <span>
                      Bootcamps, licences and hardware that cost more than the skill is worth to
                      you yet.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#232f29] mt-0.5">—</span>
                    <span>Coding exercises with no connection to what you're actually studying.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#101613] p-8 md:p-10">
                <h3 className="text-base font-medium mb-5 text-[#f4f6f4]">The LogicTree path</h3>
                <ul className="space-y-4 text-[15px] text-[#f4f6f4]/90 leading-relaxed">
                  <li className="flex gap-3">
                    <span className="text-[#5fa382] mt-0.5">—</span>
                    <span>Learn a concept, then turn it into working code the same day.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#5fa382] mt-0.5">—</span>
                    <span>Start free, on any phone — no lab, licence or laptop required.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#5fa382] mt-0.5">—</span>
                    <span>Every equation gets a job: a simulation, a solver, something you built.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* THREE DOMAINS */}
        <section id="domains" className="border-t border-[#232f29] py-24">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <div className="max-w-xl mb-14">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                One logic, three subjects
              </h2>
              <p className="mt-4 text-[#8a9c94] leading-relaxed">
                Coding, maths and physics aren't separate tracks here. Each lesson moves through
                all three, in the order that makes the others make sense.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-10 sm:gap-8">
              <div>
                <Code2 size={26} color="#5fa382" strokeWidth={1.6} />
                <h3 className="font-medium text-lg mt-5 mb-2">Coding</h3>
                <p className="text-[15px] text-[#8a9c94] leading-relaxed">
                  The material you shape. You write real programs from the first lesson, not
                  syntax drills in isolation.
                </p>
              </div>
              <div>
                <Sigma size={26} color="#f4f6f4" strokeWidth={1.4} />
                <h3 className="font-medium text-lg mt-5 mb-2">Maths</h3>
                <p className="text-[15px] text-[#8a9c94] leading-relaxed">
                  The logic underneath. Every formula gets used the same week, in code you wrote
                  yourself.
                </p>
              </div>
              <div>
                <Atom size={26} color="#8a9c94" strokeWidth={1.4} />
                <h3 className="font-medium text-lg mt-5 mb-2">Physics</h3>
                <p className="text-[15px] text-[#8a9c94] leading-relaxed">
                  The world you model. Simulate motion, forces and waves, and watch the concept
                  behave before you fully trust it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOUNDER */}
        <section id="founder" className="border-t border-[#232f29] py-24">
          <div className="max-w-3xl mx-auto px-5 md:px-8">
            <div className="flex flex-col sm:flex-row gap-7 items-start">
              <img
                src={picImage}
                alt="Alikho Mnotoza, founder of LogicTree Academy"
                className="h-16 w-16 rounded-full object-cover border border-[#232f29] flex-shrink-0"
              />
              <div>
                <p className="text-lg md:text-xl leading-relaxed text-[#f4f6f4]/90 font-medium">
                  Coding, maths and physics aren't separate subjects — they're one way of
                  thinking, taught three different ways. LogicTree exists to bridge the gap
                  between knowing and doing.
                </p>
                <p className="mt-5 text-sm text-[#8a9c94]">
                  Alikho Mnotoza, Founder &amp; CEO, LogicTree Academy
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MOTTO + CTA + CONTACT */}
        <section id="contact" className="relative border-t border-[#232f29] py-28 overflow-hidden">
          <div className="absolute inset-0 bg-[#101613]" />
          <div className="relative max-w-3xl mx-auto px-5 md:px-8 text-center">
            <p className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              One logic, everywhere.
            </p>
            <p className="mt-6 text-[#8a9c94] max-w-md mx-auto leading-relaxed">
              Start on any phone, tablet or laptop — no cost to begin. All you need is curiosity.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                onClick={onStartBuilding}
                className="bg-[#1f5c3f] text-[#eafaf1] hover:bg-[#276b49]"
              >
                Create your account
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onStartBuilding}
                className="border-[#232f29] text-[#f4f6f4] hover:bg-[#10161380] hover:border-[#276b49]"
              >
                Log in
              </Button>
            </div>

            <div className="mt-16 grid sm:grid-cols-3 gap-6 text-left border-t border-[#232f29] pt-10">
              <a href="mailto:admin@logictree.co.za" className="block hover:opacity-80 transition-opacity">
                <p className="text-xs text-[#8a9c94] mb-1">Email</p>
                <p className="text-sm">admin@logictree.co.za</p>
              </a>
              <a href="tel:+27694458687" className="block hover:opacity-80 transition-opacity">
                <p className="text-xs text-[#8a9c94] mb-1">Call or WhatsApp</p>
                <p className="text-sm">069 445 8687</p>
              </a>
              <div>
                <p className="text-xs text-[#8a9c94] mb-1">Registered as</p>
                <p className="text-sm">LogicTree (Pty) Ltd</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#232f29] py-9">
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-[#8a9c94]">
          <p>LogicTree (Pty) Ltd, Enterprise Number 2026/606988/07. Registered in South Africa.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#f4f6f4] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#f4f6f4] transition-colors">Terms</a>
            <a href="#contact" className="hover:text-[#f4f6f4] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}