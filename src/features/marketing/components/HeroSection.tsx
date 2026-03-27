"use client";

import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

function CanvasMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const CELL_SIZE = 80;

    const staticColors = [
      '99, 102, 241', // indigo-500
      '79, 70, 229',  // indigo-600
      '67, 56, 202'   // indigo-700
    ];

    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    let cells: any[] = [];
    const initCells = (w: number, h: number) => {
      cells = [];
      const cols = Math.ceil(w / CELL_SIZE);
      const rows = Math.ceil(h / CELL_SIZE);
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Spatial seed: stable by coordinate, not by linear index
          // This means blocks don't jump when cols/rows change on resize
          const seed = col * 10000 + row;
          const isFilled = pseudoRandom(seed + 42) > 0.82;
          const isNode = isFilled && pseudoRandom(seed + 600) > 0.90;

          const pulseDelay = pseudoRandom(seed + 200) * 4000;
          const pulseDuration = isNode
            ? (0.5 + pseudoRandom(seed) * 1.5) * 1000
            : (3 + pseudoRandom(seed + 400) * 4) * 1000;

          const baseOpacity = isNode
            ? 0.25 + pseudoRandom(seed) * 0.25
            : (isFilled ? 0.04 + pseudoRandom(seed) * 0.06 : 0);

          const colorIndex = Math.floor(pseudoRandom(seed + 300) * 3);

          cells.push({
            baseOpacity,
            isPulsing: isFilled,
            pulseDelay,
            pulseDuration,
            isNode,
            color: staticColors[colorIndex],
            // 1px inset: block sits cleanly inside the CSS grid lines
            x: col * CELL_SIZE + 1,
            y: row * CELL_SIZE + 1,
            w: CELL_SIZE - 2,
            h: CELL_SIZE - 2,
          });
        }
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      // Handle high-DPI displays — reset transform first to prevent accumulation
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initCells(width, height);
    };

    window.addEventListener('resize', resize);
    resize();

    let startTime = performance.now();

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      
      cells.forEach(cell => {
        if (!cell.isPulsing) return;

        const elapsed = time - startTime;
        let progress = ((elapsed + cell.pulseDelay) % cell.pulseDuration) / cell.pulseDuration;
        const pulse = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
        
        const currentOpacity = cell.baseOpacity * (0.4 + pulse * 0.6);

        // Reset shadow for every cell to be safe, but only apply to nodes
        ctx.shadowBlur = 0;
        
        if (cell.isNode) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = `rgba(${cell.color}, ${cell.baseOpacity * 0.8})`;
        }

        ctx.fillStyle = `rgba(${cell.color}, ${currentOpacity})`;
        ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 w-full h-full pointer-events-none"
      style={{
        maskImage: 'radial-gradient(ellipse 120% 120% at 50% 50%, #000 40%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 120% 120% at 50% 50%, #000 40%, transparent 80%)'
      }}
    />
  );
}

function HeroAmbientBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center pointer-events-none opacity-100">
      {/* Base Grid Lines - Moved to z-10 to sit on top of pulses */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: '0 0',
          maskImage: 'radial-gradient(ellipse 120% 120% at 50% 50%, #000 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 120% 120% at 50% 50%, #000 20%, transparent 80%)'
        }}
      />
      
      {/* High-Performance Canvas Matrix - Set to z-0 */}
      <CanvasMatrix />
      
      <div className="absolute inset-0 pointer-events-none z-30 shadow-[inset_0_0_80px_rgba(9,9,11,0.7)]" />
    </div>
  );
}

