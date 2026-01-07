# Testing Patterns & Best Practices

## Overview

This guide covers testing patterns for the Figment project using Jest and React Testing Library with TypeScript.

---

## Testing Stack

| Tool | Purpose |
|------|---------|
| Jest 30 | Test runner and assertions |
| @testing-library/react | Component testing |
| @testing-library/user-event | User interaction simulation |
| @testing-library/jest-dom | Custom DOM matchers |

---

## File Structure

```
src/features/[feature]/
├── components/
│   └── ComponentName.tsx
├── hooks/
│   └── useHookName.ts
├── utils/
│   └── utilityName.ts
└── __tests__/
    ├── ComponentName.test.tsx
    ├── useHookName.test.ts
    └── utilityName.test.ts
```

### Naming Conventions

| Source File | Test File |
|-------------|-----------|
| `Button.tsx` | `Button.test.tsx` |
| `useEditor.ts` | `useEditor.test.ts` |
| `formatCode.ts` | `formatCode.test.ts` |

---

## Component Testing

### Basic Component Test

```tsx
import { render, screen } from "@testing-library/react"
import { Button } from "../components/Button"

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("data-variant", "destructive")
  })

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Submit</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })
})
```

### Testing User Interactions

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CodeEditor } from "../components/CodeEditor"

describe("CodeEditor", () => {
  it("calls onChange when user types", async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()

    render(<CodeEditor value="" onChange={handleChange} />)

    const textarea = screen.getByRole("textbox")
    await user.type(textarea, "const x = 1")

    expect(handleChange).toHaveBeenCalled()
    expect(handleChange).toHaveBeenLastCalledWith(expect.stringContaining("const x = 1"))
  })

  it("handles copy button click", async () => {
    const user = userEvent.setup()

    // Mock clipboard API
    const mockWriteText = jest.fn()
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText },
    })

    render(<CodeEditor value="const x = 1" onChange={jest.fn()} />)

    await user.click(screen.getByRole("button", { name: /copy/i }))

    expect(mockWriteText).toHaveBeenCalledWith("const x = 1")
  })
})
```

### Testing Async Components

```tsx
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { GenerationPanel } from "../components/GenerationPanel"

// Mock the API
jest.mock("@/lib/api", () => ({
  generateCode: jest.fn(),
}))

import { generateCode } from "@/lib/api"

describe("GenerationPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows loading state during generation", async () => {
    const user = userEvent.setup()
    ;(generateCode as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve("code"), 100))
    )

    render(<GenerationPanel />)

    await user.type(screen.getByRole("textbox"), "Create a button")
    await user.click(screen.getByRole("button", { name: /generate/i }))

    expect(screen.getByText(/generating/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText(/generating/i)).not.toBeInTheDocument()
    })
  })

  it("displays generated code on success", async () => {
    const user = userEvent.setup()
    ;(generateCode as jest.Mock).mockResolvedValue("const Button = () => {}")

    render(<GenerationPanel />)

    await user.type(screen.getByRole("textbox"), "Create a button")
    await user.click(screen.getByRole("button", { name: /generate/i }))

    await waitFor(() => {
      expect(screen.getByText(/const Button/)).toBeInTheDocument()
    })
  })

  it("displays error on failure", async () => {
    const user = userEvent.setup()
    ;(generateCode as jest.Mock).mockRejectedValue(new Error("API error"))

    render(<GenerationPanel />)

    await user.type(screen.getByRole("textbox"), "Create a button")
    await user.click(screen.getByRole("button", { name: /generate/i }))

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
```

### Testing Components with Providers

```tsx
import { render, screen } from "@testing-library/react"
import { ThemeProvider } from "next-themes"
import { ThemeToggle } from "../components/ThemeToggle"

// Create a custom render function
function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      {ui}
    </ThemeProvider>
  )
}

describe("ThemeToggle", () => {
  it("renders theme toggle button", () => {
    renderWithProviders(<ThemeToggle />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })
})

// Or create a test utility
// src/test/test-utils.tsx
import { render as rtlRender } from "@testing-library/react"

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      {children}
    </ThemeProvider>
  )
}

export function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { wrapper: AllTheProviders, ...options })
}

