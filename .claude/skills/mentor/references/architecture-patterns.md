# Architecture Patterns for Frontend Development

## Mental Models

### 1. The Dependency Rule

```
UI Layer → Application Layer → Domain Layer
   ↓              ↓                 ↓
Components     Hooks/Logic      Types/Utils

Dependencies point INWARD (toward domain)
Never let inner layers know about outer layers
```

**Why?** Inner layers are stable; outer layers change frequently. If your types depend on your UI, changing a button breaks your data model.

### 2. The Single Source of Truth

Every piece of data should have ONE authoritative source.

```
❌ Bad: Same data in multiple places
state A ←→ state B ←→ props C
         (sync nightmare)

✅ Good: Single source, derived everywhere else
source → derived A
       → derived B
       → derived C
```

### 3. Colocation Principle

Keep things close to where they're used.

```
❌ Scattered                    ✅ Colocated
/components                     /features/auth
  /Button.tsx                     /components/LoginForm.tsx
  /LoginForm.tsx                  /hooks/useAuth.ts
/hooks                            /utils/validateCredentials.ts
  /useAuth.ts                     /__tests__/useAuth.test.ts
/utils
  /validateCredentials.ts
```

**Why?** Deletion test - if you delete a feature folder, everything related should go with it.

---

## Component Architecture

### Level 1: UI Components (Dumb)

```tsx
// Only knows how to render, not what to render
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: "primary" | "secondary"
}

function Button({ children, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button onClick={onClick} className={variants[variant]}>
      {children}
    </button>
  )
}
```

**Characteristics:**
- No internal state (or minimal UI state only)
- All data via props
- No side effects
- Highly reusable

### Level 2: Container Components (Smart)

```tsx
// Knows what data to fetch and how to handle interactions
function UserProfile({ userId }: { userId: string }) {
  const { user, isLoading, error } = useUser(userId)
  const { updateUser } = useUpdateUser()

  if (isLoading) return <Skeleton />
  if (error) return <Error message={error.message} />

  return (
    <ProfileCard
      user={user}
      onUpdate={updateUser}
    />
  )
}
```

**Characteristics:**
- Manages data fetching
- Handles loading/error states
- Coordinates child components
- Feature-specific

### Level 3: Page Components (Orchestration)

```tsx
// Composes features, handles routing concerns
function DashboardPage() {
  return (
    <PageLayout>
      <Header />
      <main>
        <UserProfile userId={currentUserId} />
        <ActivityFeed />
        <Sidebar />
      </main>
    </PageLayout>
  )
}
```

**Characteristics:**
- Minimal logic
- Layout composition
- Route-specific concerns

---

## State Architecture

### Decision Tree: Where Does State Live?

```
Is it server data (from API)?
├── Yes → React Query / SWR (server state)
└── No → Is it shared across routes?
         ├── Yes → Context / Zustand (global state)
         └── No → Is it shared across components?
                  ├── Yes → Lift to common parent
                  └── No → useState (local state)
```

### Server State (React Query Pattern)

```tsx
// Separate server state from UI state
function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Component uses the hook
function ProductList() {
  const { data: products, isLoading, error } = useProducts()
  // ...render logic
}
```

### UI State (Local)

```tsx
// UI-only state stays local
function Accordion({ items }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div>
      {items.map(item => (
        <AccordionItem
          key={item.id}
          item={item}
          isExpanded={expandedId === item.id}
          onToggle={() => setExpandedId(
            expandedId === item.id ? null : item.id
          )}
        />
      ))}
    </div>
  )
}
```

### Derived State (Compute, Don't Store)

```tsx
// ❌ Bad: Storing derived state
const [items, setItems] = useState([...])
const [filteredItems, setFilteredItems] = useState([...])
const [count, setCount] = useState(0)

useEffect(() => {
  setFilteredItems(items.filter(...))
  setCount(filteredItems.length)
}, [items])

// ✅ Good: Computing during render
const [items, setItems] = useState([...])
const filteredItems = useMemo(() => items.filter(...), [items])
const count = filteredItems.length
```

---

## Data Flow Patterns

### Unidirectional Flow

```
┌─────────────────────────────────────────┐
│                                         │
│  Action → Reducer → State → UI → Action │
│                                         │
└─────────────────────────────────────────┘

Example:
1. User clicks "Add to Cart" (Action)
2. Reducer adds item to cart state (State Update)
3. UI re-renders with new cart (UI Update)
4. User sees updated cart count
```

### Props Drilling vs Context

```tsx
// Props drilling: Explicit, but verbose
<App>
  <Header user={user} />
  <Main>
    <Sidebar user={user} />
    <Content>
      <UserWidget user={user} />  // 4 levels deep!
    </Content>
  </Main>
</App>

// Context: Implicit, but cleaner for truly global state
<UserProvider value={user}>
  <App>
    <Header />  {/* useUser() */}
    <Main>
      <Sidebar />  {/* useUser() */}
      <Content>
        <UserWidget />  {/* useUser() */}
      </Content>
    </Main>
  </App>
</UserProvider>
```

**Rule of Thumb:** Use context for truly global, rarely-changing data (theme, auth, locale). Use props for feature-specific data.

---

## API Integration Patterns

### Repository Pattern

```tsx
// Abstract API calls behind a clean interface
// lib/api/products.ts
export const productsApi = {
  getAll: () => fetch('/api/products').then(r => r.json()),
  getById: (id: string) => fetch(`/api/products/${id}`).then(r => r.json()),
  create: (data: ProductInput) => fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(r => r.json()),
}

// Hook uses the repository
function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll
  })
}
```

### Error Boundary Pattern

```tsx
// Graceful error handling at feature boundaries
function FeatureErrorBoundary({ children, fallback }) {
  return (
    <ErrorBoundary
      fallback={fallback}
      onError={(error) => logToService(error)}
    >
      {children}
    </ErrorBoundary>
  )
}

// Usage
<FeatureErrorBoundary fallback={<FeatureError />}>
  <ComplexFeature />
</FeatureErrorBoundary>
```

---

## Testing Architecture

### Testing Pyramid

```
        /\
       /  \
      / E2E \       Few, slow, expensive
     /------\
    /  Integ  \     Some, medium
   /----------\
  /    Unit    \    Many, fast, cheap
 /--------------\
```

### Test by Behavior, Not Implementation

```tsx
// ❌ Testing implementation
test('calls setState with new value', () => {
  const setState = jest.fn()
  // ...tests internal state changes
})

// ✅ Testing behavior
test('displays error when submission fails', async () => {
  server.use(
    rest.post('/api/submit', (req, res, ctx) =>
      res(ctx.status(500))
    )
  )

  render(<Form />)
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(screen.getByRole('alert')).toHaveTextContent(/error/i)
})
```

---

## Questions to Ask Yourself

When designing architecture:

1. **Deletion Test**: If I delete this feature, what else breaks?
2. **New Developer Test**: Could a new dev understand this in 10 minutes?
3. **Change Test**: If requirements change, how many files need editing?
4. **Test Test**: Is this easy to test in isolation?
5. **Scale Test**: What happens when this feature grows 10x?
