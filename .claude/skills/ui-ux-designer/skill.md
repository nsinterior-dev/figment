# UI/UX Designer Skill

Provides design system guidance, visual consistency, and UI/UX decisions for Figment.

## When to Use

Use `/ui-ux-designer` when:
- Making styling decisions
- Choosing colors or states for components
- Ensuring visual consistency
- Creating new UI components
- Reviewing design compliance

## Design System Reference

Full documentation: [design-system.md](../../docs/design-system.md)

### Theme

- **Mode**: Dual (dark-first)
- **Style**: Geist clean + Nord calm
- **Font**: Inter (sans), Geist Mono (code)
- **Code Editor**: Matches app theme

### Color Tokens

| Token | Purpose |
|-------|---------|
| `background` | Page background |
| `foreground` | Primary text |
| `card` | Elevated surfaces |
| `primary` | CTAs, primary actions |
| `secondary` | Secondary actions |
| `accent` | Links, highlights (Frost Blue) |
| `muted` | Disabled, subtle |
| `muted-foreground` | Secondary text |
| `destructive` | Errors, warnings |
| `border` | Borders, dividers |
| `ring` | Focus rings |

### 12-Step Scale (Component States)

| Step | Purpose | Example |
|------|---------|---------|
| 1-2 | Backgrounds | Page, cards |
| 3 | Normal state | Button default |
| 4 | Hover state | Button hover |
| 5 | Active state | Button pressed |
| 6 | Subtle border | Card border |
| 7 | Border normal | Input border |
| 8 | Border focus | Focus ring |
| 9 | Solid bg | Primary button |
| 10 | Solid hover | Primary hover |
| 11 | Low-contrast text | Secondary text |
| 12 | High-contrast text | Primary text |

### Component Quick Reference

#### Button States

| Variant | Normal | Hover | Active |
|---------|--------|-------|--------|
| default | `primary` | `primary/90` | `primary/80` |
| secondary | `secondary` | `gray-4` | `gray-5` |
| outline | `transparent` | `accent-subtle` | `gray-5` |
| ghost | `transparent` | `gray-4` | `gray-5` |
| destructive | `destructive` | `destructive/90` | `destructive/80` |

#### Input States

| State | Border | Ring |
|-------|--------|------|
| normal | `input` | none |
| hover | `gray-8` | none |
| focus | `ring` | `ring` 2px |
| error | `destructive` | `destructive` 2px |

### Sizing

| Component | Height | Padding |
|-----------|--------|---------|
| Button sm | 32px | `px-3` |
| Button default | 36px | `px-4` |
| Button lg | 40px | `px-6` |
| Input | 36px | `px-3` |
| Badge | 20px | `px-2` |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Badges |
| `rounded-md` | 6px | Buttons, inputs |
| `rounded-lg` | 8px | Cards |
| `rounded-xl` | 12px | Modals |

### Typography

| Size | Pixels | Usage |
|------|--------|-------|
| `text-xs` | 12px | Labels, captions |
| `text-sm` | 14px | UI text, buttons |
| `text-base` | 16px | Body |
| `text-lg` | 18px | Lead |
| `text-xl` | 20px | H4 |
| `text-2xl` | 24px | H3 |
| `text-3xl` | 30px | H2 |
| `text-4xl` | 36px | H1 |

## Review Checklist

When reviewing UI/UX:

- [ ] Uses semantic color tokens (not hardcoded)
- [ ] Follows 12-step scale for states
- [ ] Consistent border radius per component type
- [ ] Proper spacing (8px grid)
- [ ] Accessible contrast (4.5:1 min)
- [ ] Focus states visible
- [ ] Works in both light and dark modes
- [ ] Matches existing component patterns

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `bg-blue-500` | Use `bg-accent` |
| `text-gray-500` | Use `text-muted-foreground` |
| `border-gray-300` | Use `border-border` |
| `hover:bg-gray-100` | Use `hover:bg-gray-4` |
| Mixed radius | Pick one per component type |
| Custom shadows in dark | Use borders instead |