export * from "@testing-library/react"
```

---

## Hook Testing

### Basic Hook Test

```tsx
import { renderHook, act } from "@testing-library/react"
import { useCounter } from "../hooks/useCounter"

describe("useCounter", () => {
  it("initializes with default value", () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it("initializes with provided value", () => {
    const { result } = renderHook(() => useCounter(10))
    expect(result.current.count).toBe(10)
  })

  it("increments count", () => {
    const { result } = renderHook(() => useCounter())

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })

  it("decrements count", () => {
    const { result } = renderHook(() => useCounter(5))

    act(() => {
      result.current.decrement()
    })

    expect(result.current.count).toBe(4)
  })

  it("resets to initial value", () => {
    const { result } = renderHook(() => useCounter(5))

    act(() => {
      result.current.increment()
      result.current.increment()
      result.current.reset()
    })

    expect(result.current.count).toBe(5)
  })
})
```

### Testing Async Hooks

```tsx
import { renderHook, waitFor, act } from "@testing-library/react"
import { useAsync } from "../hooks/useAsync"

describe("useAsync", () => {
  it("handles successful async operation", async () => {
    const mockFn = jest.fn().mockResolvedValue("success")

    const { result } = renderHook(() => useAsync(mockFn))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(null)

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe("success")
    expect(result.current.error).toBe(null)
  })

  it("handles failed async operation", async () => {
    const error = new Error("Failed")
    const mockFn = jest.fn().mockRejectedValue(error)

    const { result } = renderHook(() => useAsync(mockFn))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(error)
  })

  it("executes immediately when immediate option is true", async () => {
    const mockFn = jest.fn().mockResolvedValue("data")

    const { result } = renderHook(() =>
      useAsync(mockFn, { immediate: true })
    )

    await waitFor(() => {
      expect(result.current.data).toBe("data")
    })

    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
```

### Testing Hooks with Dependencies

```tsx
import { renderHook, act } from "@testing-library/react"
import { useDebounce } from "../hooks/useDebounce"

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500))
    expect(result.current).toBe("initial")
  })

  it("debounces value changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "initial" } }
    )

    expect(result.current).toBe("initial")

    rerender({ value: "updated" })
    expect(result.current).toBe("initial") // Still old value

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe("updated") // Now updated
  })

  it("cancels pending updates on unmount", () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "initial" } }
    )

    rerender({ value: "updated" })
    unmount()

    act(() => {
      jest.advanceTimersByTime(500)
    })

    // No error should occur
  })
})
```

---

## Utility Function Testing

### Pure Function Tests

```tsx
import { formatCode, validateCode } from "../utils/codeUtils"

describe("formatCode", () => {
  it("formats JavaScript code", () => {
    const input = "const x=1;const y=2"
    const expected = "const x = 1;\nconst y = 2;"

    expect(formatCode(input, "javascript")).toBe(expected)
  })

  it("preserves already formatted code", () => {
    const input = "const x = 1;\nconst y = 2;"
    expect(formatCode(input, "javascript")).toBe(input)
  })

  it("handles empty input", () => {
    expect(formatCode("", "javascript")).toBe("")
  })

  it("handles null/undefined gracefully", () => {
    expect(formatCode(null as unknown as string, "javascript")).toBe("")
    expect(formatCode(undefined as unknown as string, "javascript")).toBe("")
  })
})

describe("validateCode", () => {
  it("returns valid for correct syntax", () => {
    const result = validateCode("const x = 1;", "javascript")
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it("returns errors for invalid syntax", () => {
    const result = validateCode("const = 1;", "javascript")
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it("includes line numbers in errors", () => {
    const result = validateCode("line1\nconst = invalid\nline3", "javascript")
    expect(result.errors[0]).toMatchObject({
      line: 2,
      message: expect.any(String),
    })
  })
})
```

### Testing Type Guards

```tsx
import { isValidResponse, isUser, isError } from "../utils/typeGuards"

describe("Type Guards", () => {
  describe("isValidResponse", () => {
    it("returns true for valid response", () => {
      const response = { status: "success", data: { id: 1 } }
      expect(isValidResponse(response)).toBe(true)
    })

    it("returns false for invalid response", () => {
      expect(isValidResponse(null)).toBe(false)
      expect(isValidResponse(undefined)).toBe(false)
      expect(isValidResponse({ status: "success" })).toBe(false) // missing data
      expect(isValidResponse({ data: {} })).toBe(false) // missing status
    })
  })

  describe("isUser", () => {
    it("validates user objects", () => {
      expect(isUser({ id: "1", name: "John", email: "john@example.com" })).toBe(true)
      expect(isUser({ id: "1", name: "John" })).toBe(false) // missing email
      expect(isUser({ id: 1, name: "John", email: "john@example.com" })).toBe(false) // wrong id type
    })
  })

  describe("isError", () => {
    it("identifies Error instances", () => {
      expect(isError(new Error("test"))).toBe(true)
      expect(isError(new TypeError("test"))).toBe(true)
      expect(isError({ message: "test" })).toBe(false) // not Error instance
      expect(isError("error string")).toBe(false)
    })
  })
})
```

---

## Mocking Patterns

### Module Mocking

```tsx
// Mock an entire module
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => "generated code" },
      }),
    }),
  })),
}))

