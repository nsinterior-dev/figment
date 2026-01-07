# Figment Design System

A design-to-code application design system combining Geist's clean minimalism with Nord's calm aesthetic.

**Theme**: Dual (dark-first)
**Font**: Inter (sans), Geist Mono (code)
**Code Editor**: Matches app theme

---

## Color Architecture

### 12-Step Scale System (Radix-inspired)

Each color scale has 12 steps with specific purposes:

| Step | Token | Purpose | Usage |
|------|-------|---------|-------|
| 1 | `{color}-1` | App background | Main page background |
| 2 | `{color}-2` | Subtle background | Cards, sidebars, code blocks |
| 3 | `{color}-3` | UI background (normal) | Button default, input default |
| 4 | `{color}-4` | UI background (hover) | Button hover, input hover |
| 5 | `{color}-5` | UI background (active) | Button pressed, selected |
| 6 | `{color}-6` | Subtle border | Card borders, dividers |
| 7 | `{color}-7` | Border (normal) | Input border, button outline |
| 8 | `{color}-8` | Border (hover/focus) | Focus rings, hover borders |
| 9 | `{color}-9` | Solid background | Primary buttons, badges |
| 10 | `{color}-10` | Solid hover | Primary button hover |
| 11 | `{color}-11` | Low-contrast text | Secondary text, placeholders |
| 12 | `{color}-12` | High-contrast text | Primary text, headings |

---

## Semantic Color Tokens

### Base Tokens (CSS Variables)

```css
/* Background Scale */
--background        /* Step 1: Page background */
--background-subtle /* Step 2: Elevated surfaces */

/* Surface/Card Scale */
--card              /* Step 2: Card background */
--card-foreground   /* Step 12: Card text */

/* Gray Scale (UI Components) */
--gray-3            /* Normal state background */
--gray-4            /* Hover state background */
--gray-5            /* Active/pressed state */
--gray-6            /* Subtle borders */
--gray-7            /* Component borders */
--gray-8            /* Focus rings, strong borders */
--gray-11           /* Secondary text */
--gray-12           /* Primary text */

/* Primary Scale (Brand/CTA) */
--primary           /* Step 9: Solid background */
--primary-hover     /* Step 10: Hover state */
--primary-foreground /* Contrast text on primary */

/* Secondary Scale */
--secondary         /* Step 3: Subtle background */
--secondary-hover   /* Step 4: Hover */
--secondary-foreground /* Text on secondary */

/* Accent Scale (Frost Blue) */
--accent            /* Step 9: Accent solid */
--accent-hover      /* Step 10: Accent hover */
--accent-subtle     /* Step 3: Subtle accent bg */
--accent-foreground /* Text on accent */

/* Destructive Scale (Aurora Red) */
--destructive       /* Step 9: Error solid */
--destructive-hover /* Step 10: Error hover */
--destructive-foreground /* Text on destructive */

/* Utility */
--muted             /* Step 3: Muted background */
--muted-foreground  /* Step 11: Muted text */
--border            /* Step 6: Default border */
--input             /* Step 7: Input border */
--ring              /* Step 8: Focus ring */
```

---

## Color Palette

### Dark Theme (Default)

