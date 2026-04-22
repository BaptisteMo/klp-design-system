# SideBar Opinionated Tree — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `SideBar`'s consumer-configurable `menuItems` with an opinionated, hardcoded 11-row navigation tree, and switch highlight management to `activeKey` + `activeChildKey` props.

**Architecture:** Tree lives in `src/components/sidebar/menu.ts` as a typed `as const` array. `SideBar.tsx` imports it, renders top rows with `ItemSideBar` and sub-rows with `ActionSheetItem`, and derives `state` on each row from the two active keys. A single `onNavigate(key, parentKey?)` callback is emitted on leaf clicks; parents-with-children expand without firing navigation.

**Tech Stack:** React 19, TypeScript, Tailwind v4 (`--klp-*` aliases), `class-variance-authority`, Radix Collapsible (via `ItemSideBar`), lucide-react icons.

**Spec:** `docs/superpowers/specs/2026-04-22-sidebar-opinionated-tree-design.md`.

**Testing convention (repo-specific):** This DS has **no unit tests**. Validation is:
1. TypeScript compile (`pnpm tsc --noEmit`).
2. Token validator (`node scripts/validate-tokens.mjs sidebar`).
3. Manual playground route (`pnpm dev` → `http://localhost:5173/sidebar`).
4. `documentalist` agent regenerates `docs/components/_index_sidebar.md`.

There is no TDD cycle here — the "write failing test / make it pass" pattern does not apply. Tasks instead pair each change with a compile + validator check and a playground verification step at the end.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `src/components/sidebar/menu.ts` | **Create** | Typed `SIDEBAR_MENU` const, `SidebarTopItem` + `SidebarChildItem` types, lucide icon components per row |
| `src/components/sidebar/SideBar.tsx` | **Modify** | Drop `menuItems`/`SideBarMenuItem`, add `activeKey`/`activeChildKey`/`onNavigate`, render tree internally |
| `src/components/sidebar/index.ts` | **Modify** | Remove `SideBarMenuItem` export, add `SIDEBAR_MENU`, `SidebarTopItem`, `SidebarChildItem` exports |
| `src/components/sidebar/SideBar.example.tsx` | **Modify** | Showcase `activeKey` + `activeChildKey`, no `menuItems` |
| `playground/routes/sidebar.tsx` | **Modify** | 4-variant matrix: default / active leaf / active child / phone |

---

## Task 1: Create `menu.ts` with typed tree

**Files:**
- Create: `src/components/sidebar/menu.ts`

- [ ] **Step 1: Write `menu.ts`**

```ts
import {
  ShieldAlert,
  CalendarDays,
  Store,
  FolderOpen,
  ChartLine,
  ContactRound,
  DoorOpen,
  Settings,
  Handshake,
  Sparkles,
  FileQuestionMark,
  type LucideIcon,
} from 'lucide-react'

export interface SidebarChildItem {
  key: string
  label: string
}

export interface SidebarTopItem {
  key: string
  label: string
  icon: LucideIcon
  children?: readonly SidebarChildItem[]
}

export const SIDEBAR_MENU: readonly SidebarTopItem[] = [
  {
    key: 'admin',
    label: 'Admin',
    icon: ShieldAlert,
    children: [
      { key: 'tools', label: 'Tools' },
      { key: 'feature-configuration', label: 'Feature configuration' },
      { key: 'application-configuration', label: 'Application configuration' },
      { key: 'mall-store-configuration', label: 'Mall & store configuration' },
      { key: 'accounts-management', label: 'Accounts management' },
    ],
  },
  {
    key: 'annual-turnover-declaration',
    label: 'Annual Turnover declaration',
    icon: CalendarDays,
  },
  {
    key: 'my-shopping-center',
    label: 'My Shopping center',
    icon: Store,
    children: [
      { key: 'newsfeed', label: 'Newsfeed' },
      { key: 'deal', label: 'Deal' },
      { key: 'events', label: 'Events' },
    ],
  },
  {
    key: 'my-documents',
    label: 'My documents',
    icon: FolderOpen,
  },
  {
    key: 'turnover-declaration',
    label: 'Turnover declaration',
    icon: ChartLine,
  },
  {
    key: 'my-contacts',
    label: 'My contacts',
    icon: ContactRound,
  },
  {
    key: 'access-request',
    label: 'Access request',
    icon: DoorOpen,
  },
  {
    key: 'gestion-des-applications',
    label: 'Gestion des applications',
    icon: Settings,
    children: [
      { key: 'user-management', label: 'User management' },
      { key: 'shopping-center-management', label: 'Shopping center management' },
    ],
  },
  {
    key: 'tenant-coordination',
    label: 'Tenant coordination',
    icon: Handshake,
    children: [
      { key: 'handover', label: 'Handover' },
      { key: 'opening', label: 'Opening' },
      { key: 'hand-back', label: 'Hand back' },
    ],
  },
  {
    key: 'customer-excellence',
    label: 'Customer excellence',
    icon: Sparkles,
    children: [
      { key: 'daily-customer-tour', label: 'Daily customer tour' },
      { key: 'customer-visit', label: 'Customer visit' },
      { key: 'ace', label: 'ACE' },
      { key: 'opening-track', label: 'Opening track' },
    ],
  },
  {
    key: 'ressources',
    label: 'Ressources',
    icon: FileQuestionMark,
  },
] as const
```

