# Bodega App Design System & Style Guide: "Cinematic Prism"

**Version**: 2.0.0 (Updated to match implementation)
**Status**: Active
**Target aesthetic**: Dark Mode, Glassmorphism, Aurora Gradients, Bento Grid

---

## 1. Design Philosophy

The new direction moves beyond standard SaaS minimalism into a high-fidelity **"Cinematic Interface"**.
Key elements:

- **Deep Backgrounds**: `bg-zinc-950` as the base canvas.
- **Aurora Gradients**: Subtle, pulsing blobs of color (`indigo-900/20`, `blue-900/20`) to create depth without distraction.
- **Glassmorphism**: Use of `backdrop-blur-md` and `bg-white/10` (or `bg-zinc-900/40`) to create layered UI elements.
- **Noise Texture**: subtle grain overlays (`opacity-[0.03]`) to add tactility.

---

## 2. Color System (Tailwind Tokens)

### **Neutral Canvas (Dark Mode Only)**

| Token             | Tailwind Class                        | Usage                                 |
| :---------------- | :------------------------------------ | :------------------------------------ |
| **Deep Space**    | `bg-zinc-950`                         | Main application background.          |
| **Glass Surface** | `bg-zinc-900/40 backdrop-blur-3xl`    | Main container/prism background.      |
| **Input Field**   | `bg-zinc-900/50`                      | Form inputs (with `border-zinc-700`). |
| **Border**        | `border-white/5` or `border-zinc-800` | Subtle dividers.                      |
| **Glow Ring**     | `ring-1 ring-white/10`                | High-fidelity edge lighting.          |

### **Brand & Interaction**

- **Primary Action**: `blue-600` (hover `blue-500`)
  - _Effect_: `shadow-[0_0_20px_rgba(37,99,235,0.3)]` (Glow effect).
- **Text Primary**: `text-white` or `text-zinc-100`.
- **Text Secondary**: `text-zinc-400` or `text-zinc-500`.
- **Error**: `bg-rose-500/10 text-rose-200 border-rose-500/20`.

---

## 3. Typography (Inter / Plus Jakarta Sans)

- **Font Family**: `Inter` (sans-serif)
- **Scale**:
  - **H1**: `text-2xl font-bold tracking-tight text-white/90`.
  - **Body**: `text-sm text-zinc-400`.
  - **Input Text**: `text-sm text-white placeholder-zinc-600`.

---

## 4. Layout Patterns

### **The "Prism" Container**

A central glass artifact floating in the void.

```tsx
<div className="relative z-10 w-full max-w-5xl rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-3xl border border-white/5 shadow-2xl ring-1 ring-white/10">
  {/* Content */}
</div>
```

### **Abstract Data Visualization**

Use CSS animations (`animate-spin`, `animate-pulse`) on rounded borders to simulate "living data" cores.

- _Example_: Rotating orbits (`border-indigo-500/30`).
- _Positioning_: Background layer inside the glass container.

---

## 5. Components

### **A. Cinematic Input**

```tsx
<div className="relative group">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 group-focus-within:text-blue-400">
    <Icon className="h-5 w-5" />
  </div>
  <input className="block w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-500/40 transition-all hover:bg-zinc-900/70" />
</div>
```

### **B. Glowing Button**

```tsx
<button className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-all active:scale-[0.98]">
  Action
</button>
```

---

## 6. Implementation Checklist

1.  **Tailwind Config**: Ensure `zinc` colors are prioritized.
2.  **Icons**: Lucide React (`stroke-width={1.5}` or default).
3.  **Animations**: Use `animate-pulse`, `animate-spin` for background elements.