```css
:root {
  /* Backgrounds */
  --background: oklch(0.145 0.015 260);          /* #13151a - Deep blue-gray */
  --background-subtle: oklch(0.175 0.015 260);   /* #1a1d24 */

  /* Foreground */
  --foreground: oklch(0.93 0.01 260);            /* #e8eaed - Snow white */

  /* Card */
  --card: oklch(0.175 0.015 260);                /* #1a1d24 */
  --card-foreground: oklch(0.93 0.01 260);

  /* Gray Scale */
  --gray-3: oklch(0.22 0.015 260);               /* #262a33 - Normal */
  --gray-4: oklch(0.26 0.015 260);               /* #2e333d - Hover */
  --gray-5: oklch(0.30 0.015 260);               /* #363c47 - Active */
  --gray-6: oklch(0.34 0.012 260);               /* #3e444f - Subtle border */
  --gray-7: oklch(0.40 0.012 260);               /* #4a515d - Border */
  --gray-8: oklch(0.50 0.012 260);               /* #5f6673 - Focus */
  --gray-11: oklch(0.70 0.01 260);               /* #9ca3af - Secondary text */
  --gray-12: oklch(0.93 0.01 260);               /* #e8eaed - Primary text */

  /* Primary (Neutral - Light on Dark) */
  --primary: oklch(0.93 0.01 260);               /* Light */
  --primary-hover: oklch(0.88 0.01 260);
  --primary-foreground: oklch(0.145 0.015 260);  /* Dark */

  /* Secondary */
  --secondary: oklch(0.22 0.015 260);            /* gray-3 */
  --secondary-hover: oklch(0.26 0.015 260);      /* gray-4 */
  --secondary-foreground: oklch(0.93 0.01 260);

  /* Accent (Frost Blue - Nord) */
  --accent: oklch(0.75 0.1 200);                 /* #88c0d0 - Frost */
  --accent-hover: oklch(0.70 0.1 200);           /* Darker frost */
  --accent-subtle: oklch(0.25 0.05 200);         /* Subtle frost bg */
  --accent-foreground: oklch(0.145 0.015 260);

  /* Muted */
  --muted: oklch(0.22 0.015 260);                /* gray-3 */
  --muted-foreground: oklch(0.65 0.01 260);      /* gray-11 lighter */

  /* Destructive (Aurora Red) */
  --destructive: oklch(0.60 0.18 25);            /* #bf616a */
  --destructive-hover: oklch(0.55 0.18 25);
  --destructive-foreground: oklch(0.98 0.01 0);  /* White */

  /* Borders */
  --border: oklch(0.30 0.012 260);               /* gray-5 */
  --input: oklch(0.34 0.012 260);                /* gray-6 */
  --ring: oklch(0.75 0.1 200);                   /* accent */

  /* Additional Semantic Colors */
  --success: oklch(0.65 0.15 145);               /* #a3be8c - Aurora Green */
  --warning: oklch(0.80 0.12 85);                /* #ebcb8b - Aurora Yellow */
  --info: oklch(0.72 0.08 190);                  /* #8fbcbb - Frost Cyan */
  --purple: oklch(0.70 0.12 320);                /* #b48ead - Aurora Purple */
}
```

### Light Theme

```css
.light {
  /* Backgrounds */
  --background: oklch(0.985 0.005 260);          /* #f9fafb */
  --background-subtle: oklch(0.96 0.005 260);    /* #f3f4f6 */

  /* Foreground */
  --foreground: oklch(0.20 0.015 260);           /* #1f2328 */

  /* Card */
  --card: oklch(1.0 0 0);                        /* #ffffff */
  --card-foreground: oklch(0.20 0.015 260);

  /* Gray Scale */
  --gray-3: oklch(0.96 0.005 260);               /* #f3f4f6 - Normal */
  --gray-4: oklch(0.92 0.005 260);               /* #e5e7eb - Hover */
  --gray-5: oklch(0.88 0.008 260);               /* #d1d5db - Active */
  --gray-6: oklch(0.84 0.008 260);               /* #c4c9d1 - Subtle border */
  --gray-7: oklch(0.75 0.01 260);                /* #9ca3af - Border */
  --gray-8: oklch(0.65 0.01 260);                /* #6b7280 - Focus */
  --gray-11: oklch(0.45 0.01 260);               /* #4b5563 - Secondary text */
  --gray-12: oklch(0.20 0.015 260);              /* #1f2328 - Primary text */

  /* Primary (Neutral - Dark on Light) */
  --primary: oklch(0.20 0.015 260);              /* Dark */
  --primary-hover: oklch(0.30 0.015 260);
  --primary-foreground: oklch(0.985 0.005 260); /* Light */

  /* Secondary */
  --secondary: oklch(0.96 0.005 260);            /* gray-3 */
  --secondary-hover: oklch(0.92 0.005 260);      /* gray-4 */
  --secondary-foreground: oklch(0.20 0.015 260);

  /* Accent (Deeper Frost for Contrast) */
  --accent: oklch(0.55 0.12 200);                /* #3d8fa6 */
  --accent-hover: oklch(0.50 0.12 200);
  --accent-subtle: oklch(0.94 0.03 200);
  --accent-foreground: oklch(1.0 0 0);           /* White */

  /* Muted */
  --muted: oklch(0.96 0.005 260);
  --muted-foreground: oklch(0.50 0.01 260);

  /* Destructive */
  --destructive: oklch(0.55 0.22 25);            /* #dc2626 */
  --destructive-hover: oklch(0.50 0.22 25);
  --destructive-foreground: oklch(1.0 0 0);

  /* Borders */
  --border: oklch(0.88 0.008 260);               /* gray-5 */
  --input: oklch(0.84 0.008 260);                /* gray-6 */
  --ring: oklch(0.55 0.12 200);                  /* accent */

  /* Additional Semantic Colors */
  --success: oklch(0.55 0.18 145);               /* #16a34a */
  --warning: oklch(0.70 0.15 70);                /* #d97706 */
  --info: oklch(0.55 0.12 200);                  /* #0891b2 */
  --purple: oklch(0.55 0.18 300);                /* #7c3aed */
}
```

