# Guide d'architecture — comment un composant klp est construit

Guide de référence pour comprendre **et expliquer** les choix d'architecture du design system.
Chaque section répond à *quoi* + *pourquoi ce choix* (la partie que tu dois pouvoir défendre).

Tous les extraits sont tirés du code réel (`Button`, `Collapsible`, `cn`, les couches de tokens).

---

## 0. Les 5 piliers (la vue d'ensemble)

Un composant klp est l'assemblage de 5 décisions indépendantes :

| Pilier | Outil | Rôle | Pourquoi ce choix |
|--------|-------|------|-------------------|
| **Comportement + a11y** | Radix Primitives | focus, clavier, ARIA, portails | ne jamais réécrire l'accessibilité à la main — c'est le piège n°1 des DS maison |
| **Style** | Tailwind v4 (utilities) | classes visuelles | co-localisé avec le markup, pas de CSS orphelin à maintenir |
| **Valeurs de style** | Tokens CSS `--klp-*` (3 couches) | couleurs, espacements, rayons | changer de marque = changer une couche, zéro recompilation |
| **Variantes** | `cva` (class-variance-authority) | mapper `props → classes` | une seule source de vérité typée pour toutes les combinaisons variant × size × state |
| **Distribution** | CLI copie-colle (façon shadcn) | livrer le source au projet consommateur | le consommateur **possède** le code, pas une dépendance versionnée opaque |

> Phrase à retenir : **Radix pense, Tailwind habille, les tokens décident de la marque, cva orchestre, le CLI distribue.**

---

## 1. Anatomie d'un dossier composant

Un dossier par composant, sous `src/components/<name>/`. Chaque composant livre :

```
src/components/button/
├── Button.tsx            # la logique + les cva + le forwardRef
├── index.ts              # barrel — le point d'entrée public du dossier
├── Button.example.tsx    # un usage de démo minimal
└── (playground/routes/button.tsx)   # la matrice variant × size × state
```

- **`Button.tsx`** = l'atelier. Tout est défini ici.
- **`index.ts`** = le comptoir. Ne fabrique rien, ré-exporte juste. Permet `import { Button } from '@/components/button'` au lieu du chemin complet, et sert d'ancre stable pour la réécriture d'imports du CLI.
- **`.example.tsx`** = démo canonique, réutilisée par la doc.
- **route playground** = toutes les combinaisons rendues côte à côte pour la revue visuelle humaine.

**Pourquoi un dossier par composant et pas un gros fichier ?** Parce que la distribution est copie-colle : chaque composant doit être **détachable**. Le projet consommateur prend la brique Button (dossier + son `index.ts`) et elle marche seule.

---

## 2. Le système de style — 3 couches de tokens

C'est le cœur de l'architecture. Les valeurs visuelles vivent dans `src/styles/tokens/`, en **3 couches empilées** :

```
primitives.css  →  aliases.css  →  theme.css
(valeurs brutes)   (sémantique)     (utilities Tailwind)
```

### Couche 1 — `primitives.css` : les valeurs brutes

Les palettes et échelles crues. Interne. Jamais référencé par un composant.

```css
--klp-color-gray-500: #6b7280;
--klp-spacing-m: 12px;
--klp-radius-l: 8px;
```

### Couche 2 — `aliases.css` : la sémantique, commutée par marque

Chaque token *sémantique* pointe vers un primitif — et **c'est cette couche qui change selon `[data-brand]`**.

```css
:root, [data-brand="wireframe"] {
  --klp-bg-brand: var(--klp-color-gray-500);   /* wireframe → gris */
}
[data-brand="atlas"] {
  --klp-bg-brand: var(--klp-color-night-blue-700);   /* atlas → bleu nuit */
}
```

Même token `--klp-bg-brand`, valeur différente selon la marque active sur la racine.

### Couche 3 — `theme.css` : exposer aux utilities Tailwind

Le bloc `@theme inline` de Tailwind v4 transforme chaque alias en utility `klp-*` :

```css
@theme inline {
  --color-klp-bg-brand: var(--klp-bg-brand);
}
```

→ génère les utilities `bg-klp-bg-brand`, `text-klp-bg-brand`, `border-klp-bg-brand`.
`inline` est **obligatoire** : sans lui, Tailwind fige la valeur à la compilation et le changement de marque au runtime ne marcherait pas.

### La règle d'or

Un composant écrit **toujours** `bg-klp-bg-brand`, **jamais** `--klp-color-gray-500` ni un hex.

