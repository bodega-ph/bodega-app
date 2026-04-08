# Bodega — docs Agent Rules

## Purpose
- These rules apply only to files inside `docs/`.
- Optimize for clarity, accuracy, and maintenance of project documentation.
- Do not place source-code style rules here unless they directly affect documentation examples.

## Documentation Scope
- `docs/PRD.md` should describe product goals, users, workflows, and requirements.
- `docs/ARCHITECTURE.md` should explain system structure, boundaries, data flow, and major technical decisions.
- `docs/DESIGN.md` should cover UX principles, visual direction, and interface guidance.
- Keep each document focused on its own concern and avoid duplicating entire sections across files.

## Writing Style
- Prefer concise, direct language.
- Use clear headings and short sections.
- Write for humans first; avoid unnecessary jargon.
- When using technical terms, keep them consistent across docs.
- Prefer bullets and tables when they improve scanability.

## Documentation Standards
- Keep docs aligned with the current codebase and routing structure.
- Update docs when behavior, architecture, or product flows change.
- Mark assumptions clearly instead of presenting them as facts.
- Use concrete examples tied to this project when helpful.
- Avoid placeholder text that looks final.

## Markdown Conventions
- Use ATX headings (`#`, `##`, `###`).
- Use fenced code blocks with a language tag when possible.
- Keep line length reasonably readable without forcing awkward breaks.
- Prefer relative file references like `src/app/(app)/[orgId]/dashboard/page.tsx` when citing implementation.

## Architecture and Product Accuracy
- Treat docs as secondary to the codebase: if code and docs disagree, update the docs.
- Reflect the org-scoped route structure accurately.
- Keep terminology consistent for modules, features, organizations, memberships, and movements.
- Call out constraints that materially affect implementation, such as org scoping and immutable stock movements.

## Examples and Snippets
- Keep code snippets minimal and correct.
- Prefer examples that match the actual project conventions (`@/` imports, layered architecture, Next.js App Router).
- Remove outdated examples rather than letting them drift.

## Maintenance
- When adding a new docs file, give it a single clear purpose.
- If two docs begin overlapping heavily, consolidate or cross-reference instead of duplicating.
- Preserve important product and architecture decisions in docs when they are no longer obvious from code alone.
