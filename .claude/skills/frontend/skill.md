# Frontend Development Skill

This skill provides guidance for frontend development in the Figment project using Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.

## When to Use This Skill

Use `/frontend` when:
- Implementing new features
- Creating or modifying components
- Writing custom hooks
- Fixing bugs in the frontend
- Refactoring existing code
- Adding tests

## Workflow

### 1. Understand the Task
- Identify which feature module the work belongs to
- Determine which layer(s) will be affected (components/hooks/utils)
- Check for existing patterns in the codebase

### 2. Search Before Creating
```bash
# Search for similar components
grep -r "ComponentName" src/

# Search for similar hooks
grep -r "use[A-Z]" src/features/
```

### 3. Plan the Implementation
- List files to create/modify
- Identify dependencies
- Consider test coverage

### 4. Follow Architecture
```
src/features/[feature]/
├── components/     # UI components (props-driven, no logic)
├── hooks/          # Business logic (state, side effects)
├── utils/          # Pure functions (no React)
└── __tests__/      # Test files
```

### 5. Implement with Standards
- Use TypeScript strictly (no `any`)
- Use Tailwind for styling
- Follow shadcn/ui patterns for components
- Separate concerns (UI vs Logic)

### 6. Test Your Work
- Create test files alongside implementations
- Cover happy paths and edge cases
- Test hooks with `renderHook`

## References

| Reference | Purpose |
|-----------|---------|
| [Architecture](references/architecture.md) | Feature-based architecture guide |
| [SOLID Principles](references/solid-principles.md) | SOLID principles for React |
| [React Patterns](references/react-patterns.md) | Common React patterns |
| [Testing](references/testing.md) | Testing best practices |

## Key Patterns

### Component Creation
```tsx
// Use shadcn/ui pattern with cva
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const variants = cva("base", { variants: { ... } })

function Component({ className, ...props }: Props) {
  return <div className={cn(variants(), className)} {...props} />
}
```

### Hook Creation
```tsx
// Hooks return typed objects
interface UseXReturn {
  data: T
  isLoading: boolean
  error: Error | null
  actions: { execute: () => void }
}

export function useX(): UseXReturn { ... }
```

### Utility Creation
```tsx
// Pure functions with type guards
export function isValid(x: unknown): x is ValidType {
  return typeof x === "object" && x !== null
}
```

## Checklist

Before completing a task:
- [ ] Code follows TypeScript strict mode
- [ ] Styling uses Tailwind only
- [ ] Components are in correct layer
- [ ] Business logic is in hooks
- [ ] Tests are written
- [ ] No console.log statements left
- [ ] No `any` types
- [ ] Proper error handling
