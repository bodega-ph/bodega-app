"use client";

import { motion } from "framer-motion";
import React from "react";

// Graphic 1: The Vector Map (No Glow)
const VectorNetwork = () => (
  <svg className="w-full h-full object-contain p-4" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid meet">
    {/* Crisp grid lines */}
    <pattern id="dot-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="1" height="1" fill="#3f3f46" /> {/* zinc-700 */}
    </pattern>
    <rect x="0" y="0" width="400" height="120" fill="url(#dot-grid)" />
    
    {/* Hard Edge Paths */}
    <path d="M 50 60 L 150 20 L 250 60 L 350 30" fill="none" stroke="#52525b" strokeWidth="1" />
    <path d="M 150 20 L 150 100 L 250 60" fill="none" stroke="#52525b" strokeWidth="1" />
    
    {/* Animated flow (Solid, NO GLOW) */}
    <path d="M 50 60 L 150 20 L 250 60 L 350 30" fill="none" stroke="#000000" strokeWidth="3" />
    <path d="M 50 60 L 150 20 L 250 60 L 350 30" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="50 350" strokeDashoffset="0">
      <animate attributeName="stroke-dashoffset" from="400" to="0" dur="3s" repeatCount="indefinite" />
    </path>
    <path d="M 150 20 L 150 100 L 250 60" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="20 200" strokeDashoffset="0">
      <animate attributeName="stroke-dashoffset" from="220" to="0" dur="2.5s" repeatCount="indefinite" />
    </path>
    
    {/* Nodes (Solid squares) */}
    <rect x="48" y="58" width="4" height="4" fill="#a1a1aa" />
    <rect x="148" y="18" width="4" height="4" fill="#6366f1" />
    <rect x="248" y="58" width="4" height="4" fill="#a1a1aa" />
    <rect x="348" y="28" width="4" height="4" fill="#a1a1aa" />
    <rect x="148" y="98" width="4" height="4" fill="#a1a1aa" />

    {/* Tactical Labels */}
    <text x="156" y="22" fill="#6366f1" fontSize="8" fontFamily="monospace" letterSpacing="1">WH-ALPHA</text>
    <text x="256" y="62" fill="#a1a1aa" fontSize="8" fontFamily="monospace" letterSpacing="1">WH-BETA</text>
  </svg>
)

