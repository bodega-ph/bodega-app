"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="relative px-6 py-32 md:py-48 w-full bg-zinc-950 flex items-center justify-center">
      
      <div className="max-w-[1600px] w-full w-full mx-auto relative z-10">
        {/* Massive Tactical Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative border border-white/10 bg-zinc-900/40 flex flex-col md:flex-row items-center justify-between p-10 md:p-20 overflow-hidden group"
        >
          {/* Tactical Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/40 z-20" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/40 z-20" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/40 z-20" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/40 z-20" />

          {/* Background scanning effect (No glow, pure geometry) */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 transition-opacity duration-1000 group-hover:opacity-40">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="1" strokeOpacity="0.1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-grid)" />
              {/* Scanning horizontal line */}
              <line x1="0" y1="0" x2="100%" y2="0" stroke="#6366f1" strokeWidth="2" strokeOpacity="0.5">
                <animate attributeName="y1" values="-10;110%;-10" dur="8s" repeatCount="indefinite" />
                <animate attributeName="y2" values="-10;110%;-10" dur="8s" repeatCount="indefinite" />
              </line>
            </svg>
          </div>

          {/* Left Side: Heavy Copy */}
          <div className="relative z-10 max-w-xl mb-16 md:mb-0">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 mb-8 bg-zinc-950 border border-indigo-600/30 text-[10px] text-indigo-500 font-mono tracking-widest">
              <span className="w-1.5 h-1.5 bg-indigo-500 block" />
              SYSTEM_READY
            </div>
            
            <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-[1.1] mb-6">
              Deploy strict <br /> inventory control.
            </h2>
            
            <p className="text-zinc-400 font-light text-sm md:text-base leading-relaxed bg-zinc-950/50 p-4 border border-white/5">
              Establish an absolute source of truth today. Zero silent overwrites. Guaranteed data integrity across your entire organizational footprint.
            </p>
          </div>

          {/* Right Side: The Launch Trigger */}
          <div className="relative z-10 flex flex-col items-center md:items-end w-full md:w-auto">
            
            {/* Decorative Targeting Brackets */}
            <div className="relative w-full md:w-auto">
              <div className="absolute -top-2 -left-2 w-2 h-2 border-t border-l border-zinc-500" />
              <div className="absolute -top-2 -right-2 w-2 h-2 border-t border-r border-zinc-500" />
              <div className="absolute -bottom-2 -left-2 w-2 h-2 border-b border-l border-zinc-500" />
              <div className="absolute -bottom-2 -right-2 w-2 h-2 border-b border-r border-zinc-500" />
              
              <Link
                href="/auth/signup"
                className="group flex justify-center items-center bg-indigo-500 hover:bg-white text-zinc-950 font-mono font-medium tracking-widest text-sm md:text-base px-10 py-6 transition-colors duration-300 w-full md:min-w-[320px]"
              >
                [ INITIALIZE_WORKSPACE ]
              </Link>
            </div>

            <div className="mt-8 flex flex-col items-center md:items-end font-mono text-[9px] text-zinc-500 tracking-widest space-y-1.5">
              <span>STATUS: AWAITING_AUTHORIZATION</span>
              <span>ENCRYPTION: AES-256_ACTIVE</span>
              <span>PROTOCOL: DUAL_FACTOR_REQ</span>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