**Pourquoi cette indirection à 3 étages ?** Pour découpler trois préoccupations qui changent à des rythmes différents :
- un designer ajoute une couleur brute → couche 1 seulement ;
- une marque redéfinit son bleu → couche 2 seulement ;
- le composant, lui, ne bouge jamais — il parle en intentions (`bg-brand`, `fg-danger`), pas en couleurs.

C'est ce qui rend le **multi-marque au runtime** possible : `document.documentElement.dataset.brand = 'atlas'` et toute l'UI bascule, sans rebuild.

> Les 3 fichiers sont **générés** par `pnpm sync:tokens` depuis `.klp/tokens.json` (capturé de Figma). On ne les édite pas à la main.

---

## 3. `cva` — le moteur de variantes

`class-variance-authority` mappe des **props** vers des **classes Tailwind**, de façon typée. C'est la réponse à : « comment gérer proprement 5 variants × 4 sizes × 4 states sans une soupe de ternaires ? »

### Le problème sans cva

```tsx
// ❌ ingérable dès 2 axes
className={`btn ${variant === 'primary' ? 'bg-brand' : ''} ${size === 'lg' ? 'h-13' : ''} ...`}
```

### La solution cva (extrait réel de `Button.tsx`)

```ts
const rootVariants = cva(
  // 1. base — classes communes à TOUTES les variantes
  'inline-flex items-center justify-center border rounded-klp-l transition-colors ...',
  {
    // 2. variants — les axes et leurs classes
    variants: {
      variant: {
        primary:   'bg-klp-bg-brand border-klp-border-brand hover:bg-klp-bg-brand-contrasted ...',
        secondary: 'bg-klp-bg-default border-klp-border-brand ...',
        // tertiary, destructive, validation ...
      },
      size: {
        sm:   'h-[36px] px-klp-size-s gap-klp-size-2xs',
        md:   'h-[40px] px-klp-size-m ...',
        lg:   'h-[52px] px-klp-size-l ...',
        icon: 'h-[36px] w-[36px] p-klp-size-xs',
      },
    },
    // 3. compoundVariants — cas croisés (une combinaison précise)
    compoundVariants: [
      { variant: 'tertiary', size: 'icon', className: 'bg-klp-bg-invisible' },
    ],
    // 4. defaultVariants — valeurs par défaut
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)
```

Appel : `rootVariants({ variant: 'secondary', size: 'lg' })` → la string de classes correspondante.

Les 4 briques :
- **base** : ce qui est vrai partout.
- **variants** : chaque axe indépendant.
- **compoundVariants** : l'exception quand deux axes se croisent (ici *tertiary + icon* a un fond différent).
- **defaultVariants** : ce qui s'applique si la prop est absente.

### Mécaniquement — ce que `cva` est vraiment

`cva` est une **factory de fonctions**. `cva(base, config)` ne calcule rien tout de suite : il **retourne une fonction** `(props) => string`.

Ce que cette fonction fait à l'appel :
1. part de la string `base` ;
2. pour chaque axe (`variant`, `size`), lit la valeur passée (ou `defaultVariants` si absente) et récupère la string correspondante dans la table `variants` ;
3. parcourt `compoundVariants` et ajoute les classes dont **toutes** les conditions matchent ;
4. concatène le tout en une seule string séparée par des espaces.

Point clé : **`cva` ne connaît ni Tailwind ni le CSS**. Il ne génère aucun style. C'est une pure **table de correspondance `valeur de prop → string`**. Les strings *se trouvent* être des classes Tailwind, mais `cva` s'en fiche — il colle des mots.

### Le pattern multi-couches (la subtilité klp)

Button ne définit pas *un* cva mais **trois** — un par « couche visuelle » de l'anatomie :

```ts
const rootVariants  = cva(...)  // le <button> : fond, bordure, taille, padding
const labelVariants = cva(...)  // le <span> du texte : couleur, police, poids
const iconVariants  = cva(...)  // les <span> d'icônes : couleur, taille du svg
```

**Pourquoi séparer ?** Parce que sur une même variante, le fond, le texte et l'icône suivent des règles de token différentes (ex. `primary` : fond `bg-brand`, texte `fg-on-emphasis`). Un seul cva mélangerait tout. Trois cva = trois responsabilités nettes, chacune appliquée à son sous-élément.

### Le typage gratuit