// Graphic 2: Immutable Target (Append Log)
const AppendLog = () => {
  const logs = [
    { id: "e3b0c442", op: "INIT_ENV", status: "OK" },
    { id: "9b12a551", op: "RECV_STK", status: "OK" },
    { id: "7c98f121", op: "ISU_ORDR", status: "OK" },
    { id: "4a33b919", op: "ADJ_AUDT", status: "OK" },
    { id: "f2a1b9c3", op: "SYNC_VLD", status: "OK" },
    { id: "8d44e712", op: "ISU_ORDR", status: "OK" },
  ];
  // Duplicate array for seamless infinite vertical scrolling
  const scrollItems = [...logs, ...logs];

  return (
    <div className="w-full h-full max-h-[140px] font-mono text-[10px] flex flex-col p-4 relative">
      <div className="grid grid-cols-3 gap-2 border-b border-zinc-800 pb-2 mb-2 w-full z-10 shrink-0">
        <span className="text-zinc-600">HASH</span>
        <span className="text-zinc-600 text-center">STATE</span>
        <span className="text-zinc-600 text-right">STATUS</span>
      </div>
      
      <div 
        className="relative flex-1 overflow-hidden w-full pt-1"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <div className="flex flex-col space-y-2 absolute top-0 left-0 right-0 animate-infinite-scroll-y">
          {scrollItems.map((log, i) => (
             <div key={i} className="grid grid-cols-3 gap-2 items-center w-full">
               <span className="text-zinc-500">[{log.id}]</span>
               <span className="text-white text-center">{log.op}</span>
               <span className="text-indigo-500 text-right">{log.status}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Graphic 3: Access Matrix
const AccessMatrix = () => (
  <div className="w-full h-full max-h-[140px] flex flex-col justify-center items-center w-full">
    <div className="grid grid-cols-4 gap-1 w-full max-w-[200px]">
      <div className="text-[8px] text-zinc-600 font-mono mb-2">ROLE</div>
      <div className="text-[8px] text-zinc-600 font-mono mb-2 text-center">RD</div>
      <div className="text-[8px] text-zinc-600 font-mono mb-2 text-center">WR</div>
      <div className="text-[8px] text-zinc-600 font-mono mb-2 text-center">EX</div>
      
      {['SYS_ADM', 'WH_MGR', 'AUDIT'].map((role, rIdx) => (
        <React.Fragment key={role}>
          <div className={`text-[10px] font-mono leading-none flex items-center ${role === 'SYS_ADM' ? 'text-indigo-500' : 'text-zinc-500'}`}>{role}</div>
          {[1,2,3].map((col) => {
            const hasAccess = rIdx === 0 || (rIdx === 1 && col < 3) || (rIdx === 2 && col === 1);
            return (
              <div key={col} className="flex justify-center items-center h-5">
                <motion.div 
                  animate={hasAccess ? { opacity: [0.2, 1, 0.2] } : {}}
                  transition={{ repeat: Infinity, duration: 2 + (col * 0.5), delay: rIdx * 0.2 }}
                  className={`w-2 h-2 ${hasAccess ? (role === 'SYS_ADM' ? 'bg-indigo-500' : 'bg-white') : 'bg-transparent border border-white/10'}`} 
                />
              </div>
            )
          })}
        </React.Fragment>
      ))}
    </div>
  </div>
)

// Graphic 4: Precision Chart
const PrecisionBars = () => (
  <div className="w-full h-full max-h-[140px] flex items-end justify-between px-6 pt-10 w-full relative">
    <div className="absolute top-4 left-6 border border-indigo-600/30 bg-indigo-600/5 px-2 py-0.5 text-[9px] font-mono text-indigo-500">
      LIVE_FEED
    </div>
    {/* Grid line */}
    <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-white/5" />

    {[40, 70, 45, 90, 65, 30, 80, 50, 60, 100, 30, 40].map((h, i) => (
       <div key={i} className="w-[6%] relative flex flex-col justify-end" style={{ height: '100%' }}>
          <motion.div 
            initial={{ height: "10%" }}
            whileInView={{ height: [`10%`, `${h}%`, `${Math.max(10, h - 20)}%`, `${Math.min(100, h + 15)}%`, `${h}%`] }}
            viewport={{ once: true }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", delay: i * 0.1, ease: "easeInOut" }}
            className={`w-full border-t border-l border-r border-b-0 ${i === 9 ? 'bg-indigo-500 border-indigo-500' : 'bg-zinc-800 border-zinc-600'}`}
          />
       </div>
    ))}
    {/* Floor line */}
    <div className="absolute bottom-0 left-0 w-full border-t border-white/20" />
  </div>
)

function HudPanel({ title, description, badge, graphic, className = "", delay = 0 }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`relative border border-white/5 bg-zinc-950 flex flex-col group overflow-hidden ${className}`}
    >
      {/* Tactical Corner Accents (No Glow, sharp lines) */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/40" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/40" />

      {/* Graphic Area (Sits on top/middle) */}
      <div className="relative border-b border-zinc-900 bg-zinc-900/20 flex flex-col justify-center h-[180px]">
         {graphic}
      </div>

      {/* Info Bar */}
      <div className="p-5 flex justify-between items-start flex-col gap-2">
         {badge && (
          <span className="text-[10px] font-mono text-indigo-500 tracking-widest uppercase flex items-center gap-2">
            <span className="w-1 h-1 bg-indigo-500" />
            {badge}
          </span>
         )}
         <h3 className="text-lg font-normal text-white tracking-wide leading-none mt-2">{title}</h3>
      </div>

      {/* Description */}
      <div className="px-5 pb-6 pt-1 flex-1 flex flex-col">
        <p className="text-sm font-light text-zinc-400 leading-relaxed font-sans mt-0">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

export default function FeaturesGrid() {
  return (
    <section id="features" className="px-6 py-32 max-w-[1600px] w-full mx-auto w-full relative z-10 bg-zinc-950">
      
      {/* Strict Header (Tactical) */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div className="border-l border-indigo-500 pl-6 border-solid">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-indigo-500 block mb-4">
            Global Operations
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white leading-[1.1]">
            Logistics.<br/>Command & Control.
          </h2>
        </div>
        <p className="text-sm text-zinc-400 font-light max-w-md bg-zinc-900/50 p-4 border border-zinc-800 relative shadow-inner">
          <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-zinc-500" />
          Abandon spreadsheets. Monitor, trace, and control multi-facility inventory through a strict, high-fidelity command interface.
        </p>
      </motion.div>

      {/* Tactical Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HudPanel 
          title="Global Node Network" 
          badge="WMS-NATIVE"
          graphic={<VectorNetwork />} 
          description="Deploy independent tracking instances across multiple warehouses. Each active node operates under strict organizational isolation."
          delay={0}
        />

        <HudPanel 
          title="Immutable Append Log" 
          badge="TX-VERIFIED"
          graphic={<AppendLog />} 
          description="Data history cannot be rewritten or corrupted. Every receipt, stock issuance, and manual adjustment is permanently hashed to the ledger."
          delay={0.1}
        />

        <HudPanel 
          title="Role-Based Security Matrix" 
          badge="RBAC-LOCKED"
          graphic={<AccessMatrix />} 
          description="Engineered access controls. Delegate precise read, write, and execution boundaries down to the individual operator level."
          delay={0.2}
        />

        <HudPanel 
          title="Real-Time Telemetry" 
          badge="STREAMING"
          graphic={<PrecisionBars />} 
          description="Instant throughput visibility without manual batch processing. Monitor inventory levels and systemic demand immediately as transactions settle."
          delay={0.3}
        />
      </div>

    </section>
  );
}
