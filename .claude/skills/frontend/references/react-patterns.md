# React Patterns & Design Patterns

## Overview

This guide covers essential React patterns and general design patterns applicable to the Figment codebase using React 19, TypeScript, and functional components.

---

## Component Patterns

### 1. Compound Components

Use when building related components that share implicit state.

```tsx
// Usage
<Tabs defaultValue="code">
  <TabsList>
    <TabsTrigger value="code">Code</TabsTrigger>
    <TabsTrigger value="preview">Preview</TabsTrigger>
  </TabsList>
  <TabsContent value="code">
    <CodeEditor />
  </TabsContent>
  <TabsContent value="preview">
    <Preview />
  </TabsContent>
</Tabs>

// Implementation
interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function Tabs({ defaultValue, children }: TabsProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div data-slot="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

function TabsTrigger({ value, children }: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within Tabs")

  const isActive = context.value === value

  return (
    <button
      data-state={isActive ? "active" : "inactive"}
      onClick={() => context.onValueChange(value)}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, children }: TabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be used within Tabs")

  if (context.value !== value) return null
  return <div>{children}</div>
}
```

### 2. Render Props

Use for sharing behavior while letting consumers control rendering.

```tsx
// Usage
<MouseTracker>
  {({ x, y }) => (
    <div>Mouse position: {x}, {y}</div>
  )}
</MouseTracker>

// Implementation
interface MouseTrackerProps {
  children: (position: { x: number; y: number }) => React.ReactNode
}

function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [])

  return <>{children(position)}</>
}
```

### 3. Higher-Order Components (HOC)

Use sparingly for cross-cutting concerns. Prefer hooks when possible.

```tsx
// Usage
const EnhancedComponent = withLoading(MyComponent)

// Implementation
interface WithLoadingProps {
  isLoading?: boolean
}

function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithLoadingComponent(props: P & WithLoadingProps) {
    const { isLoading, ...rest } = props

    if (isLoading) {
      return <div className="animate-pulse">Loading...</div>
    }

    return <WrappedComponent {...(rest as P)} />
  }
}
```

### 4. Container/Presentational Pattern

Separate logic from presentation.

```tsx
// Presentational: Pure UI, receives data via props
interface CodeDisplayProps {
  code: string
  language: string
  onCopy: () => void
}

function CodeDisplay({ code, language, onCopy }: CodeDisplayProps) {
  return (
    <div className="relative">
      <pre data-language={language}>
        <code>{code}</code>
      </pre>
      <Button onClick={onCopy} className="absolute top-2 right-2">
        Copy
      </Button>
    </div>
  )
}

// Container: Handles logic, passes data to presentational
function CodeDisplayContainer({ fileId }: { fileId: string }) {
  const { code, language } = useFile(fileId)
  const { copy } = useClipboard()

  const handleCopy = useCallback(() => {
    copy(code)
  }, [copy, code])

  return (
    <CodeDisplay
      code={code}
      language={language}
      onCopy={handleCopy}
    />
  )
}
```

### 5. Controlled vs Uncontrolled Components

```tsx
// Controlled: Parent manages state
interface ControlledInputProps {
  value: string
  onChange: (value: string) => void
}

function ControlledInput({ value, onChange }: ControlledInputProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

// Uncontrolled: Component manages own state, exposes via ref
interface UncontrolledInputProps {
  defaultValue?: string
}

function UncontrolledInput({ defaultValue }: UncontrolledInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return <input ref={inputRef} defaultValue={defaultValue} />
}

// Hybrid: Supports both patterns
interface HybridInputProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

function HybridInput({ value, defaultValue, onChange }: HybridInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "")
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value)
    }
    onChange?.(e.target.value)
  }

  return <input value={currentValue} onChange={handleChange} />
}
```

---

## Hook Patterns

### 1. Custom Hook with Options

```tsx
interface UseAsyncOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseAsyncReturn<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  execute: () => Promise<void>
  reset: () => void
}

function useAsync<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T> {
  const { immediate = false, onSuccess, onError } = options

  const [state, setState] = useState<{
    data: T | null
    isLoading: boolean
    error: Error | null
  }>({
    data: null,
    isLoading: immediate,
    error: null,
  })

  const execute = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }))
    try {
      const data = await asyncFn()
      setState({ data, isLoading: false, error: null })
      onSuccess?.(data)
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e))
      setState((s) => ({ ...s, isLoading: false, error }))
      onError?.(error)
    }
  }, [asyncFn, onSuccess, onError])

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null })
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  return { ...state, execute, reset }
}
```

### 2. Reducer Hook Pattern

```tsx
type EditorAction =
  | { type: "SET_CODE"; payload: string }
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "FORMAT" }
  | { type: "RESET" }

interface EditorState {
  code: string
  language: string
  history: string[]
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_CODE":
      return {
        ...state,
        code: action.payload,
        history: [...state.history, state.code],
      }
    case "SET_LANGUAGE":
      return { ...state, language: action.payload }
    case "FORMAT":
      return { ...state, code: formatCode(state.code, state.language) }
    case "RESET":
      return { code: "", language: "javascript", history: [] }
    default:
      return state
  }
}

function useEditorReducer(initialCode = "") {
  const [state, dispatch] = useReducer(editorReducer, {
    code: initialCode,
    language: "javascript",
    history: [],
  })

  const actions = useMemo(
    () => ({
      setCode: (code: string) => dispatch({ type: "SET_CODE", payload: code }),
      setLanguage: (lang: string) =>
        dispatch({ type: "SET_LANGUAGE", payload: lang }),
      format: () => dispatch({ type: "FORMAT" }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    []
  )

  return { state, actions }
}
```

