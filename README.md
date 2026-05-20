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
npx github:BaptisteMo/klp-design-system klep-ds-init
```

Installs the design system into `external/klp-design-system/`, drops OpenCode-flavor agents into `.opencode/`, and patches your sub-app's `tsconfig.app.json` + `vite.config.ts` with a `@klp/*` alias.

Add or list components on demand (`klp-ui` bin):

```bash
klp-ui list                  # inventory of installed + available
klp-ui add input badges      # install with transitive deps
klp-ui list --json           # machine-readable for agents
```

Design spec: [`docs/superpowers/specs/2026-05-19-existing-project-distribution-design.md`](./docs/superpowers/specs/) (if separate). Implementation plan: [`docs/superpowers/plans/2026-05-19-existing-project-distribution.md`](./docs/superpowers/plans/2026-05-19-existing-project-distribution.md).
