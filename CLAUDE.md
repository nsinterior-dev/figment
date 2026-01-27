# Figment - Claude Code Guidelines

**Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui**

---

## Golden Rules

**ALWAYS:**
1. Search existing code before creating new
2. Check `src/components/ui/` for shared components
3. Follow feature-based architecture
4. Use TypeScript strictly (no `any`)
5. Use Tailwind only (no inline styles)

**NEVER:**
- Put business logic in components (use hooks)
- Create components without checking existing ones
- Skip investigation when debugging
- Assume - verify first

---

## Quick Reference

| Task | Location |
|------|----------|
| Shared UI | `src/components/ui/` |
| Feature code | `src/features/[name]/` |
| Feature UI | `features/[name]/components/` |
| Feature logic | `features/[name]/hooks/` |
| Pure functions | `features/[name]/utils/` |
| Shared types | `src/shared/types/` |

---

## Skills

| Skill | When to Use |
|-------|-------------|
| `/frontend` | Feature implementation, bug fixes, refactoring |
| `/code-reviewer` | Review code for architecture compliance |
| `/ui-ux-designer` | Design decisions, styling, visual consistency |
| `/mentor` | Learn patterns, architecture, get guidance on best practices |

---

## Tech Stack

| Tech | Version |
|------|---------|
| Next.js | 16.1.1 |
| React | 19.2.3 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 |
| shadcn/ui | new-york |
| CodeMirror | ^4.25.4 |
| Sandpack | ^2.20.0 |
| Google AI | ^0.24.1 |
| Jest | ^30.2.0 |

---

## Commands

```bash
npm run dev          # Dev server (port 3200)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run tests
npm run test:watch   # Watch mode
```

---

## Design System Quick Reference

| Token | Usage |
|-------|-------|
| `background` | Page background |
| `foreground` | Primary text |
| `card` | Card/panel backgrounds |
| `primary` | CTAs, primary buttons |
| `secondary` | Secondary buttons |
| `accent` | Links, highlights (Frost Blue) |
| `muted` | Disabled, subtle areas |
| `muted-foreground` | Secondary text |
| `destructive` | Errors, delete actions |
| `border` | Borders, dividers |

**Component States** (12-step scale):
- Step 3: Normal background
- Step 4: Hover background
- Step 5: Active/pressed
- Step 7: Border normal
- Step 8: Border hover/focus

See [Design System](.claude/docs/design-system.md) for full specs.

---

## Anti-Patterns

| Don't | Do |
|-------|-----|
| Logic in components | Extract to hooks |
| `any` type | Define interfaces |
| Inline styles | Tailwind classes |
| Hardcode colors | Use semantic tokens |
| Giant components | Split by responsibility |
| Assume bug cause | Investigate first |
| Skip existing patterns | Search codebase first |

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [PRD](docs/PRD.md) | Product requirements, features, roadmap |
| [Technical Learning Plan](docs/TECHNICAL-LEARNING-PLAN.md) | Step-by-step build & learn guide |
| [Design System](.claude/docs/design-system.md) | Colors, typography, components, tokens |
| [Architecture](.claude/docs/architecture.md) | Directory structure, layers, imports |
| [Patterns](.claude/docs/patterns.md) | Component, hook, util patterns |
| [AI Collaboration](.claude/docs/ai-collaboration.md) | Working effectively with AI |
| [Debugging](.claude/docs/debugging.md) | Investigation protocol |
| [SOLID Principles](.claude/skills/frontend/references/solid-principles.md) | SOLID for React |
| [React Patterns](.claude/skills/frontend/references/react-patterns.md) | Common React patterns |
| [Testing](.claude/skills/frontend/references/testing.md) | Testing best practices |

### Mentor Resources

| Doc | Purpose |
|-----|---------|
| [Architecture Patterns](.claude/skills/mentor/references/architecture-patterns.md) | Design patterns, state management, data flow |
| [Code Review Guide](.claude/skills/mentor/references/code-review-guide.md) | Giving and receiving feedback |
| [Learning Roadmap](.claude/skills/mentor/references/learning-roadmap.md) | Skill progression path |
| [Problem Solving](.claude/skills/mentor/references/problem-solving.md) | Systematic debugging approach |

---

## AI Collaboration Quick Commands

| Situation | Say |
|-----------|-----|
| Starting work | "Follow CLAUDE.md. Implement [X] in [module]." |
| Prevent assumptions | "Don't assume - investigate first" |
| Enforce structure | "Extract that to a hook" |
| Debug properly | "Investigate this bug - don't fix yet" |
| Get root cause | "What are 3 possible causes?" |
| Verify fix | "How do we confirm this is the root cause?" |

---

## Debugging Quick Protocol

1. **Reproduce** - Exact steps, conditions
2. **Observe** - Actual vs expected, error messages
3. **Collect** - Console, network, React DevTools
4. **Trace** - Data flow from source to error
5. **Isolate** - Which component/hook fails?
6. **Hypothesize** - List multiple possibilities
7. **Verify** - Confirm with targeted logs
8. **Fix** - Only after verification

See [Debugging Protocol](.claude/docs/debugging.md) for details.