### 3. Composition of Hooks

```tsx
// Base hooks
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Composed hook
function usePersistedEditor() {
  const [code, setCode] = useLocalStorage("editor-code", "")
  const debouncedCode = useDebounce(code, 500)

  // Auto-save happens via useLocalStorage when debouncedCode changes
  useEffect(() => {
    setCode(debouncedCode)
  }, [debouncedCode, setCode])

  return { code, setCode, savedCode: debouncedCode }
}
```

### 4. Factory Hook Pattern

```tsx
// Hook factory for creating typed API hooks
function createResourceHook<T>(resourcePath: string) {
  return function useResource(id?: string) {
    const [data, setData] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const fetch = useCallback(async (resourceId: string) => {
      setIsLoading(true)
      try {
        const response = await api.get<T>(`${resourcePath}/${resourceId}`)
        setData(response)
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)))
      } finally {
        setIsLoading(false)
      }
    }, [])

    useEffect(() => {
      if (id) fetch(id)
    }, [id, fetch])

    return { data, isLoading, error, refetch: fetch }
  }
}

// Create typed hooks
const useProject = createResourceHook<Project>("/projects")
const useFile = createResourceHook<File>("/files")

// Usage
function ProjectView({ projectId }: { projectId: string }) {
  const { data: project, isLoading } = useProject(projectId)
  // ...
}
```

---

## State Management Patterns

### 1. Context with Reducer

```tsx
interface AppState {
  theme: "light" | "dark"
  user: User | null
}

type AppAction =
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "SET_USER"; payload: User | null }

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload }
    case "SET_USER":
      return { ...state, user: action.payload }
    default:
      return state
  }
}

function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    theme: "light",
    user: null,
  })

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}
```

### 2. Optimistic Updates

```tsx
function useOptimisticUpdate<T>(
  currentValue: T,
  updateFn: (newValue: T) => Promise<void>
) {
  const [optimisticValue, setOptimisticValue] = useState(currentValue)
  const [isUpdating, setIsUpdating] = useState(false)

  const update = useCallback(
    async (newValue: T) => {
      const previousValue = optimisticValue
      setOptimisticValue(newValue) // Optimistic update
      setIsUpdating(true)

      try {
        await updateFn(newValue)
      } catch (error) {
        setOptimisticValue(previousValue) // Rollback on error
        throw error
      } finally {
        setIsUpdating(false)
      }
    },
    [optimisticValue, updateFn]
  )

  return { value: optimisticValue, update, isUpdating }
}

// Usage
function LikeButton({ postId, initialLikes }: Props) {
  const { value: likes, update, isUpdating } = useOptimisticUpdate(
    initialLikes,
    (newLikes) => api.updateLikes(postId, newLikes)
  )

  return (
    <Button onClick={() => update(likes + 1)} disabled={isUpdating}>
      {likes} Likes
    </Button>
  )
}
```

---

## Error Handling Patterns

### 1. Error Boundary

```tsx
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback: React.ReactNode | ((error: Error) => React.ReactNode)
}

interface ErrorBoundaryState {
  error: Error | null
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, info)
  }

  render() {
    if (this.state.error) {
      const { fallback } = this.props
      return typeof fallback === "function"
        ? fallback(this.state.error)
        : fallback
    }
    return this.props.children
  }
}

// Usage
<ErrorBoundary fallback={(error) => <ErrorDisplay message={error.message} />}>
  <RiskyComponent />
</ErrorBoundary>
```

### 2. Result Type Pattern

```tsx
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

// Usage in utils
async function safeGenerate(prompt: string): Promise<Result<string>> {
  try {
    const code = await generateCode(prompt)
    return ok(code)
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)))
  }
}

// Usage in component
function Generator() {
  const [result, setResult] = useState<Result<string> | null>(null)

  const handleGenerate = async (prompt: string) => {
    const result = await safeGenerate(prompt)
    setResult(result)
  }

  if (result?.ok === false) {
    return <ErrorDisplay error={result.error} />
  }

  return <CodeDisplay code={result?.value ?? ""} />
}
```

---

## Performance Patterns

### 1. Memoization

```tsx
// Memoize expensive computations
function CodeAnalyzer({ code }: { code: string }) {
  const analysis = useMemo(() => {
    return analyzeCode(code) // Expensive operation
  }, [code])

  return <AnalysisDisplay data={analysis} />
}

// Memoize callbacks
function Editor({ onSave }: { onSave: (code: string) => void }) {
  const [code, setCode] = useState("")

  const handleSave = useCallback(() => {
    onSave(code)
  }, [code, onSave])

  return (
    <>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} />
      <Button onClick={handleSave}>Save</Button>
    </>
  )
}

// Memoize components
const ExpensiveList = memo(function ExpensiveList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map((item) => (
        <ExpensiveItem key={item.id} item={item} />
      ))}
    </ul>
  )
})
```

### 2. Virtualization (for long lists)

```tsx
// Pattern: Only render visible items
function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )

  const visibleItems = items.slice(startIndex, endIndex)
  const offsetY = startIndex * itemHeight

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) =>
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## Summary

| Pattern | Use When |
|---------|----------|
| Compound Components | Building related components with shared state |
| Render Props | Sharing behavior with flexible rendering |
| Container/Presentational | Separating logic from UI |
| Custom Hooks | Reusing stateful logic |
| Reducer | Complex state with multiple actions |
| Context | Avoiding prop drilling |
| Error Boundary | Graceful error handling |
| Memoization | Optimizing expensive operations |