- [ ] **Step 2: Type-check**

Run: `pnpm tsc --noEmit`
Expected: PASS (file is not referenced yet; purely checks lucide icon names resolve — `FileQuestionMark` etc. must exist in the installed lucide-react version).

If `FileQuestionMark` or `ChartLine` is missing, the compile fails with a named-import error. Fallbacks: `HelpCircle` for `FileQuestionMark`, `LineChart` for `ChartLine`. Pick the fallback, update the import + the `icon:` field, re-run.

- [ ] **Step 3: Commit**

```bash
git add src/components/sidebar/menu.ts
git commit -m "feat(sidebar): add opinionated menu tree"
```

---

## Task 2: Rewrite `SideBar.tsx` to consume the tree

**Files:**
- Modify: `src/components/sidebar/SideBar.tsx` (full body of the component + types section)

- [ ] **Step 1: Replace the `Public types` + `Component` sections**

Open `src/components/sidebar/SideBar.tsx`. Replace lines 171–344 (everything from `// Public types` through the `SideBar.displayName = 'SideBar'` line inclusive) with the block below. The `cva` variant definitions above line 171 and the `export { rootVariants, ... }` block after `displayName` stay untouched.

Also update the imports at the top of the file: remove `FolderOpen` from the `lucide-react` import (no longer needed — icons come from `menu.ts`). Remove the `ItemSideBar` import from `@/components/item-side-bar` and instead import `ItemSideBar, ActionSheetItem` from `@/components/item-side-bar`. Add `import { SIDEBAR_MENU } from './menu'`.

Final top-of-file imports:

```ts
import * as React from 'react'
import { cva } from 'class-variance-authority'
import { Bell, X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'
import { ItemSideBar, ActionSheetItem } from '@/components/item-side-bar'
import { SIDEBAR_MENU } from './menu'
```

Replacement for the Public types + Component sections:

```tsx
// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------
export type SideBarDevice = 'desktop' | 'phone'

export interface SideBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Desktop or phone layout
   * @propClass optional
   */
  device?: SideBarDevice
  /** Logo node rendered in the header
   * @propClass optional
   */
  logo?: React.ReactNode
  /** Context/location label text
   * @propClass optional
   */
  contextLabel?: string
  /** Called when notification/close button is clicked
   * @propClass optional
   */
  onNotificationClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Called when context-switcher is clicked
   * @propClass optional
   */
  onContextSwitcherClick?: React.MouseEventHandler<HTMLDivElement>
  /** Key of the currently active top-level menu entry. Drives row highlight
   * and auto-expansion of the matching collapsible panel.
   * @propClass persistent
   */
  activeKey?: string
  /** Key of the currently active sub-item. Only honored when its parent
   * matches `activeKey`.
   * @propClass persistent
   */
  activeChildKey?: string
  /** Called when a leaf row is clicked. `parentKey` is set for sub-rows.
   * Parents with children do not fire this — they toggle their panel.
   * @propClass optional
   */
  onNavigate?: (key: string, parentKey?: string) => void
  /** Avatar image node or src string
   * @propClass optional
   */
  avatar?: React.ReactNode
  /** User display name
   * @propClass optional
   */
  userName?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const SideBar = React.forwardRef<HTMLElement, SideBarProps>(
  (
    {
      className,
      device = 'desktop',
      logo,
      contextLabel = 'Shopping Center',
      onNotificationClick,
      onContextSwitcherClick,
      activeKey,
      activeChildKey,
      onNavigate,
      avatar,
      userName = 'User Name',
      ...props
    },
    ref
  ) => {
    const isPhone = device === 'phone'

    return (
      <nav
        ref={ref}
        aria-label="Site navigation"
        className={cn(rootVariants({ device }), className)}
        {...props}
      >
        {/* content */}
        <div className={contentVariants()}>
          {/* header */}
          <div className={headerVariants()}>
            {/* logo-notif row */}
            <div className={logoNotifVariants()}>
              <div className={logoVariants()}>
                {logo ?? (
                  <span className="font-klp-label font-klp-label-bold text-klp-fg-default text-[18px]">
                    KLUB
                  </span>
                )}
              </div>

              {/* notification-button — composed via Button DS component */}
              <div className="relative">
                <Button
                  variant="tertiary"
                  size="icon"
                  aria-label={isPhone ? 'Close navigation' : 'Notifications'}
                  onClick={onNotificationClick}
                >
                  {isPhone ? (
                    <X aria-hidden="true" strokeWidth={1.5} />
                  ) : (
                    <Bell aria-hidden="true" strokeWidth={1.5} />
                  )}
                </Button>
                {/* notification-dot — overlaid on the button; hidden on phone */}
                <span
                  aria-hidden="true"
                  className={notificationDotVariants({ device })}
                />
              </div>
            </div>

            {/* context-switcher row */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Switch context"
              className={contextSwitcherVariants()}
              onClick={onContextSwitcherClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onContextSwitcherClick?.(
                    e as unknown as React.MouseEvent<HTMLDivElement>
                  )
                }
              }}
            >
              <span className={contextLabelVariants()}>{contextLabel}</span>
              <span className={contextChevronVariants()}>
                <ChevronRight aria-hidden="true" strokeWidth={1.5} />
              </span>
            </div>
          </div>

          {/* menu */}
          <div className={menuVariants()}>
            {SIDEBAR_MENU.map((item) => {
              const Icon = item.icon
              const isActive = activeKey === item.key
              const hasChildren = !!item.children?.length

              if (!hasChildren) {
                return (
                  <div key={item.key} className={menuItemVariants()}>
                    <ItemSideBar
                      feature="static"
                      state={isActive ? 'active' : 'rest'}
                      icon={<Icon aria-hidden="true" strokeWidth={1.5} />}
                      label={item.label}
                      onClick={() => onNavigate?.(item.key)}
                    />
                  </div>
                )
              }

              return (
                <div key={item.key} className={menuItemVariants()}>
                  <ItemSideBar
                    feature="collapsible"
                    state={isActive ? 'active' : 'rest'}
                    icon={<Icon aria-hidden="true" strokeWidth={1.5} />}
                    label={item.label}
                    defaultOpen={isActive}
                  >
                    {item.children!.map((child) => {
                      const childActive =
                        isActive && activeChildKey === child.key
                      return (
                        <ActionSheetItem
                          key={child.key}
                          state={childActive ? 'active' : 'default'}
                          onClick={() => onNavigate?.(child.key, item.key)}
                        >
                          {child.label}
                        </ActionSheetItem>
                      )
                    })}
                  </ItemSideBar>
                </div>
              )
            })}
          </div>
        </div>

        {/* profil footer */}
        <div className={profilVariants()}>
          <div className={avatarVariants()}>
            {typeof avatar === 'string' ? (
              <img
                src={avatar}
                alt={typeof userName === 'string' ? userName : 'avatar'}
                className="w-full h-full object-cover"
              />
            ) : (
              avatar
            )}
          </div>
          <span className={userNameVariants()}>{userName}</span>
        </div>
      </nav>
    )
  }
)
SideBar.displayName = 'SideBar'
```

- [ ] **Step 2: Verify `ActionSheetItem` accepts `onClick`**

Run: `pnpm tsc --noEmit`
Expected: PASS.

If `ActionSheetItem` does not expose `onClick` in its Props, open `src/components/action-sheet-item/ActionSheetItem.tsx`, confirm the prop name (it may be `onSelect` or the component may spread `...rest` onto the root button). If the root element spreads props, `onClick` will work. If not, wrap the child in a clickable `<div role="button" tabIndex={0}>` instead, keyboard-handler included. Do not add a new prop to `ActionSheetItem` here — that's a scope leak.

- [ ] **Step 3: Commit**

```bash
git add src/components/sidebar/SideBar.tsx
git commit -m "feat(sidebar): bake navigation tree, add activeKey/activeChildKey/onNavigate"
```

---

## Task 3: Update `index.ts` barrel

**Files:**
- Modify: `src/components/sidebar/index.ts`

- [ ] **Step 1: Replace file contents**

```ts
export {
  SideBar,
  rootVariants,
  contentVariants,
  headerVariants,
  logoNotifVariants,
  logoVariants,
  notificationDotVariants,
  contextSwitcherVariants,
  contextLabelVariants,
  contextChevronVariants,
  menuVariants,
  menuItemVariants,
  profilVariants,
  avatarVariants,
  userNameVariants,
} from './SideBar'
export type { SideBarProps, SideBarDevice } from './SideBar'
export { SIDEBAR_MENU } from './menu'
export type { SidebarTopItem, SidebarChildItem } from './menu'
```