function ScrambleText({ text, delay = 0 }: { text: string, delay?: number }) {
  const [display, setDisplay] = useState('');
  
  useEffect(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    let iteration = 0;
    let timeout: NodeJS.Timeout;
    
    const scramble = () => {
      setDisplay(text.split('').map((char, index) => {
        if (char === ' ' || char === '\n' || char === ',') return char;
        if (index < iteration) return char;
        return letters[Math.floor(Math.random() * letters.length)];
      }).join(''));
      
      if (iteration < text.length) {
        iteration += 1/3;
        timeout = setTimeout(scramble, 30);
      }
    };
    
    const initialDelay = setTimeout(() => { scramble(); }, delay);
    return () => { clearTimeout(timeout); clearTimeout(initialDelay); };
  }, [text, delay]);
  
  return <span className={display ? 'opacity-100' : 'opacity-0'}>{display || text.replace(/./g, '_')}</span>;
}

const PHRASES = [
  'inventory & supply',
  'stock & workflows',
  'orders & fulfillment',
  'assets & tracking',
];

function RotatingPhrase() {
  const phraseRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let phraseIndex = 0;
    let currentText = PHRASES[0];
    let phase: 'hold' | 'erase' | 'decode' = 'hold';

    const loop = () => {
      const el = phraseRef.current;
      if (!el) return;

      if (phase === 'hold') {
        timeout = setTimeout(() => {
          phase = 'erase';
          loop();
        }, 3000);
      } else if (phase === 'erase') {
        if (currentText.length > 0) {
          currentText = currentText.slice(0, -1);
          el.textContent = currentText;
          timeout = setTimeout(loop, 45);
        } else {
          phraseIndex = (phraseIndex + 1) % PHRASES.length;
          phase = 'decode';
          loop();
        }
      } else if (phase === 'decode') {
        const target = PHRASES[phraseIndex];
        if (currentText.length < target.length) {
          currentText = target.slice(0, currentText.length + 1);
          el.textContent = currentText;
          timeout = setTimeout(loop, 45);
        } else {
          phase = 'hold';
          loop();
        }
      }
    };

    // Initial state setup
    if (phraseRef.current) {
        phraseRef.current.textContent = PHRASES[0];
    }
    
    // Start the loop
    timeout = setTimeout(loop, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">
      <span ref={phraseRef}></span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
        className="text-indigo-400 not-italic"
      >|</motion.span>
    </span>
  );
}


// --- Deterministic pseudo-random helper ---
const pr = (seed: number) => { const x = Math.sin(seed * 127.1 + 311.7) * 43758.5; return x - Math.floor(x); };

// 22 nodes placed across a 500×500 viewBox
const NODE_COUNT = 22;
const W = 500;
const H = 500;
const NODES = Array.from({ length: NODE_COUNT }, (_, i) => ({
  id: i,
  x: 40 + pr(i) * (W - 80),
  y: 40 + pr(i + 100) * (H - 80),
  r: 2 + pr(i + 200) * 3,
  label: pr(i + 300) > 0.6,
}));

// Build edges: connect each node to its 2 nearest neighbours
type Edge = { a: number; b: number; len: number };
const EDGES: Edge[] = [];
for (let i = 0; i < NODE_COUNT; i++) {
  const ni = NODES[i];
  const dists = NODES
    .map((nj, j) => ({ j, d: Math.hypot(ni.x - nj.x, ni.y - nj.y) }))
    .filter(({ j }) => j !== i)
    .sort((a, b) => a.d - b.d)
    .slice(0, 3);
  for (const { j, d } of dists) {
    if (!EDGES.find(e => (e.a === i && e.b === j) || (e.a === j && e.b === i))) {
      EDGES.push({ a: i, b: j, len: d });
    }
  }
}

