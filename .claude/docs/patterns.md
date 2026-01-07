# Code Patterns

## Component Pattern (shadcn/ui)

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva("base-classes", {
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
})

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

## Hook Pattern

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

## Utility Pattern

```tsx
// Pure function - no side effects
export function formatCode(code: string, language: string): string {
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

## TypeScript Naming

```tsx
// Props: ComponentNameProps
interface ButtonProps extends React.ComponentProps<"button"> {}

// Hook options: UseHookNameOptions
interface UseEditorOptions {}

// Hook return: UseHookNameReturn
interface UseEditorReturn {}

// API types: PascalCase
interface GenerationResponse {}
```

## Styling (Tailwind Only)

```tsx
// Order: layout → sizing → spacing → typography → colors → effects
<div className="flex flex-col w-full h-screen p-4 text-sm text-foreground bg-background shadow-md">

// Conditional with cn()
<div className={cn("p-4", isActive && "bg-primary")}>
```

## Testing Pattern

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("handles interaction", async () => {
    const user = userEvent.setup()
    const onAction = jest.fn()
    render(<Component onAction={onAction} />)
    await user.click(screen.getByRole("button"))
    expect(onAction).toHaveBeenCalledTimes(1)
  })
})
```