- [ ] **Step 2: Type-check**

Run: `pnpm tsc --noEmit`
Expected: PASS. If it fails with `"SideBarMenuItem" is not exported`, grep the repo and fix the consumer (should only be the old playground route, handled in Task 5).

Run: `rg "SideBarMenuItem" src playground` to confirm. Expected: no matches after Task 5.

- [ ] **Step 3: Commit**

```bash
git add src/components/sidebar/index.ts
git commit -m "feat(sidebar): export SIDEBAR_MENU and new tree types"
```

---

## Task 4: Rewrite `SideBar.example.tsx`

**Files:**
- Modify: `src/components/sidebar/SideBar.example.tsx`

- [ ] **Step 1: Replace file contents**

```tsx
import { SideBar } from '@/components/sidebar'

export function SideBarExample() {
  return (
    <div className="flex gap-8 items-start p-6">
      {/* Default — no active item */}
      <SideBar
        contextLabel="Centre Commercial"
        userName="Baptiste M."
        onNavigate={(key, parentKey) =>
          console.log('navigate', { key, parentKey })
        }
      />

      {/* Active leaf */}
      <SideBar
        contextLabel="Centre Commercial"
        userName="Baptiste M."
        activeKey="my-documents"
        onNavigate={(key, parentKey) =>
          console.log('navigate', { key, parentKey })
        }
      />

      {/* Active sub-item — parent auto-expands */}
      <SideBar
        contextLabel="Centre Commercial"
        userName="Baptiste M."
        activeKey="my-shopping-center"
        activeChildKey="newsfeed"
        onNavigate={(key, parentKey) =>
          console.log('navigate', { key, parentKey })
        }
      />

      {/* Phone */}
      <SideBar
        device="phone"
        contextLabel="Centre Commercial"
        userName="Baptiste M."
        activeKey="customer-excellence"
        activeChildKey="ace"
      />
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/sidebar/SideBar.example.tsx
git commit -m "docs(sidebar): example uses activeKey/activeChildKey"
```

---

## Task 5: Update playground route

**Files:**
- Modify: `playground/routes/sidebar.tsx`

- [ ] **Step 1: Replace file contents**

```tsx
import { useEffect } from 'react'
import { SideBar } from '@/components/sidebar'

const CAPTURE_BRAND = 'klub'

export function SideBarRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev
    }
  }, [])

  const handleNavigate = (key: string, parentKey?: string) => {
    console.log('[sidebar] navigate', { key, parentKey })
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-xl font-semibold">
        SideBar — captured in {CAPTURE_BRAND}
      </h1>

      <div className="flex flex-wrap gap-8 items-start">
        {/* default — no active */}
        <div data-variant-id="default" className="flex flex-col gap-2">
          <p className="text-sm text-klp-fg-muted font-klp-label">default</p>
          <SideBar
            contextLabel="Centre Commercial"
            userName="Baptiste M."
            onNavigate={handleNavigate}
          />
        </div>

        {/* active leaf */}
        <div data-variant-id="active-leaf" className="flex flex-col gap-2">
          <p className="text-sm text-klp-fg-muted font-klp-label">
            activeKey=my-documents
          </p>
          <SideBar
            contextLabel="Centre Commercial"
            userName="Baptiste M."
            activeKey="my-documents"
            onNavigate={handleNavigate}
          />
        </div>

        {/* active child */}
        <div data-variant-id="active-child" className="flex flex-col gap-2">
          <p className="text-sm text-klp-fg-muted font-klp-label">
            activeKey=my-shopping-center / activeChildKey=newsfeed
          </p>
          <SideBar
            contextLabel="Centre Commercial"
            userName="Baptiste M."
            activeKey="my-shopping-center"
            activeChildKey="newsfeed"
            onNavigate={handleNavigate}
          />
        </div>

        {/* phone */}
        <div data-variant-id="phone" className="flex flex-col gap-2">
          <p className="text-sm text-klp-fg-muted font-klp-label">
            device=phone, activeKey=customer-excellence / activeChildKey=ace
          </p>
          <SideBar
            device="phone"
            contextLabel="Centre Commercial"
            userName="Baptiste M."
            activeKey="customer-excellence"
            activeChildKey="ace"
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm tsc --noEmit`
Expected: PASS (old `MENU_ITEMS_DESKTOP` + `menuItems` prop now gone).

- [ ] **Step 3: Commit**

