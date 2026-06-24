import Link from "next/link";
import { Shield, ChevronRight, Terminal, Crosshair, Lock, Search, Cpu, Archive } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-300 selection:bg-cyan-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Shield size={18} />
            </div>
            <span className="font-bold text-white tracking-wide">Cikopiboysec</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/targets" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Documentation
            </Link>
            <Link href="/targets" className="btn-primary py-1.5 px-4 rounded-full">
              Enter Workspace
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              AI Security Research OS v1.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              Defensive Security for the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Agentic AI Era
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              A unified workspace for security researchers to map endpoints, test prompt robustness, inspect auth flows, and generate vulnerability reports for AI-driven applications.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/targets" className="btn-primary h-12 px-8 rounded-full text-base font-medium flex items-center gap-2 group">
                Launch Workspace
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="h-12 px-8 rounded-full text-base font-medium flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white">
                View Features
              </a>
            </div>
          </div>

          {/* Hero Image/Mockup */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20" />
            <div className="relative rounded-2xl bg-[#0F1115] border border-white/10 shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              {/* Mockup UI representation */}
              <div className="w-full h-full flex flex-col">
                <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-black/40">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
                    <div className="h-32 rounded-xl bg-white/5 border border-white/10 p-5 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400"><Crosshair size={16}/></div>
                      <div>
                        <div className="text-2xl font-bold text-white">12</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Active Targets</div>
                      </div>
                    </div>
                    <div className="h-32 rounded-xl bg-white/5 border border-white/10 p-5 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400"><Lock size={16}/></div>
                      <div>
                        <div className="text-2xl font-bold text-white">48</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Security Findings</div>
                      </div>
                    </div>
                    <div className="h-32 rounded-xl bg-white/5 border border-white/10 p-5 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Terminal size={16}/></div>
                      <div>
                        <div className="text-2xl font-bold text-white">156</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Prompt Tests</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">A Complete Research Universe</h2>
            <p className="text-zinc-400 max-w-2xl">Stop jumping between disjointed notes and text files. Cikopiboysec centers everything around the target to keep your research traceable and strictly organized.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Search, title: "Endpoint Discovery", desc: "Map hidden routes, websocket streams, and undocumented APIs automatically.", color: "text-blue-400", bg: "bg-blue-400/10" },
              { icon: Terminal, title: "Prompt Behavior Lab", desc: "Inject context overrides, test role confusion, and measure AI robustness against jailbreaks.", color: "text-emerald-400", bg: "bg-emerald-400/10" },
              { icon: Cpu, title: "Tools Mapper", desc: "Reverse engineer and catalog AI tool calling parameters to find RCE and SSRF vectors.", color: "text-purple-400", bg: "bg-purple-400/10" },
              { icon: Lock, title: "Auth Flow Inspector", desc: "Analyze JWT lifecycles, session hijacking potential, and OAuth misconfigurations.", color: "text-amber-400", bg: "bg-amber-400/10" },
              { icon: Archive, title: "Evidence Vault", desc: "Store immutable HTTP request/response pairs and screenshots linked directly to findings.", color: "text-red-400", bg: "bg-red-400/10" },
              { icon: Shield, title: "Automated Reporting", desc: "Compile findings, evidence, and reproduction steps into professional markdown reports.", color: "text-cyan-400", bg: "bg-cyan-400/10" },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#12141A] border border-white/5 hover:border-white/10 transition-colors group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color}`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500/5" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to secure the AI frontier?</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Deploy Cikopiboysec locally and start mapping vulnerabilities in modern AI applications with surgical precision.
          </p>
          <Link href="/targets" className="btn-primary h-14 px-10 rounded-full text-lg font-medium inline-flex items-center gap-2">
            Start Researching Now <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-sm text-zinc-500">
        <p>Built with Next.js, Prisma, and Tailwind CSS. <br className="md:hidden"/> Designed for defensive security research.</p>
      </footer>
    </div>
  );
}