```ts
type P = VariantProps<typeof rootVariants>
// TS lit la config du cva → { variant?: 'primary'|'secondary'|..., size?: 'sm'|'md'|'lg'|'icon' }
size?: VariantProps<typeof rootVariants>['size']   // ['size'] indexe le type → 'sm'|'md'|'lg'|'icon'
```

Décomposé :
- `typeof rootVariants` = le **type** de la fonction retournée par `cva`.
- `VariantProps<...>` = un utilitaire TS fourni par la lib qui **lit les clés de `variants`** dans ce type et fabrique l'objet de props correspondant.
- `['size']` = on **indexe** ce type par la clé `size` pour extraire juste l'union des sizes.

C'est **purement niveau-type, zéro runtime** : rien de ce code n'existe dans le JS compilé. Conséquence : tu ajoutes une size dans le cva → le type de la prop se met à jour seul. Une seule source de vérité : impossible que le type et les classes divergent.

---

## 4. `cn()` — composer les classes sans conflit

Toute composition de classes passe par `cn()` (jamais de concaténation à la main). Défini dans `src/lib/cn.ts` :

```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Deux étages, deux jobs distincts.

**`clsx`** — résout la **composition conditionnelle** en une string. Accepte strings, objets, tableaux, valeurs falsy :

```ts
clsx('a', { 'b': true, 'c': false }, undefined, ['d'])   // → "a b d"
```

Il jette le falsy, garde l'ordre, joint par des espaces. **Il ne déduplique rien** : `clsx('px-2', 'px-4')` → `"px-2 px-4"` (les deux restent).

**`tailwind-merge`** — résout les **conflits Tailwind**. Il parse la string, sait que `px-2` et `px-4` sont dans le même « groupe de conflit » (padding horizontal), et **garde le dernier** :

```ts
twMerge('px-2 px-4')   // → "px-4"
twMerge('p-4 px-2')    // → "p-4 px-2"  (padding global vs horizontal : gère le chevauchement)
```

Mécaniquement : il lit de gauche à droite, range chaque classe dans un groupe via une table interne `classe → groupe`, et ne garde que la **dernière occurrence** par groupe.

**Pourquoi les deux, dans cet ordre ?** `clsx` d'abord (construire la string depuis le conditionnel), `twMerge` ensuite (nettoyer les conflits). C'est ce qui rend l'override par prop fiable :

```tsx
cn(rootVariants({ variant, size }), className)
// si className="bg-klp-bg-danger", elle écrase proprement le bg-klp-bg-brand du cva
```

Sans `twMerge`, `bg-klp-bg-brand` **et** `bg-klp-bg-danger` resteraient tous les deux dans le DOM → c'est l'ordre de déclaration CSS qui trancherait, imprévisible. Avec, le dernier (la `className` de l'appelant) gagne.

### Pourquoi la config custom dans `cn.ts` ?

tailwind-merge ne connaît que les utilities Tailwind standard. Nos tokens (`text-klp-text-large`, `text-klp-fg-danger`) sont custom : il ne sait pas que `text-klp-text-large` et `text-klp-text-medium` sont **le même axe** (taille de police) et devraient s'écraser. On le lui apprend via `extendTailwindMerge` :

```ts
extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['klp-text-large', 'klp-text-medium', ...] }],
      'text-color': [{ text: ['klp-fg-default', 'klp-fg-danger', ...] }],
    },
  },
})
```

Sans ça, `cn('text-klp-text-large', 'text-klp-text-small')` garderait les deux → bug de taille. **Choix à expliquer** : nos tokens de couleur ET de taille utilisent tous le préfixe `text-`, donc il faut désambiguïser les deux groupes manuellement.

---

## 5. Radix Primitives — le comportement et l'accessibilité

Les composants interactifs se composent **sur** des primitives Radix, qui apportent le comportement testé et l'a11y. On n'écrit que le style par-dessus.

### `forwardRef` — toujours

```tsx
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <button ref={ref} ... />   // la ref du parent pointe sur le <button> réel
))
```

Techniquement : React **intercepte** la prop `ref`, elle n'arrive **pas** dans le `props` d'un composant fonction normal. `forwardRef((props, ref) => ...)` crée un composant qui reçoit la ref du parent en **2ᵉ argument**, que tu attaches ensuite au vrai nœud DOM.

Sans ça, `<Button ref={r} />` → `r.current` reste `null` + warning React. Nécessaire pour : `.focus()` programmatique, mesure du DOM, les libs de formulaire, et Radix qui passe des refs à ses `Trigger`. Un composant DS sans `ref` casse la composition.

### `asChild` + `Slot` — le polymorphisme

```tsx
const Comp = asChild ? Slot : 'button'
return <Comp ...>{children}</Comp>
```

`Slot` (de Radix) est un composant qui **ne rend aucun élément DOM à lui**. Au lieu de créer un wrapper, il prend son **unique enfant** et lui **fusionne** les props/`className`/`ref`/handlers reçus :

```tsx
<Slot className="btn-classes" onClick={fn}>
  <a href="/x">Go</a>
