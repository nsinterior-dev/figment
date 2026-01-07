# Feature-Based Architecture Guide

## Overview

Figment uses a feature-based architecture that organizes code by domain rather than technical type. This approach improves maintainability, scalability, and developer experience.

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (providers, fonts)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles & Tailwind config
│   └── [route]/            # Nested routes
│       └── page.tsx
│
├── components/             # Shared UI components
│   └── ui/                 # shadcn/ui primitives
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
│
├── features/               # Feature modules
│   └── [feature-name]/
│       ├── __tests__/      # Feature tests
│       ├── components/     # Feature UI
│       ├── hooks/          # Feature logic
│       └── utils/          # Feature utilities
│
├── lib/                    # Shared utilities
│   └── utils.ts            # cn() and helpers
│
└── shared/                 # Cross-cutting concerns
    └── types/              # Shared TypeScript types
```

## Layer Responsibilities

### App Layer (`src/app/`)

**Purpose**: Routing and page composition only.

**Rules**:
- No business logic
- Import and compose feature components
- Handle route-specific metadata
- Manage layouts and providers

```tsx
// src/app/editor/page.tsx
import { Editor } from "@/features/editor/components/Editor"

export default function EditorPage() {
  return <Editor />
}
```

### Components Layer (`src/components/`)

**Purpose**: Shared, reusable UI primitives.

**Rules**:
- Framework-agnostic design
- Props-driven behavior
- No business logic
- Styled with Tailwind + cva

```tsx
// src/components/ui/button.tsx
const buttonVariants = cva("base-classes", {
  variants: { variant: { ... }, size: { ... } }
})

function Button({ variant, size, className, ...props }) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}
```

### Features Layer (`src/features/`)

**Purpose**: Domain-specific functionality organized by business capability.

#### Feature Components (`features/*/components/`)

**Rules**:
- Feature-specific UI
- Can use shared components
- Receives data via props
- Delegates logic to hooks

```tsx
// src/features/editor/components/CodeEditor.tsx
import { useEditor } from "../hooks/useEditor"
import { Button } from "@/components/ui/button"

interface CodeEditorProps {
  initialCode?: string
  onSave?: (code: string) => void
}

export function CodeEditor({ initialCode, onSave }: CodeEditorProps) {
  const { code, setCode, format } = useEditor({ initialCode })

  return (
    <div className="flex flex-col gap-4">
      <textarea value={code} onChange={(e) => setCode(e.target.value)} />
      <Button onClick={() => onSave?.(code)}>Save</Button>
    </div>
  )
}
```

#### Feature Hooks (`features/*/hooks/`)

**Rules**:
- Encapsulate business logic
- Manage state and side effects
- Return typed interfaces
- Can call other hooks

```tsx
// src/features/editor/hooks/useEditor.ts
interface UseEditorOptions {
  initialCode?: string
  language?: string
}

interface UseEditorReturn {
  code: string
  setCode: (code: string) => void
  format: () => void
  isFormatting: boolean
}

export function useEditor(options: UseEditorOptions = {}): UseEditorReturn {
  const [code, setCode] = useState(options.initialCode ?? "")
  const [isFormatting, setIsFormatting] = useState(false)

  const format = useCallback(() => {
    setIsFormatting(true)
    const formatted = formatCode(code, options.language)
    setCode(formatted)
    setIsFormatting(false)
  }, [code, options.language])

  return { code, setCode, format, isFormatting }
}
```

#### Feature Utils (`features/*/utils/`)

**Rules**:
- Pure functions only
- No React dependencies
- No side effects
- Easily testable

```tsx
// src/features/editor/utils/formatCode.ts
export function formatCode(code: string, language?: string): string {
  // Pure transformation logic
  return formattedCode
}

export function validateSyntax(code: string): ValidationResult {
  // Pure validation logic
  return { isValid: true, errors: [] }
}
```

### Lib Layer (`src/lib/`)

**Purpose**: Framework-agnostic utilities shared across features.

```tsx
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Shared Layer (`src/shared/`)

**Purpose**: Cross-cutting types and constants.

```tsx
// src/shared/types/api.ts
export interface ApiResponse<T> {
  data: T
  status: "success" | "error"
  message?: string
}

export interface GenerationRequest {
  prompt: string
  language: string
  framework?: string
}
```

## Import Guidelines

### Import Order
```tsx
// 1. React
import * as React from "react"

// 2. External libraries
import { cva } from "class-variance-authority"

// 3. Absolute imports (@/)
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// 4. Relative imports
import { useEditor } from "../hooks/useEditor"

// 5. Types
import type { EditorProps } from "../types"
```

### Import Rules

| From | Can Import |
|------|-----------|
| `app/` | `components/`, `features/*/components/`, `lib/`, `shared/` |
| `components/ui/` | `lib/` only |
| `features/*/components/` | `components/`, `lib/`, same feature's `hooks/` and `utils/` |
| `features/*/hooks/` | `lib/`, same feature's `utils/`, `shared/` |
| `features/*/utils/` | `lib/`, `shared/types/` |

## Creating a New Feature

### Step 1: Create Structure
```bash
mkdir -p src/features/[name]/{__tests__,components,hooks,utils}
```

### Step 2: Define Types
```tsx
// src/features/[name]/types.ts
export interface FeatureState { ... }
export interface FeatureActions { ... }
```

### Step 3: Create Utils (if needed)
```tsx
// src/features/[name]/utils/transform.ts
export function transform(input: Input): Output { ... }
```

### Step 4: Create Hooks
```tsx
// src/features/[name]/hooks/useFeature.ts
export function useFeature(): UseFeatureReturn { ... }
```

### Step 5: Create Components
```tsx
// src/features/[name]/components/FeatureView.tsx
export function FeatureView({ ... }: Props) { ... }
```

### Step 6: Create Index (optional)
```tsx
// src/features/[name]/index.ts
export { FeatureView } from "./components/FeatureView"
export { useFeature } from "./hooks/useFeature"
export type { FeatureState } from "./types"
```

## Anti-Patterns

### Circular Dependencies
```tsx
// BAD: features/a imports from features/b and vice versa
// features/a/hooks/useA.ts
import { useB } from "@/features/b/hooks/useB" // Avoid!

// GOOD: Extract shared logic to lib/ or shared/
```

### Logic in Components
```tsx
// BAD: Business logic in component
function Component() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch("/api/data").then(r => r.json()).then(setData)
  }, [])
  // ...
}

// GOOD: Logic in hook
function Component() {
  const { data, isLoading } = useData()
  // ...
}
```

### Shared Components with Business Logic
```tsx
// BAD: Business-specific logic in shared component
// src/components/ui/user-avatar.tsx
function UserAvatar() {
  const user = useCurrentUser() // Feature-specific!
  return <Avatar src={user.avatar} />
}

// GOOD: Keep shared components generic
// src/components/ui/avatar.tsx
function Avatar({ src, alt }: AvatarProps) {
  return <img src={src} alt={alt} />
}
```
