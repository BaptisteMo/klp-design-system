---
title: Brand system
type: brand-overview
updated: 2026-04-16
---

# Brand system

4 brands defined as `[data-brand]` selectors in `src/styles/tokens/aliases.css`. Switching is runtime, no rebuild needed.

| Brand | Page | Identity in one phrase |
|---|---|---|
| wireframe | [wireframe.md](./wireframe.md) | Grayscale placeholder — default fallback |
| klub | [klub.md](./klub.md) | Emerald primary, cyan secondary, classical type |
| atlas | [atlas.md](./atlas.md) | Night-blue primary, fuchsia secondary, dense type |
| showup | [showup.md](./showup.md) | Midnight + gold, refined neutral palette |

## How to switch

```html
<html data-brand="atlas">
```

Or programmatically:

```ts
document.documentElement.dataset.brand = 'atlas'
```

The default (`:root` selector in `aliases.css`) is **wireframe**.

## Capture brand vs runtime brand

Every component spec records its `captureBrand` — the brand active in Figma when the reference screenshots were captured. The playground route activates this brand on mount so the designer's visual review sees the same rendering the references were taken in. `captureBrand` is **informational only**; token validation is brand-independent (aliases resolve per-brand automatically).

The `playground/routes/<name>.tsx` for each component locks `[data-brand]` to its `captureBrand` on mount. To preview a component under a different brand, edit the playground route or use the runtime switch above.

## Adding a new brand

1. Add a new `[data-brand="<name>"]` block to `src/styles/tokens/aliases.css` with the full alias set (use one existing brand as a template).
2. Update `tokens.json` `brands: []` and `modeMap.<group>.<name>` to point at the Figma mode IDs.
3. Run `pnpm sync:tokens` to regenerate the CSS layers from the source.
4. Create `docs/brands/<name>.md` (the documentalist will do this on its next dispatch via the bootstrap step).
5. Update `aliases.css` font stack if the brand introduces a new font.

<!-- KLP:NOTES:BEGIN -->
## Notes
<!-- KLP:NOTES:END -->
