# Bodega MVP — Software Architecture

**Status:** Aligned to PRD (Tech Stack Option A)

**Tech Stack**
- Frontend: Next.js (App Router) + TypeScript
- Backend: Next.js API routes (MVP)
- Styling: Tailwind CSS
- Database: PostgreSQL
- ORM: Prisma
- Auth: Auth.js (NextAuth v4) + Prisma adapter
- Hosting: Vercel (app) + managed Postgres (provider TBD)

---

**Technical Overview**
Bodega is a single full-stack Next.js application with an append-only inventory ledger and a derived current stock table to guarantee correctness and performance. All data is scoped to organizations. A platform-level System Admin has read-only cross-org visibility for monitoring, while organization roles control operational access.

---

**Architecture Diagram (textual)**
Browser  
→ Next.js App (UI + API routes)  
→ Auth.js (sessions/providers)  
→ Prisma  
→ PostgreSQL (ledger + current stock + org data)

---

**Folder Structure (textual)**
```
bodega-app/
  app/
    (marketing)/
    (app)/
    api/
    auth/
    components/
      ui/
      layout/
    layout.tsx
    page.tsx
    globals.css
  src/
    features/
      account/
      inventory/
      items/
      locations/
      movements/
      organizations/
        actions/
        api/
        components/
        types.ts
        index.ts
  lib/
    auth.ts
    db.ts
    api-auth.ts
  prisma/
    schema.prisma
    migrations/
  public/
  types/
  docs/
    BODEGA_MVP.md
    ARCHITECTURE.md
  .env
  .gitignore
  next.config.ts
  package.json
  tsconfig.json
```

---

**Key Technical Decisions**
- Feature-Driven Architecture encapsulating domain logic, API functions, actions, and components inside `src/features/<domain>`.
- Single Next.js app for UI + API to keep MVP delivery fast and consistent.
- Postgres as system of record with transactions for inventory correctness.
- Ledger-based movements with derived current stock for fast reads.
- Strict org scoping on every query to prevent cross-org leakage.
- System Admin is a global role with read-only cross-org monitoring.

---

**Frontend / Backend / Shared Responsibilities**
Frontend
- Org switching and scoped navigation.
- Item CRUD, movement entry, inventory views.
- Admin monitoring views (org admin) and System Admin dashboard.
- CSV export triggers and download UX.

Backend
- Auth/session validation and org membership checks.
- Ledger writes with transactional stock validation.
- Current stock updates and audit logging.
- CSV export generation (sync for small, async if needed).

Shared
- Domain types (Item, Movement, Org, Membership, Stock).
- Validation rules (e.g., adjustment reason required).
- Error and response contracts.

---

**Core Data Model (Prisma)**
- User, Account, Session, VerificationToken (Auth.js)
- Organization, Membership (role per org)
- Location (single default per org, future multi-location)
- Item (SKU unique per org, soft-deactivate)
- Movement (immutable ledger: RECEIVE, ISSUE, ADJUSTMENT)
- CurrentStock (derived, unique per org/item/location)

---

**Inventory Transaction Flow**
1. Validate auth and org membership.
2. Lock current stock row for item+location.
3. Compute new quantity based on movement type.
4. Reject if new quantity < 0.
5. Insert Movement row (immutable).
6. Update CurrentStock row in same transaction.

---

**Logic Risks & Bug Prevention**
- Negative stock under concurrency: use row-level locks in the transaction.
- Duplicate submissions: require idempotency keys for movement API.
- Cross-org leakage: enforce `org_id` on all queries, plus tests.
- Deactivated items: block movements for inactive items.
- Adjustment misuse: require reason and surface in admin monitoring.

---

**Risks & Constraints**
- Prisma locking may require raw SQL for `SELECT ... FOR UPDATE`.
- Large CSV exports can exceed request timeouts.
- Auth provider configuration is a blocking dependency.
- Thresholds (low stock / large outbound) need explicit product rules.

---

**Open Technical Questions**
1. Managed Postgres provider selection.
2. Auth provider choice (email vs OAuth).
3. Movement quantity rules (integer-only vs decimals).
4. CSV size limits and async export requirement.
5. Monitoring thresholds for "low stock" and "large outbound".
