# Figment - Claude Code Guidelines

**Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui**

---

## Quick Start: Golden Rules

**ALWAYS do these BEFORE coding:**

1. **SEARCH FIRST** - Never create components/hooks without searching existing codebase
2. **READ existing patterns** - Check `src/components/ui/` and existing features
3. **PLAN architecture** - Identify which feature module and layer (components/hooks/utils)
4. **FOLLOW the stack** - Use shadcn/ui patterns, Tailwind CSS, TypeScript strictly

**NEVER do these:**
- Create components without checking `src/components/ui/`
- Use inline styles or CSS modules (use Tailwind only)
- Use `any` type - define proper TypeScript interfaces
- Skip React imports in JSX files
- Create duplicate utilities - check `src/lib/utils.ts` first
- Put business logic in components - use hooks in `hooks/` directory
- Mix concerns - separate UI from logic

---

## Skills-First Approach

### Available Skills

| Skill | When to Use | Documentation |
|-------|-------------|---------------|
| **`/frontend`** | Feature implementation, bug fixes, refactoring | `.claude/skills/frontend/` |

### Skill Invocation Rules
- **DO**: When implementing code, fixing bugs, refactoring
- **DON'T**: When answering questions or explaining concepts

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework with App Router |
| React | 19.2.3 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Styling |
| shadcn/ui | new-york style | UI components |
| class-variance-authority | ^0.7.1 | Component variants |
| CodeMirror | ^4.25.4 | Code editor |
| Sandpack | ^2.20.0 | Live code preview |
| Google Generative AI | ^0.24.1 | AI generation |
| Lucide React | ^0.562.0 | Icons |
| Jest | ^30.2.0 | Testing |

---

## Architecture Overview

```
src/
├── app/                    # Next.js App Router (pages only)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles & Tailwind
├── components/             # Shared UI components
│   └── ui/                 # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── sonner.tsx
├── features/               # Feature modules (primary location)
│   ├── editor/             # Code editor feature
│   ├── generation/         # AI generation feature
│   ├── inspector/          # Code inspection feature
│   ├── preview/            # Live preview feature
│   └── upload/             # File upload feature
│       ├── __tests__/      # Feature tests
│       ├── components/     # Feature-specific UI
│       ├── hooks/          # Feature-specific hooks
│       └── utils/          # Feature-specific utilities
├── lib/                    # Shared utilities
│   └── utils.ts            # cn() and common utilities
└── shared/                 # Shared types & constants
    └── types/              # TypeScript interfaces
```

### Feature Module Structure

Each feature follows the same pattern:
```
features/[feature-name]/
├── __tests__/              # Unit & integration tests
├── components/             # React components (UI only)
├── hooks/                  # Custom hooks (business logic)
└── utils/                  # Pure utility functions
```

### Layer Responsibilities

| Layer | Purpose | Rules |
|-------|---------|-------|
| `components/` | Pure UI rendering | No business logic, props-driven |
| `hooks/` | State & side effects | Business logic, API calls |
| `utils/` | Pure functions | No React, no side effects |
| `__tests__/` | Test files | Mirror component structure |

---

## Component Patterns

### shadcn/ui Component Pattern

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes",
      },
      size: {
        default: "size-default",
        sm: "size-small",
        lg: "size-large",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ComponentProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof componentVariants> {}

function Component({ className, variant, size, ...props }: ComponentProps) {
  return (
    <div
      data-slot="component"
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Component, componentVariants }
```

### Hook Pattern

```tsx
import { useState, useCallback } from "react"

interface UseFeatureOptions {
  initialValue?: string
  onSuccess?: (result: string) => void
}

interface UseFeatureReturn {
  value: string
  isLoading: boolean
  error: Error | null
  execute: () => Promise<void>
  reset: () => void
}

export function useFeature(options: UseFeatureOptions = {}): UseFeatureReturn {
  const { initialValue = "", onSuccess } = options

  const [value, setValue] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Business logic here
      const result = await someAsyncOperation()
      setValue(result)
      onSuccess?.(result)
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }, [onSuccess])

  const reset = useCallback(() => {
    setValue(initialValue)
    setError(null)
  }, [initialValue])

  return { value, isLoading, error, execute, reset }
}
```

### Utility Function Pattern

```tsx
// Pure function - no side effects, no React
export function formatCode(code: string, language: string): string {
  // Implementation
  return formattedCode
}