// Sub-component: one animated light pulse traveling along an edge
function Pulse({ edge, index }: { edge: Edge; index: number }) {
  const na = NODES[edge.a], nb = NODES[edge.b];
  const delay = pr(index * 17 + 5) * 6;
  const dur = 2 + pr(index * 13 + 7) * 3;
  return (
    <motion.circle
      r={2.5}
      fill="rgba(99,102,241,0.95)"
      filter="url(#glow)"
      animate={{
        cx: [na.x, nb.x, na.x],
        cy: [na.y, nb.y, na.y],
        opacity: [0, 1, 1, 0],
      }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function NodeConstellation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[560px] h-auto opacity-90"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 60%, transparent 100%)',
        }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {EDGES.map((e, i) => (
          <line
            key={i}
            x1={NODES[e.a].x} y1={NODES[e.a].y}
            x2={NODES[e.b].x} y2={NODES[e.b].y}
            stroke="rgba(99,102,241,0.15)"
            strokeWidth="0.75"
          />
        ))}

        {/* Traveling light pulses — one per edge */}
        {EDGES.map((e, i) => <Pulse key={i} edge={e} index={i} />)}

        {/* Nodes */}
        {NODES.map((n) => (
          <g key={n.id}>
            {/* Outer halo */}
            <motion.circle
              cx={n.x} cy={n.y}
              r={n.r * 3}
              fill="rgba(99,102,241,0.06)"
              animate={{ r: [n.r * 2.5, n.r * 4, n.r * 2.5], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 3 + pr(n.id + 50) * 3, repeat: Infinity, ease: "easeInOut", delay: pr(n.id + 60) * 2 }}
            />
            {/* Core dot */}
            <motion.circle
              cx={n.x} cy={n.y}
              r={n.r}
              fill={n.label ? 'rgba(129,140,248,1)' : 'rgba(99,102,241,0.7)'}
              filter={n.label ? 'url(#nodeGlow)' : undefined}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5 + pr(n.id + 70) * 2, repeat: Infinity, ease: "easeInOut", delay: pr(n.id + 80) * 2 }}
            />
            {/* Key node labels */}
            {n.label && (
              <text
                x={n.x + n.r + 4}
                y={n.y + 3.5}
                fontSize="6"
                fill="rgba(129,140,248,0.55)"
                fontFamily="monospace"
                letterSpacing="0.5"
              >
                WH-{String(n.id).padStart(2, '0')}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-end bg-zinc-950 overflow-hidden pt-20 pb-20">
      
      {/* Full-bleed Ambient Grid */}
      <HeroAmbientBackground />

      {/* Flush-left editorial content */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 pb-4">

        {/* Mega flush-left headline */}
        <motion.h1
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="font-light font-sans tracking-normal text-white leading-[1.1]"
          style={{ fontSize: 'clamp(2rem, 5.5vw, 5.5rem)' }}
        >
          <span className="block">Your single</span>
          <span className="block">source of truth for</span>
          <span className="block">
            <RotatingPhrase />
          </span>
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="mt-8 max-w-md text-zinc-400 text-base leading-relaxed font-sans"
        >
          Real-time inventory ledger with cryptographic integrity. Every movement recorded, nothing ever revised.
        </motion.p>

        {/* CLI-style CTAs */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="mt-10 flex flex-row items-center gap-4 font-mono text-sm tracking-wide"
        >
          <Link
            href="/auth/signup"
            className="px-8 py-4 bg-indigo-500 text-zinc-950 font-bold hover:bg-white uppercase transition-all shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] flex items-center gap-3"
          >
            <span className="animate-pulse w-2 h-4 bg-zinc-950 inline-block" />
            get_started
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 text-zinc-400 hover:text-white uppercase transition-colors flex items-center gap-2"
          >
            <span className="text-zinc-600 font-bold">&gt;</span> read_docs()
          </Link>
        </motion.div>

        {/* Trust badge bar */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="mt-14 flex items-center gap-8 text-[10px] text-zinc-600 font-mono uppercase tracking-widest border-t border-white/5 pt-8"
        >
          <span className="flex items-center gap-2"><span className="w-1 h-1 bg-zinc-700" />SOC2 Type II</span>
          <span className="flex items-center gap-2"><span className="w-1 h-1 bg-zinc-700" />Immutable Ledger</span>
          <span className="flex items-center gap-2"><span className="w-1 h-1 bg-zinc-700" />E2E Encryption</span>
        </motion.div>

      </div>
    </section>
  );
}
