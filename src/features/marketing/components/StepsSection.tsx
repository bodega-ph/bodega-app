"use client";

import { motion } from "framer-motion";

const steps = [
  {
    id: "01",
    model: "RECEIVE",
    title: "Inject Stock",
    description:
      "Initialize tracking on incoming items. The ledger strictly enforces positive entry constraints.",
    Graphic: () => (
      <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
        {/* Box */}
        <rect
          x="25"
          y="40"
          width="50"
          height="50"
          stroke="#52525b"
          strokeWidth="1"
        />
        <rect
          x="30"
          y="45"
          width="40"
          height="40"
          stroke="#3f3f46"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        {/* Animated Inject line */}
        <path
          d="M 50 0 L 50 40"
          stroke="#3730a3"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          d="M 50 0 L 50 40"
          stroke="#6366f1"
          strokeWidth="2"
          strokeDasharray="10 50"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="-60"
            to="0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
        {/* Arrowhead */}
        <path d="M 45 35 L 50 40 L 55 35" stroke="#6366f1" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: "02",
    model: "ADJUST",
    title: "Reconcile Differences",
    description:
      "Correct discrepancies with a mandatory validation block. No silent overwrites, ever.",
    Graphic: () => (
      <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
        {/* Radar/Target */}
        <circle cx="50" cy="50" r="30" stroke="#52525b" strokeWidth="1" />
        <circle
          cx="50"
          cy="50"
          r="20"
          stroke="#3f3f46"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <circle cx="50" cy="50" r="4" fill="#6366f1" />
        <path
          d="M 50 10 L 50 30 M 50 70 L 50 90 M 10 50 L 30 50 M 70 50 L 90 50"
          stroke="#6366f1"
          strokeWidth="1"
          opacity="0.5"
        />
        {/* Active Scan line */}
        <circle
          cx="50"
          cy="50"
          r="30"
          stroke="#6366f1"
          strokeWidth="1"
          strokeDasharray="10 180"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    ),
  },
  {
    id: "03",
    model: "ISSUE",
    title: "Deploy Assets",
    description:
      "Decrement stock bound to employees or locations. Emits a verifiable exit trace.",
    Graphic: () => (
      <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
        {/* Box */}
        <rect
          x="25"
          y="10"
          width="50"
          height="50"
          stroke="#52525b"
          strokeWidth="1"
        />
        {/* Animated Extract line */}
        <path
          d="M 50 60 L 50 100"
          stroke="#3730a3"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          d="M 50 60 L 50 100"
          stroke="#6366f1"
          strokeWidth="2"
          strokeDasharray="10 50"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="-60"
            to="0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
        {/* Arrowhead */}
        <path d="M 45 95 L 50 100 L 55 95" stroke="#6366f1" strokeWidth="1" />
      </svg>
    ),
  },
];

export default function StepsSection() {
  return (
    <section className="px-6 py-32 w-full border-y border-white/5 bg-zinc-950 relative z-10 overflow-hidden">
      <div className="max-w-[1600px] w-full mx-auto flex flex-col xl:flex-row gap-16 relative z-10">
        {/* Left Column: Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="xl:w-1/3 flex flex-col justify-start pt-2"
        >
          <div className="border-l-2 border-indigo-500 pl-6 mb-8">
            <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-500 font-mono block mb-3">
              Execution Protocols
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-normal leading-[1.1]">
              Anatomy of a<br />
              movement.
            </h2>
          </div>
          <div className="text-sm text-zinc-400 font-mono max-w-md bg-zinc-900/40 p-5 border border-white/8 relative">
            <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />
            Bodega rejects the concept of arbitrary database editing. Every
            inventory change relies on a strict, immutable operation model.
          </div>
        </motion.div>

        {/* Right Column: Execution Stack Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="xl:w-2/3"
        >
          <div className="flex flex-col border border-white/8 bg-zinc-950">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-[80px_120px_1fr] border-b border-white/8 p-2 bg-zinc-900/60">
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest text-center">
                SEQ_ID
              </div>
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest text-center">
                VECTOR
              </div>
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest pl-6">
                PAYLOAD_DIRECTIVE
              </div>
            </div>

            {/* Table Body */}
            {steps.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-1 sm:grid-cols-[80px_120px_1fr] border-b border-white/5 last:border-0 relative group"
              >
                {/* Indigo left accent on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Seq ID */}
                <div className="p-4 sm:border-r border-b sm:border-b-0 border-white/5 flex items-start justify-center pt-6 sm:pt-8 bg-black/20 sm:bg-transparent">
                  <span className="font-mono text-xs text-zinc-600 group-hover:text-indigo-400 transition-colors">
                    [{s.id}]
                  </span>
                </div>

                {/* Graphic */}
                <div className="p-4 sm:border-r border-b sm:border-b-0 border-white/5 flex items-center justify-center bg-zinc-900/10">
                  <s.Graphic />
                </div>

                {/* Payload */}
                <div className="p-6 sm:p-8 flex flex-col justify-center group-hover:bg-zinc-900/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-base font-light text-white">
                      {s.title}
                    </h3>
                    <span className="text-[9px] uppercase font-mono border border-indigo-500/20 text-indigo-500/80 px-2 py-0.5 bg-indigo-500/5 tracking-widest">
                      OP:{s.model}
                    </span>
                  </div>
                  <p className="text-zinc-500 font-mono text-xs leading-relaxed max-w-lg">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