// Type guard
export function isValidResponse(data: unknown): data is ApiResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "status" in data &&
    "data" in data
  )
}
```

---

## TypeScript Standards

### Interface Naming
```tsx
// Props interfaces: ComponentNameProps
interface ButtonProps extends React.ComponentProps<"button"> {}

// Hook options: UseHookNameOptions
interface UseEditorOptions {}

// Hook return: UseHookNameReturn
interface UseEditorReturn {}

// API types: PascalCase
interface GenerationResponse {}
interface UploadRequest {}
```

### Strict Typing Rules
- Never use `any` - use `unknown` and type guards
- Always define return types for functions
- Use `interface` for object shapes, `type` for unions/primitives
- Export types alongside their implementations

```tsx
// Bad
const handleData = (data: any) => { ... }

// Good
const handleData = (data: unknown): ProcessedData => {
  if (!isValidData(data)) {
    throw new Error("Invalid data")
  }
  return processData(data)
}
```

---

## Styling Guidelines

### Tailwind CSS Only
```tsx
// Bad - inline styles
<div style={{ padding: "16px" }}>

// Bad - CSS modules
import styles from "./component.module.css"

// Good - Tailwind classes
<div className="p-4">

// Good - with cn() for conditional
<div className={cn("p-4", isActive && "bg-primary")}>
```

### Class Organization
```tsx
// Order: layout → sizing → spacing → typography → colors → effects
<div className="flex flex-col w-full h-screen p-4 text-sm text-foreground bg-background shadow-md">
```

### Use CSS Variables
```tsx
// Access theme variables
<div className="bg-background text-foreground border-border">

// For custom values, use arbitrary values sparingly
<div className="w-[320px]">
```

---

## Testing Standards

### File Naming
```
ComponentName.tsx        → ComponentName.test.tsx
useHookName.ts          → useHookName.test.ts
utilityName.ts          → utilityName.test.ts
```

### Test Structure
```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ComponentName } from "./ComponentName"

describe("ComponentName", () => {
  it("renders correctly with default props", () => {
    render(<ComponentName />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("handles user interaction", async () => {
    const user = userEvent.setup()
    const onAction = jest.fn()

    render(<ComponentName onAction={onAction} />)
    await user.click(screen.getByRole("button"))

    expect(onAction).toHaveBeenCalledTimes(1)
  })
})
```

### Hook Testing
```tsx
import { renderHook, act } from "@testing-library/react"
import { useFeature } from "./useFeature"

describe("useFeature", () => {
  it("initializes with default state", () => {
    const { result } = renderHook(() => useFeature())
    expect(result.current.value).toBe("")
    expect(result.current.isLoading).toBe(false)
  })

  it("updates state on execute", async () => {
    const { result } = renderHook(() => useFeature())

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.value).toBeDefined()
  })
})
```

---

## Import Ordering

```tsx
// 1. React
import * as React from "react"
import { useState, useCallback } from "react"

// 2. External libraries
import { cva } from "class-variance-authority"
import { Upload } from "lucide-react"

// 3. Internal aliases (@/)
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// 4. Relative imports (same feature)
import { useEditor } from "../hooks/useEditor"
import { formatCode } from "../utils/formatCode"

// 5. Types (last)
import type { EditorProps } from "../types"
```

---

## Commands

```bash
# Development
npm run dev              # Start dev server (port 3200)

# Quality
npm run lint             # ESLint check
npm run build            # Production build

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode
```

---

## File Creation Checklist

When creating a new file:

- [ ] Check if similar component/hook/util exists
- [ ] Place in correct feature module
- [ ] Use correct layer (components/hooks/utils)
- [ ] Follow naming conventions
- [ ] Add proper TypeScript types
- [ ] Create corresponding test file
- [ ] Use Tailwind for styling
- [ ] Export from feature index (if applicable)

---

## Anti-Patterns to Avoid

| Anti-Pattern | Instead Do |
|--------------|------------|
| Business logic in components | Extract to hooks |
| Inline styles | Use Tailwind classes |
| `any` type | Use proper types/interfaces |
| Duplicating utilities | Check `src/lib/utils.ts` |
| Direct DOM manipulation | Use React state/refs |
| Props drilling > 2 levels | Use context or composition |
| Giant components | Split into smaller focused components |
| Mixed concerns in hooks | Separate data fetching from UI state |

---

## Documentation Index

| Resource | Purpose |
|----------|---------|
| `.claude/skills/frontend/` | Frontend development skill |
| `src/components/ui/` | shadcn/ui component reference |
| `src/features/` | Feature module examples |