---

## Component Specifications

### Button

| Variant | State | Background | Text | Border |
|---------|-------|------------|------|--------|
| **default** | normal | `primary` | `primary-foreground` | none |
| | hover | `primary-hover` | `primary-foreground` | none |
| | active | `primary` opacity 80% | `primary-foreground` | none |
| | disabled | `primary` opacity 50% | `primary-foreground` opacity 50% | none |
| **secondary** | normal | `secondary` | `secondary-foreground` | none |
| | hover | `secondary-hover` | `secondary-foreground` | none |
| | active | `gray-5` | `secondary-foreground` | none |
| **outline** | normal | `transparent` | `foreground` | `border` |
| | hover | `accent-subtle` | `accent-foreground` | `border` |
| | active | `gray-5` | `foreground` | `border` |
| **ghost** | normal | `transparent` | `foreground` | none |
| | hover | `gray-4` | `foreground` | none |
| | active | `gray-5` | `foreground` | none |
| **destructive** | normal | `destructive` | `destructive-foreground` | none |
| | hover | `destructive-hover` | `destructive-foreground` | none |
| **link** | normal | `transparent` | `accent` | none |
| | hover | `transparent` | `accent` + underline | none |

**Sizes:**
| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| `sm` | 32px | `px-3 py-1.5` | 14px | 16px |
| `default` | 36px | `px-4 py-2` | 14px | 16px |
| `lg` | 40px | `px-6 py-2.5` | 16px | 20px |
| `icon` | 36px | `p-2` | - | 20px |
| `icon-sm` | 32px | `p-1.5` | - | 16px |
| `icon-lg` | 40px | `p-2.5` | - | 24px |

**Implementation:**
```tsx
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-border bg-transparent hover:bg-accent/10 hover:text-accent",
      ghost: "hover:bg-gray-4 hover:text-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      link: "text-accent underline-offset-4 hover:underline",
    }
  }
})
```

---

### Input

| State | Background | Text | Border | Ring |
|-------|------------|------|--------|------|
| normal | `background` | `foreground` | `input` | none |
| hover | `background` | `foreground` | `gray-8` | none |
| focus | `background` | `foreground` | `ring` | `ring` 2px |
| disabled | `muted` | `muted-foreground` | `border` | none |
| error | `background` | `foreground` | `destructive` | `destructive` 2px |

**Specs:**
| Property | Value |
|----------|-------|
| Height | 36px |
| Padding | `px-3 py-2` |
| Border | 1px solid |
| Radius | `rounded-md` (6px) |
| Font Size | 14px |
| Placeholder | `muted-foreground` |

**Implementation:**
```tsx
<input className={cn(
  "h-9 w-full rounded-md border border-input bg-background px-3 py-2",
  "text-sm text-foreground placeholder:text-muted-foreground",
  "hover:border-gray-8",
  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20"
)} />
```

---

### Card

| Element | Token | Value |
|---------|-------|-------|
| Background | `card` | Subtle elevation |
| Text | `card-foreground` | High contrast |
| Border | `border` | Subtle separator |
| Radius | `rounded-lg` | 8px |
| Padding | `p-6` | 24px |
| Shadow (light only) | `shadow-sm` | Subtle elevation |

**Implementation:**
```tsx
<div className={cn(
  "bg-card text-card-foreground",
  "border border-border rounded-lg",
  "p-6",
  "shadow-sm dark:shadow-none"
)} />
```

---

### Badge

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| default | `primary` | `primary-foreground` | none |
| secondary | `secondary` | `secondary-foreground` | none |
| outline | `transparent` | `foreground` | `border` |
| destructive | `destructive` | `destructive-foreground` | none |
| success | `success` | white | none |
| warning | `warning` | black | none |
| info | `info` | white | none |

**Specs:**
| Property | Value |
|----------|-------|
| Height | 20px |
| Padding | `px-2 py-0.5` |
| Radius | `rounded-sm` (4px) |
| Font Size | 12px |
| Font Weight | 500 |

---

### Tooltip

| Element | Token |
|---------|-------|
| Background | `gray-12` (inverted) |
| Text | `gray-1` (inverted) |
| Radius | `rounded-md` (6px) |
| Padding | `px-3 py-1.5` |
| Font Size | 12px |

---

### Dialog/Modal

| Element | Token |
|---------|-------|
| Overlay | `black/80` |
| Background | `card` |
| Border | `border` |
| Radius | `rounded-xl` (12px) |
| Padding | `p-6` |
| Shadow | `shadow-lg` |

---

### Dropdown Menu