// Mock a single export
jest.mock("@/lib/utils", () => ({
  ...jest.requireActual("@/lib/utils"),
  cn: jest.fn((...args) => args.filter(Boolean).join(" ")),
}))
```

### Partial Mocking

```tsx
// Only mock specific functions
jest.mock("../utils/api", () => {
  const actual = jest.requireActual("../utils/api")
  return {
    ...actual,
    generateCode: jest.fn(), // Mock this one
    // validateCode uses real implementation
  }
})
```

### Mock Implementations

```tsx
// Different responses for different calls
const mockGenerate = jest.fn()
  .mockResolvedValueOnce("first call")
  .mockResolvedValueOnce("second call")
  .mockRejectedValueOnce(new Error("third call fails"))

// Conditional mock
const mockFetch = jest.fn().mockImplementation((url: string) => {
  if (url.includes("/users")) {
    return Promise.resolve({ data: [{ id: 1, name: "User" }] })
  }
  if (url.includes("/posts")) {
    return Promise.resolve({ data: [{ id: 1, title: "Post" }] })
  }
  return Promise.reject(new Error("Unknown endpoint"))
})
```

### Mocking Browser APIs

```tsx
// localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, "localStorage", { value: localStorageMock })

// matchMedia
Object.defineProperty(window, "matchMedia", {
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
```

---

## Test Organization

### Describe Blocks

```tsx
describe("ComponentName", () => {
  // Group by feature/behavior
  describe("rendering", () => {
    it("renders with default props", () => {})
    it("renders with custom className", () => {})
  })

  describe("user interactions", () => {
    it("handles click events", () => {})
    it("handles keyboard events", () => {})
  })

  describe("state management", () => {
    it("updates state on input change", () => {})
    it("resets state on clear button click", () => {})
  })

  describe("error handling", () => {
    it("displays error message on failure", () => {})
    it("allows retry after error", () => {})
  })
})
```

### Setup and Teardown

```tsx
describe("Feature", () => {
  // Runs once before all tests
  beforeAll(() => {
    // Global setup
  })

  // Runs once after all tests
  afterAll(() => {
    // Global cleanup
  })

  // Runs before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Runs after each test
  afterEach(() => {
    // Per-test cleanup
  })
})
```

---

## Best Practices Checklist

### General
- [ ] Test behavior, not implementation details
- [ ] Use descriptive test names that explain the expected behavior
- [ ] Follow AAA pattern: Arrange, Act, Assert
- [ ] One assertion per test when possible
- [ ] Avoid testing third-party libraries

### Component Testing
- [ ] Query by role, label, or text (accessibility-first)
- [ ] Use `userEvent` over `fireEvent`
- [ ] Test loading, error, and success states
- [ ] Test accessibility (keyboard navigation, ARIA)

### Hook Testing
- [ ] Test initial state
- [ ] Test state transitions
- [ ] Test cleanup on unmount
- [ ] Test with different initial props

### Mocking
- [ ] Mock at the boundary (API calls, not internal functions)
- [ ] Clear mocks between tests
- [ ] Use realistic mock data
- [ ] Avoid over-mocking

---

## Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Run specific file
npm run test -- ComponentName.test.tsx

# Run with coverage
npm run test -- --coverage

# Run tests matching pattern
npm run test -- --testPathPattern="hooks"
```