</Slot>
// rend : <a href="/x" class="btn-classes" onClick={fusionné}>Go</a>
```

Sémantique de fusion : les `className` sont **concaténées**, les handlers d'événements sont **composés** (les deux s'exécutent), le reste des props de l'enfant l'emporte.

`asChild` est le booléen qui bascule quel composant on rend :
- `asChild={false}` → un vrai `<button>` ;
- `asChild={true}` → `Slot`, qui reporte le style du bouton sur l'enfant fourni (`<a>`, `<Link>`…).

**Pourquoi ce mécanisme ?** Polymorphisme **sans wrapper ni duplication**. L'alternative — une prop `as` avec rendu conditionnel, ou emboîter `<button><a/></button>` — casse la sémantique HTML ou duplique le style. `Slot` donne « un composant, plusieurs éléments possibles » proprement. C'est aussi pour ça qu'on neutralise `type` quand `asChild` rend un `<a>` : `type={asChild ? undefined : htmlType}`.

### Le pattern compound — ré-exporter les parties Radix

Extrait de `Collapsible.tsx` :

```ts
export const Collapsible = React.forwardRef(...)          // le wrapper stylé
// Re-export Radix parts for compound usage
export const CollapsibleRoot    = CollapsiblePrimitive.Root
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger
export const CollapsibleContent = CollapsiblePrimitive.Content
```

**Pourquoi ré-exporter Radix tel quel ?** Pour donner à l'appelant les pièces de composition (`Root`/`Trigger`/`Content`) sans qu'il ait à installer/importer Radix lui-même. Le DS reste le seul point d'entrée.

---

## 6. Le contrat de props — `@propClass`

Chaque prop de l'interface exportée porte un tag JSDoc :

```ts
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Button label or content.
   * @propClass required */
  children?: React.ReactNode
  /** @propClass optional */
  variant?: VariantProps<typeof rootVariants>['variant']
}
```

Décortiquons chaque morceau de la signature.

**`extends React.ButtonHTMLAttributes<HTMLButtonElement>`** — l'interface **hérite de tous les attributs HTML natifs d'un bouton** : `onClick`, `disabled`, `aria-*`, `data-*`, `name`, `form`… Concrètement ça autorise le spread `{...props}` dans le composant : l'appelant passe n'importe quel attribut standard, il atterrit sur le `<button>` sans qu'on le déclare un par un.

**`Omit<…, 'type'>`** — un utilitaire TS qui **retire une clé** d'un type. Ici on enlève le `type` HTML natif (`"button"|"submit"|"reset"`) parce que dans le vocabulaire DS « type » veut dire *variant*. On le remplace par une prop dédiée `htmlType` → évite la collision de sens.

**`@propClass`** — c'est du **JSDoc** : un commentaire `/** */` au-dessus de la déclaration. Ce n'est **ni du TypeScript, ni du runtime** — TS ignore les tags inconnus, le JS compilé ne le contient pas. C'est une **métadonnée lue par le documentalist**, qui parse le source pour classer chaque prop dans la doc générée. Valeurs :
- **`required` / `optional`** — obligatoire ou non ;
- **`computed`** — valeur **dérivée**, jamais passée à la main (ex. le `state` d'un Input déduit de `:invalid`/`:disabled`) ;
- **`persistent`** — persiste entre rendus.

L'omission → défaut `optional` + un warning du documentalist.

**Pourquoi ?** Pour que la doc générée décrive fidèlement le contrat sans qu'on le ressaisisse. Le tag est la source unique ; la table de props est *dérivée* → elle ne peut pas diverger du code.

---

## 7. Discipline de composition — réutiliser les primitives DS

Un nouveau composant qui a besoin d'un bouton **importe Button**, il ne recrée pas un cva de bouton :

```ts
// dans Collapsible.tsx
import { Button } from '@/components/button'
```

C'est **imposé par le pipeline** : le validateur (`validate-tokens.mjs`) vérifie que le source importe et utilise chaque composant signalé comme réutilisé dans le spec Figma, et qu'aucun `<svg>` inline n'est introduit (les icônes viennent de `lucide-react`).

**Pourquoi ?** Un DS où chaque composant redéfinit ses primitives dérive en incohérence. La réutilisation forcée garde une seule définition de « bouton » dans tout le système.

---

## 8. Distribution — le modèle copie-colle

Le DS n'est pas publié comme lib npm classique où tu `import` un binaire. Il **copie le source** dans le projet consommateur (modèle shadcn).

- Source de vérité : `registry/manifest.json` (généré par `pnpm build:manifest`, jamais édité à la main).
- Le CLI copie les fichiers et **réécrit les imports** (`cli/rewrite.mjs`) : `@/components/<n>` → chemin local du consommateur.
- Un `klp.lock.json` chez le consommateur enregistre le hash de chaque fichier → permet de catégoriser un futur diff (NEW, CHANGED-UPSTREAM, LOCAL-ONLY, CONFLICT…).

**Pourquoi copie-colle et pas `npm install @klp/ui` ?**
- Le consommateur **possède** et peut modifier chaque composant (pas de boîte noire versionnée).
- Pas de dépendance runtime au DS ni de breaking-change subi à une montée de version.
- Le tree-shaking est trivial : tu ne copies que ce que tu utilises.

C'est le même choix qui explique le **dossier par composant** (§1) et le **`index.ts` par dossier** (détachabilité).

---

## 9. Le pipeline qui produit tout ça

Un composant n'est pas écrit à la main de zéro. `/klp-build-component <node Figma>` orchestre 4 étapes :

1. **figma-extractor** — capture le spec Figma (variants, sizes, states, tokens, mesures) → `.klp/figma-refs/<name>/spec.json` + PNG de référence.
2. **component-adapter** — écrit `Button.tsx` + route playground + stub registry depuis le spec.
3. **klp-token-validator** — vérifie que chaque couche × state × propriété utilise le bon utility `klp-*` (pas de hex, pas de primitif, pas de `<svg>` inline).
4. **documentalist** — génère `docs/components/_index_<name>.md`, met à jour `klp-components.json` et le graphe de dépendances.

**Pourquoi un pipeline ?** Pour que la fidélité Figma → code et la conformité tokens soient **vérifiées mécaniquement**, pas laissées à la vigilance. Le seul jugement humain restant : la revue visuelle (playground vs Figma) et la prose éditoriale des docs (voir `docs/component-doc-template.md`).

---

## 10. Cheat-sheet — « pourquoi ce choix ? » en une ligne

| Question qu'on te pose | Réponse courte |
|------------------------|----------------|
| Pourquoi Radix ? | Ne jamais réécrire l'accessibilité et le comportement clavier à la main. |
| Pourquoi Tailwind et pas du CSS ? | Style co-localisé avec le markup, rien à maintenir à distance. |
| Pourquoi 3 couches de tokens ? | Découpler valeur brute / sens / utility → multi-marque au runtime sans rebuild. |
| Pourquoi jamais de hex dans un composant ? | Un hex casse le changement de marque ; on parle en intentions (`bg-brand`). |
| Pourquoi cva ? | Une source typée unique pour variant × size × state, au lieu de ternaires. |
| Pourquoi 3 cva dans Button ? | Fond, texte et icône suivent des tokens différents → une couche chacun. |
| Pourquoi `cn()` et pas `+` ? | tailwind-merge résout les conflits de classes (le dernier gagne proprement). |
| Pourquoi `forwardRef` partout ? | Sans ref, la composition et le focus programmatique cassent. |
| Pourquoi `asChild`/`Slot` ? | Un composant, plusieurs éléments (`<button>` ou `<a>`), zéro duplication. |
| Pourquoi copie-colle et pas npm ? | Le consommateur possède le source, pas de boîte noire ni de breaking subi. |
| Pourquoi un dossier + index par composant ? | Détachabilité : chaque brique se copie et marche seule. |

---

## Fichiers de référence

- Composant simple : `src/components/button/Button.tsx`
- Composant compound (Radix re-export) : `src/components/collapsible/Collapsible.tsx`
- Helper de classes : `src/lib/cn.ts`
- Tokens : `src/styles/tokens/{primitives,aliases,theme}.css`
- Template de doc : `docs/component-doc-template.md`
- Conventions projet : `CLAUDE.md`
