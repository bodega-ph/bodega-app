# Bodega — src Agent Rules

## Purpose
- These rules apply to code inside `src/`.
- Focus here on coding style, implementation conventions, and runtime safety.
- For architecture and layering boundaries, defer to the project root `AGENTS.md`.

## Build, Lint & Test Commands

### Type Checking
- **Run type check:** `npx tsc --noEmit`
- **CRITICAL:** Always run this before committing or concluding a task.

### Linting
- **Lint entire project:** `npm run lint`
- **Lint specific files:** `npm run lint -- src/features/items/**/*.ts`
- **Lint with auto-fix:** `npm run lint -- --fix`
- Uses Next.js ESLint config (core-web-vitals + TypeScript)

### Build & Development
- **Dev server:** `npm run dev` (http://localhost:3000)
- **Production build:** `npm run build`
- **Production start:** `npm start`

### Database (Prisma)
- **Generate client:** `npx prisma generate` (run after schema changes)
- **Create migration:** `npx prisma migrate dev --name <migration_name>`
- **Apply migrations:** `npx prisma migrate deploy` (production)
- **Reset database:** `npx prisma migrate reset` (development only)
- **Open Studio:** `npx prisma studio`

### Testing
- **Framework:** Vitest with jsdom environment
- **Config:** `vitest.config.ts`
- **Test location:** `src/modules/<domain>/__tests__/`
- **Run all tests:** `npm test` or `npx vitest run`
- **Run single test:** `npx vitest run path/to/file.test.ts`
- **Watch mode:** `npm run test:watch` or `npx vitest`
- **Coverage:** `npm run test:coverage`
- **Integration tests:** Test files can conditionally skip if `DATABASE_URL` not set

## Code Style & Conventions

### Formatting
- **Semicolons:** Required (enforced by ESLint)
- **Quotes:** Double quotes for strings, single quotes for JSX attributes
- **Indentation:** 2 spaces (no tabs)
- **Line length:** Soft limit at 100 characters

### Imports
- Always use the `@/` alias for absolute paths (e.g., `@/features/organizations`, `@/lib/db`).
- Never use relative paths like `../../lib` across major directory boundaries.
- Group imports as: React/Next.js native -> Third-party -> `@/features` -> `@/lib` -> local relative.

### Types & Naming
- Prefer explicit interface definitions for component props and domain models.
- Export reusable feature-facing types from `src/features/<domain>/types.ts` when appropriate.
- Use `PascalCase` for React components, types, and interfaces.
- Use `camelCase` for functions, hooks, and variables.
- Use `kebab-case` for standard project folders.
- Avoid `any`. Use `unknown` if the shape is truly dynamic and validate it.

### Error Handling
- **Server Actions** must return discriminated unions instead of throwing uncaught client-facing errors.
  ```ts
  type ActionResult = { success: true; data: T } | { success: false; error: string };
  ```
- **API Routes** must catch domain errors and return structured JSON with an appropriate status code.
- Never leak raw Prisma or database errors to the client.

### Components
- Default to **server components** in Next.js 16.
- Add `"use client"` only when hooks, browser APIs, or DOM event handlers are required.
- Keep components small and presentation-focused.
- Move business logic into actions, server helpers, or modules.
- Shared UI primitives belong in `src/components/ui/`.
- App shell pieces belong in `src/components/layout/`.
- Domain-specific UI belongs in `src/features/<domain>/components/`.

### Organization Context
- `OrgProvider` is available in `app/(app)/[orgId]/**` routes via layout.
- Server components should continue using `params` directly.
- Client components should use `useOrg()` when it avoids prop drilling.
- Use context for deeply nested client state and org-aware client interactions.
- Prefer plain props for simple server-to-client data flow.

### Styling
- Dark mode only — never add light mode variants.
- Follow Cinematic Prism consistently:
  - base: `bg-zinc-950`
  - surface: `bg-zinc-900/40 backdrop-blur-3xl`
  - border: `border-white/5`
- Reference `src/app/auth/layout.tsx` as the canonical visual baseline.
- Primary actions: `bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]`
- Errors: `bg-rose-500/10 text-rose-200 border-rose-500/20`

## Environment Variables
- Required in `.env`:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
- Optional:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED`
- Environment variables are validated at startup via `src/lib/validate-env.ts`.

## Domain Logic Rules

### Stock Movement Rules
1. Validate auth and org membership for the user.
2. Lock `CurrentStock` row (`SELECT ... FOR UPDATE`) in a transaction.
3. Compute the new quantity based on `MovementType`.
4. Reject the transaction if resulting quantity is below zero.
5. Insert `Movement` as an immutable ledger entry.
6. Update `CurrentStock` in the same transaction.

`ADJUSTMENT` always requires a `reason`.

## Workflow
- Use OpenSpec before non-trivial features or major refactors.
- Source of truth lives in `openspec/specs/` and active changes under `openspec/changes/`.
