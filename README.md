# @klp/ui

KLP design system — Radix Primitives + Tailwind v4, shadcn-style copy-paste.

**Status:** bootstrap in progress. No components published yet.

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:5173 — token smoke test
pnpm typecheck
```

## Adding a component (once agents are wired)

```bash
/klp-build-component <Figma node name>
```

See [`CLAUDE.md`](./CLAUDE.md) for conventions.

## Install into an existing project

```bash
cd path/to/your/project
npx -p github:BaptisteMo/klp-design-system klep-ds-init
```

> `-p` is required: the package ships two bins (`klp-ui` + `klep-ds-init`), so npx
> can't auto-pick. `npx github:… klep-ds-init` fails with "could not determine
> executable to run" on npm 9+.

Installs the design system into `external/klp-design-system/`, drops OpenCode-flavor agents into `.opencode/`, patches your sub-app's `tsconfig.app.json` + `vite.config.ts` with a `@klp/*` alias, and adds `@klp/ui` as a pinned devDependency in the repo-root `package.json` so the `klp-ui` CLI resolves locally (no global install or PATH setup).

Add or list components on demand. Run from the **repo root** (where `klp-inventory.json` lives) and invoke via `npx` so the locally-installed bin resolves:

```bash
npx klp-ui list              # inventory of installed + available
npx klp-ui add input badges  # install with transitive deps
npx klp-ui list --json       # machine-readable for agents
```

Design spec: [`docs/superpowers/specs/2026-05-19-existing-project-distribution-design.md`](./docs/superpowers/specs/) (if separate). Implementation plan: [`docs/superpowers/plans/2026-05-19-existing-project-distribution.md`](./docs/superpowers/plans/2026-05-19-existing-project-distribution.md).
