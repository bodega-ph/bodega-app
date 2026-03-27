import Link from "next/link";
import { Github, MessageSquare, Terminal, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-zinc-950 overflow-hidden font-mono mt-12">
      {/* Subtle Technical Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative max-w-[1600px] w-full mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SYSTEM IDENTIFIER (Col: 1-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-white/10 bg-zinc-900/30 p-8 lg:p-10 relative group">
            {/* Decorative Tracking Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-500/50" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/20" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/20" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-500/50" />

            <div>
              <div className="flex items-center gap-2 mb-10 text-indigo-500 text-[10px] tracking-widest uppercase font-bold">
                <Terminal className="w-4 h-4" />
                <span>SYS.ID // BODEGA_CORE_PROTOCOL</span>
              </div>

              <Link href="/" className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 text-white group-hover:drop-shadow-[0_0_12px_rgba(99,102,241,0.8)] transition-all">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      d="M5 4h9l6 4.5-4 3.5 4 3.5-6 4.5H5z"
                      strokeWidth="3.5"
                      strokeLinejoin="miter"
                      strokeLinecap="square"
                    />
                  </svg>
                </div>
                <span className="text-3xl font-bold tracking-[0.2em] text-white">
                  BODEGA
                </span>
              </Link>

              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-12 font-sans font-medium">
                Tactical supply chain command. High-fidelity data orchestration
                and immutable movement ledgers built for uncompromising global
                scale.
              </p>
            </div>

            {/* Social Uplinks */}
            <div className="flex items-center gap-4 text-[11px] font-bold tracking-widest flex-wrap">
              <Link
                href="https://github.com"
                className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-zinc-950 text-zinc-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors uppercase"
              >
                <Github className="w-4 h-4" /> [ GITHUB ]
              </Link>
            </div>
          </div>

          {/* DIRECTORY INDEX (Col: 6-8) */}
          <div className="lg:col-span-3 flex flex-col justify-between border border-white/10 bg-zinc-900/30 p-8 lg:p-10 relative">
            <div className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase mb-8 pb-4 border-b border-white/10 flex justify-between">
              <span>// DIR.INDEX</span>
              <span>4 ITEMS</span>
            </div>

            <div className="flex flex-col gap-2 flex-grow">
              <DirectoryLink href="#product" label="Product_Matrix" />
              <DirectoryLink href="#docs" label="Core_Docs" />
              <DirectoryLink href="#api" label="API_Reference" />
              <DirectoryLink href="#pricing" label="Compute_Pricing" />
            </div>
          </div>

          {/* COMM CHANNEL (Col: 9-12) */}
          <div className="lg:col-span-4 flex flex-col justify-between border border-white/10 bg-zinc-900/30 p-8 lg:p-10 relative group">
            <div className="absolute top-0 right-0 w-32 h-1 bg-indigo-500/20" />
            <div>
              <div className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase mb-8 pb-4 border-b border-white/10 flex justify-between">
                <span>// COMM_CHANNEL</span>
                <span>SECURE UPLINK</span>
              </div>

              <p className="text-[13px] text-zinc-400 mb-8 font-sans font-medium">
                Initiate secure uplink to receive protocol updates, active
                movement reports, and core system patches.
              </p>

              <div className="relative flex flex-col xl:flex-row gap-2">
                <input
                  type="email"
                  placeholder="ENTER_EMAIL_"
                  className="flex-grow w-full bg-zinc-950 border border-white/10 focus:border-indigo-500 p-3 lg:p-4 text-xs tracking-widest text-white outline-none placeholder:text-zinc-600 transition-colors"
                />
                <button className="px-6 py-3 lg:py-4 bg-white text-zinc-950 hover:bg-indigo-500 text-[11px] font-bold tracking-[0.2em] transition-colors flex items-center justify-center gap-2 uppercase whitespace-nowrap">
                  Execute <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-sm animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              <span className="text-[10px] text-zinc-500 tracking-widest uppercase truncate">
                AWAITING UPLINK CONFIRMATION...
              </span>
            </div>
          </div>
        </div>

        {/* LOWER LEDGER BAR */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2 text-emerald-400/80">
              <div className="w-1.5 h-1.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              STATUS: OPERATIONAL
            </span>
            <span className="hidden sm:inline-block border-l border-white/10 pl-6 text-indigo-500/60">
              NODE: AP-SOUTHEAST-1
            </span>
            <span className="hidden md:inline-block border-l border-white/10 pl-6 text-indigo-500/60">
              LATENCY: 12ms
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="#privacy"
              className="hover:text-indigo-500 transition-colors hidden sm:block"
            >
              Privacy_Protocol
            </Link>
            <Link
              href="#terms"
              className="hover:text-indigo-500 transition-colors hidden sm:block"
            >
              Terms_of_Service
            </Link>
            <span>© {new Date().getFullYear()} BODEGA </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function DirectoryLink({
  href,
  label,
  badge,
}: {
  href: string;
  label: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 hover:text-indigo-500 transition-all hover:bg-indigo-500/5 p-3 -mx-3 border-l-2 border-transparent hover:border-indigo-500"
    >
      <div className="flex items-center gap-3">
        <span className="text-zinc-600 group-hover:text-indigo-500 transition-colors opacity-50 group-hover:opacity-100">
          {">"}
        </span>
        <span className="lowercase">{label}</span>
      </div>
      {badge && (
        <span className="text-[9px] px-1.5 py-0.5 bg-white/10 text-white group-hover:bg-indigo-500 group-hover:text-zinc-950 transition-colors tracking-widest">
          {badge}
        </span>
      )}
    </Link>
  );
}
