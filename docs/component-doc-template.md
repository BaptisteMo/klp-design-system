# klp component doc — master-class template

Canonical structure, section order, and writing tone for `docs/components/_index_<name>.md`.
Reference-grade targets: **Shopify Polaris** (dev-dense, per-prop rigor) and **GitHub Primer** (usage/design, do-don't pairs).

This is an **authoring guide**, not a component doc. It is never rendered in the playground and never touched by the documentalist.

---

## 1. Two authorship zones

Every component doc is written by two hands. Know which owns each section:

- **AUTO** — generated mechanically by the `documentalist` agent from `spec.json` + source. Never hand-edit (overwritten on regeneration). Frontmatter, matrices, tables, dependency graph, gaps.
- **HUMAN** — editorial judgment. Lives **only** inside `<!-- KLP:NOTES:BEGIN --> … <!-- KLP:NOTES:END -->`. This is the block that separates a generated stub from a master-class doc. Everything outside the markers is disposable; everything inside survives.

> The master-class value is almost entirely HUMAN. The AUTO sections describe *what the component is*; the HUMAN sections explain *when, why, and how to use it well* — the part Polaris and Primer invest in.

---

## 2. Canonical section order

Read top-to-bottom, a good doc answers: *what is it → when do I reach for it → what are its parts → how do I wire it → how do I use it well → what will bite me → is it accessible → what does it depend on.*

| # | Section | Zone | Purpose |
|---|---------|------|---------|
| 1 | **Title + one-line description** | AUTO | Component name + a single sentence of what it does. |
| 2 | **When to use / Use cases** | HUMAN | 3–5 concrete scenarios. Orients the *choice*, not the API. Link to sibling components for the cases this one is *wrong* for. |
| 3 | **Anatomy** | AUTO | Labeled part tree (root, slots, icons). |
| 4 | **Variants** | AUTO | The variant × size matrix. |
| 5 | **States** | HUMAN | Behavior, not appearance. Distinguish look-alikes (e.g. *disabled* vs *inactive* vs *loading*) and say how each should respond to input. |
| 6 | **Props** | AUTO | Per-prop: name, class, type, default, required, description. |
| 7 | **Examples** | AUTO code + HUMAN intent | Each example = **intent title + one sentence of context + code**. Never a bare snippet. |
| 8 | **Best practices** | HUMAN | Do/don't pairs. The editorial core. Imperative voice. |
| 9 | **Content guidelines** | HUMAN | How to write labels/copy inside it (casing, verbs, length, punctuation). |
| 10 | **Limitations** | HUMAN | Known traps, edge cases, honest caveats. Builds trust. |
| 11 | **Accessibility** | AUTO base + HUMAN nuance | Role, keyboard, ARIA. AUTO lists the facts; HUMAN adds the "when asChild renders an `<a>`…" judgment. |
| 12 | **Dependencies / Used by / Files** | AUTO | Graph edges + source paths. |
| 13 | **DS gaps** | AUTO | Pipeline-detected gaps. |

**Reality today:** sections 2, 5, 8, 9, 10 (pure HUMAN) live *inside* the single `KLP:NOTES` block at the bottom of the file — the only region preserved across regeneration. Structure them there with `##`/`###` sub-headings in the order above. (Target upgrade: teach the documentalist to scaffold these sections higher up with their own preserve-markers — tracked separately; the template's job is to fix the *content standard* first.)

---

## 3. Writing tone

Borrowed from Primer + Polaris. Non-negotiable:

- **Imperative and direct.** "Keep labels succinct." Not "Labels should generally be kept fairly short."
- **Sentence case** in labels and headings.
- **Concrete over abstract.** "Use for *Save changes*, *Create product*" beats "use for primary actions."
- **Honest.** A `## Limitations` section that admits real traps reads as more authoritative, not less.
- **No filler.** Cut "simply", "just", "in order to", articles where they add nothing.
- **Every guideline is actionable.** If a reader can't *do* something differently after reading a line, cut it.

Do/don't format (Primer): pair them, lead with the do.

```
- ✅ **Do** use a single primary button per view — it signals the main action.
- ❌ **Don't** stack three primary buttons — hierarchy collapses and nothing stands out.
```

---

## 4. HUMAN block skeleton

Paste inside the `KLP:NOTES` markers of any component and fill. Delete sections that genuinely don't apply (note why).

```markdown
<!-- KLP:NOTES:BEGIN -->

## When to use

- **<scenario>:** <one concrete sentence>.
- **<scenario>:** <one concrete sentence>.

Reach for [<sibling>](./_index_<sibling>.md) instead when <the case this component is wrong for>.

## States

- **<state>:** <what it means + how it responds to input>.
- **disabled vs <look-alike>:** <the distinction and when to pick each>.

## Best practices

- ✅ **Do** <action> — <why it works>.
- ❌ **Don't** <anti-pattern> — <what breaks>.

## Content guidelines

- <label casing / verb / length / punctuation rule>.

## Limitations

- <known trap, edge case, or honest caveat>.

<!-- KLP:NOTES:END -->
```

---

## 5. Reference material

- Polaris button (dev-dense per-prop + intent-led examples): `docs/exemples/btn-example.md`
- Polaris select / checkbox: `docs/exemples/{select,checkbox}-example.md`
- Primer button guidelines (design/usage, do-don't pairs): https://primer.style/product/components/button/guidelines/