```bash
git add playground/routes/sidebar.tsx
git commit -m "feat(playground): sidebar route shows active + phone matrix"
```

---

## Task 6: Token validator

**Files:** none (validation only)

- [ ] **Step 1: Run the token validator**

Run: `node scripts/validate-tokens.mjs sidebar`
Expected: exit code 0. JSON output shows all layer bindings green.

If the validator flags a drift, it's unrelated to this plan (component anatomy was not altered) — stop and investigate before continuing. The expected outcome is a clean pass because no `cva` blocks, layer classes, or spec entries changed.

---

## Task 7: Playground smoke test

**Files:** none (manual verification)

- [ ] **Step 1: Launch the dev server**

Run: `pnpm dev`
Expected: Vite logs `http://localhost:5173/`.

- [ ] **Step 2: Open `http://localhost:5173/sidebar` and verify each variant**

For each `data-variant-id` block:

- `default` — all 11 top rows present, all parents collapsed, no row highlighted. Clicking a leaf (e.g. "My documents") logs `{ key: 'my-documents', parentKey: undefined }` in the browser console.
- `active-leaf` — "My documents" row has the `active` icon-box border; no panel expanded.
- `active-child` — "My Shopping center" is in `active` state AND expanded on mount; "Newsfeed" sub-row has the `active` `ActionSheetItem` style. Clicking "Deal" logs `{ key: 'deal', parentKey: 'my-shopping-center' }`.
- `phone` — sidebar is 320px wide, header uses the `X` icon (not `Bell`), notification dot is hidden; "Customer excellence" is expanded with "ACE" active.

Also verify:
- Clicking a collapsible parent that is NOT active (e.g. "Admin") toggles its panel, does NOT fire `onNavigate`, and does NOT close other open parents.
- Icon glyphs per row match the plan (Admin=ShieldAlert, Annual Turnover declaration=CalendarDays, My Shopping center=Store, My documents=FolderOpen, Turnover declaration=ChartLine, My contacts=ContactRound, Access request=DoorOpen, Gestion des applications=Settings, Tenant coordination=Handshake, Customer excellence=Sparkles, Ressources=FileQuestionMark — or the chosen fallback if lucide lacks one).

- [ ] **Step 3: Stop the dev server**

`Ctrl+C` in the terminal.

No commit for this task (manual verification only). If anything fails, roll back to the failing step's commit and fix before proceeding.

---

## Task 8: Regenerate docs via `documentalist`

**Files:**
- Modify: `docs/components/_index_sidebar.md` (via the agent)
- Modify: `klp-components.json` (via the agent)

- [ ] **Step 1: Dispatch the `documentalist` agent**

Dispatch the `documentalist` subagent with:

```
operation: DOCUMENT
component: sidebar
```

The agent reads `src/components/sidebar/SideBar.tsx` + `.klp/figma-refs/sidebar/spec.json` and rewrites the doc page. The new Props table should show `activeKey`, `activeChildKey`, `onNavigate` (all persistent / optional per their `@propClass` tags), and NOT show `menuItems`.

- [ ] **Step 2: Review the regenerated doc**

Run: `git diff docs/components/_index_sidebar.md klp-components.json`
Expected:
- Props table updated.
- `SideBarMenuItem` type row gone.
- `dependencies.components` unchanged (still includes `button`, `item-side-bar`, and transitively `action-sheet-item`).

If the diff looks wrong, re-dispatch with `operation: DOCUMENT` — the agent is idempotent.

- [ ] **Step 3: Commit**

```bash
git add docs/components/_index_sidebar.md klp-components.json
git commit -m "docs(sidebar): regenerate for opinionated tree API"
```

---

## Final verification

- [ ] **Step 1: Full type-check**

Run: `pnpm tsc --noEmit`
Expected: PASS.

- [ ] **Step 2: Token validator (re-run)**

Run: `node scripts/validate-tokens.mjs sidebar`
Expected: exit code 0.

- [ ] **Step 3: Inventory commits**

Run: `git log --oneline main..HEAD`
Expected 6 commits (Tasks 1–5 and 8 commit; Tasks 6 and 7 are verification-only):
1. `feat(sidebar): add opinionated menu tree`
2. `feat(sidebar): bake navigation tree, add activeKey/activeChildKey/onNavigate`
3. `feat(sidebar): export SIDEBAR_MENU and new tree types`
4. `docs(sidebar): example uses activeKey/activeChildKey`
5. `feat(playground): sidebar route shows active + phone matrix`
6. `docs(sidebar): regenerate for opinionated tree API`

(The spec commit `95634b0` predates this plan and is not included.)

Done.
