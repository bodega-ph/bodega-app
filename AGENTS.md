# Bodega — Project Agent Rules

## Architecture & Code Organization

### Layered Architecture
Bodega uses a **clean layered architecture** separating business logic from presentation:

```
┌─────────────────────────────────────────────────────┐
│  src/features/          (Presentation Layer)        │
│  └── Components, Actions, Hooks, Server re-exports  │
└─────────────────────────────────────────────────────┘
                        ↓ imports from
┌─────────────────────────────────────────────────────┐
│  src/modules/           (Domain/Business Layer)     │
│  └── Service, Repository, Types, Errors, Tests      │
└─────────────────────────────────────────────────────┘
                        ↓ queries
┌─────────────────────────────────────────────────────┐
│  Prisma → PostgreSQL                                │
└─────────────────────────────────────────────────────┘
```

### Module Convention (Domain Layer)

**Location:** `src/modules/<domain>/`

**Purpose:** Encapsulates all business logic, data access, and domain rules.

**Structure:**
```
src/modules/<domain>/
├── __tests__/          # Integration tests
├── repository.ts       # Prisma data access (INTERNAL to module)
├── service.ts          # Public API (validation + business logic)
├── types.ts            # Domain types and DTOs
├── errors.ts           # Domain-specific error classes
└── index.ts            # Public exports barrel
```

**Rules:**
- **Repository layer** (`repository.ts`) — Direct Prisma queries. **NEVER import outside the module.**
- **Service layer** (`service.ts`) — Validates input, orchestrates business logic, calls repository.
- **Public API** — Only `index.ts` and `service.ts` exports are importable from outside.
- **No cross-module Prisma queries** — Modules call each other through service APIs only.
- **Error handling** — Throw domain-specific errors (e.g., `ItemApiError`) from service layer.

**Example:**
```ts
// ❌ BAD: Don't import repository from features
import { findItemById } from "@/modules/items/repository";

// ✅ GOOD: Import from module barrel (service API)
import { getItems, validateForMovement } from "@/modules/items";
```

### Feature Convention (Presentation Layer)

**Location:** `src/features/<domain>/`

**Purpose:** UI components, server actions, and React hooks for user-facing functionality.

**Structure:**
```
src/features/<domain>/
├── actions/            # Server actions with "use server"
├── components/         # React components (server or client)
├── hooks/              # Client-side hooks (if needed)
├── types.ts            # Feature-specific types (often re-exports)
├── index.ts            # Client-safe exports (components, hooks)
└── server.ts           # Re-exports from @/modules/<domain>
```

**Rules:**
- **Features call modules** — Import from `@/modules/<domain>`, never from Prisma directly.
- **server.ts** — Re-exports module APIs for use in server components/actions.
- **index.ts** — Client-safe exports only (no module imports with Prisma).
- **Components** — Default to server components. Use `"use client"` only when needed.

**Example:**
```ts
// src/features/items/server.ts
export { getItems, createItem, deleteItem } from "@/modules/items";

// src/features/items/actions/create-item.ts
import { createItem } from "@/modules/items"; // Direct module import OK in actions
```

### Cross-Layer Dependencies
- **Modules → Modules:** Call through service APIs (exported from `index.ts`)
- **Features → Modules:** Import from `@/modules/<domain>`
- **Features → Features:** Rare, but import from `@/features/<domain>` barrel exports
- **Shared types:** `src/features/shared/types.ts` for cross-feature DTOs

### Route Organization
- Single Next.js 16 App Router app. Route groups:
  - `src/app/(app)/` — protected pages, auth checked via `getServerSession()`.
  - Marketing site extracted to separate `bodega-marketing` repository (Astro).
- Auth pages live at `src/app/auth/` outside route groups (own layout).
- `src/app/` should mostly contain route handlers and page layouts wrapping feature components.

---

## Critical Rules

### Prisma Database
- **Always run `npx prisma generate` after any schema change** before building or type-checking.
- Always scope every query with `orgId` — no exceptions, no cross-org leakage.
- Use `$transaction` for any data movement that touches `CurrentStock`.
- Never update or delete `Movement` rows — immutable ledger only.

### Authentication
- API routes must validate auth via `lib/api-auth.ts` — never trust client input.
- The `(app)` layout handles redirects for unauthenticated users — don't add duplicate checks in page components.
- Session contains `id`, `email`, `name`, `role` (SystemRole). **Organization role is NOT in session**, it must be queried from the `Membership` table using `orgId`.
