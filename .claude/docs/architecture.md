# Architecture Guide

## Directory Structure

```
src/
├── app/                    # Next.js App Router (pages only)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles & Tailwind
├── components/             # Shared UI components
│   └── ui/                 # shadcn/ui components
├── features/               # Feature modules (primary location)
│   └── [feature]/
│       ├── __tests__/      # Feature tests
│       ├── components/     # Feature-specific UI
│       ├── hooks/          # Feature-specific hooks
│       └── utils/          # Feature-specific utilities
├── lib/                    # Shared utilities
│   └── utils.ts            # cn() and common utilities
└── shared/                 # Shared types & constants
    └── types/              # TypeScript interfaces
```

## Layer Responsibilities

| Layer | Purpose | Rules |
|-------|---------|-------|
| `app/` | Routing only | No business logic, compose feature components |
| `components/ui/` | Shared primitives | Props-driven, no business logic |
| `features/*/components/` | Feature UI | Receives data via props, delegates to hooks |
| `features/*/hooks/` | Business logic | State, side effects, API calls |
| `features/*/utils/` | Pure functions | No React, no side effects |

## Import Rules

| From | Can Import |
|------|-----------|
| `app/` | `components/`, `features/*/components/`, `lib/`, `shared/` |
| `components/ui/` | `lib/` only |
| `features/*/components/` | `components/`, `lib/`, same feature's `hooks/` and `utils/` |
| `features/*/hooks/` | `lib/`, same feature's `utils/`, `shared/` |
| `features/*/utils/` | `lib/`, `shared/types/` |

## Import Order

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

// 5. Types (last)
import type { EditorProps } from "../types"
```

## Creating a New Feature

```bash
mkdir -p src/features/[name]/{__tests__,components,hooks,utils}
```

Then create:
1. Types in `types.ts`
2. Utils (pure functions)
3. Hooks (business logic)
4. Components (UI)
5. Tests alongside each file