| Element | State | Token |
|---------|-------|-------|
| Container | - | `card` bg, `border` border, `rounded-lg` |
| Item | normal | `transparent` bg |
| Item | hover | `accent-subtle` bg |
| Item | active | `accent` bg, `accent-foreground` text |
| Separator | - | `border` |

---

## Code Editor Theme

### Dark Theme Syntax

| Element | Token | Color |
|---------|-------|-------|
| Background | `background` | #13151a |
| Foreground | `foreground` | #e8eaed |
| Comments | `muted-foreground` | #6b7280 |
| Keywords | `purple` | #b48ead |
| Strings | `success` | #a3be8c |
| Numbers | `warning` | #ebcb8b |
| Functions | `accent` | #88c0d0 |
| Variables | `foreground` | #e8eaed |
| Types | `info` | #8fbcbb |
| Constants | `warning` | #ebcb8b |
| Operators | `gray-11` | #9ca3af |
| Punctuation | `gray-11` | #9ca3af |
| Selection | `accent-subtle` | rgba(136,192,208,0.2) |
| Line Numbers | `muted-foreground` | #6b7280 |
| Current Line | `gray-3` | #262a33 |

### Light Theme Syntax

| Element | Token | Color |
|---------|-------|-------|
| Background | `background` | #f9fafb |
| Foreground | `foreground` | #1f2328 |
| Comments | `muted-foreground` | #6b7280 |
| Keywords | `purple` | #7c3aed |
| Strings | `success` | #16a34a |
| Numbers | `warning` | #d97706 |
| Functions | `accent` | #0891b2 |
| Variables | `foreground` | #1f2328 |
| Types | `info` | #0891b2 |

---

## Typography

### Font Stack

```css
--font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
--font-mono: 'Geist Mono', ui-monospace, 'JetBrains Mono', monospace;
```

### Type Scale

| Name | Size | Line Height | Weight | Token |
|------|------|-------------|--------|-------|
| `xs` | 12px | 16px | 400 | `text-xs` |
| `sm` | 14px | 20px | 400 | `text-sm` |
| `base` | 16px | 24px | 400 | `text-base` |
| `lg` | 18px | 28px | 400 | `text-lg` |
| `xl` | 20px | 28px | 600 | `text-xl` |
| `2xl` | 24px | 32px | 600 | `text-2xl` |
| `3xl` | 30px | 36px | 700 | `text-3xl` |
| `4xl` | 36px | 40px | 700 | `text-4xl` |

### Text Colors

| Purpose | Token | Usage |
|---------|-------|-------|
| Primary | `foreground` | Headings, body |
| Secondary | `muted-foreground` | Descriptions, hints |
| Accent | `accent` | Links, highlights |
| Error | `destructive` | Error messages |
| Success | `success` | Success messages |

---

## Spacing (8px Grid)

| Token | Value | Tailwind |
|-------|-------|----------|
| `1` | 4px | `gap-1`, `p-1` |
| `2` | 8px | `gap-2`, `p-2` |
| `3` | 12px | `gap-3`, `p-3` |
| `4` | 16px | `gap-4`, `p-4` |
| `5` | 20px | `gap-5`, `p-5` |
| `6` | 24px | `gap-6`, `p-6` |
| `8` | 32px | `gap-8`, `p-8` |
| `10` | 40px | `gap-10`, `p-10` |
| `12` | 48px | `gap-12`, `p-12` |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Badges, small elements |
| `rounded-md` | 6px | Buttons, inputs |
| `rounded-lg` | 8px | Cards, panels |
| `rounded-xl` | 12px | Modals, dialogs |
| `rounded-full` | 9999px | Pills, avatars |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.05)` | Cards (light mode) |
| `shadow` | `0 1px 3px rgb(0 0 0 / 0.1)` | Dropdowns |
| `shadow-lg` | `0 10px 15px rgb(0 0 0 / 0.1)` | Modals |

**Note:** Dark mode uses borders instead of shadows for elevation.

---

## Animation

| Property | Duration | Easing |
|----------|----------|--------|
| Colors | 150ms | ease-out |
| Transform | 200ms | ease-out |
| Opacity | 200ms | ease-out |
| Complex | 300ms | ease-in-out |

---

## Usage Rules

### DO
- Always use semantic tokens (`bg-primary`, not `bg-blue-500`)
- Reference the 12-step scale for state changes
- Match code editor theme to app theme
- Test both light and dark modes
- Use consistent radius per component type

### DON'T
- Hardcode hex colors in components
- Create custom colors outside the system
- Use shadows in dark mode (use borders)
- Skip hover/focus states
- Mix radius styles in same context
