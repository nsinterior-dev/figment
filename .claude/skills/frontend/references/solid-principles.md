# SOLID Principles for React

## Overview

SOLID principles, originally defined for object-oriented programming, translate effectively to React functional components and hooks. This guide shows how to apply each principle in the Figment codebase.

---

## S - Single Responsibility Principle (SRP)

> A component/hook should have one reason to change.

### Components: One Visual Responsibility

```tsx
// BAD: Multiple responsibilities
function UserDashboard() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => { /* fetch user */ }, [])
  useEffect(() => { /* fetch posts */ }, [])
  useEffect(() => { /* fetch notifications */ }, [])

  return (
    <div>
      <header>{/* user info */}</header>
      <main>{/* posts list */}</main>
      <aside>{/* notifications */}</aside>
    </div>
  )
}

// GOOD: Single responsibility per component
function UserDashboard() {
  return (
    <div>
      <UserHeader />
      <PostList />
      <NotificationPanel />
    </div>
  )
}

function UserHeader() {
  const { user } = useUser()
  return <header>{user.name}</header>
}

function PostList() {
  const { posts } = usePosts()
  return <main>{posts.map(p => <Post key={p.id} post={p} />)}</main>
}
```

### Hooks: One Logical Responsibility

```tsx
// BAD: Multiple concerns in one hook
function useUserData() {
  const [user, setUser] = useState(null)
  const [preferences, setPreferences] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // Fetches user AND preferences AND handles errors
  // Too many responsibilities!
}

// GOOD: Separate hooks for separate concerns
function useUser() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  // Only handles user data
  return { user, isLoading }
}

function usePreferences() {
  const [preferences, setPreferences] = useState({})
  // Only handles preferences
  return { preferences, updatePreferences }
}

// Compose when needed
function useUserWithPreferences() {
  const user = useUser()
  const prefs = usePreferences()
  return { ...user, ...prefs }
}
```

### Utils: One Transformation

```tsx
// BAD: Multiple transformations
function processUserData(user: RawUser): ProcessedUser {
  const normalized = normalizeFields(user)
  const validated = validateFields(normalized)
  const enriched = addComputedFields(validated)
  return enriched
}

// GOOD: Single-purpose functions that compose
function normalizeUser(user: RawUser): NormalizedUser { ... }
function validateUser(user: NormalizedUser): ValidatedUser { ... }
function enrichUser(user: ValidatedUser): EnrichedUser { ... }

// Compose in a pipeline
const processUser = pipe(normalizeUser, validateUser, enrichUser)
```

---

## O - Open/Closed Principle (OCP)

> Components should be open for extension but closed for modification.

### Component Composition

```tsx
// BAD: Modifying component for each new case
function Button({ variant }: { variant: "primary" | "secondary" | "danger" }) {
  if (variant === "primary") return <button className="bg-blue-500">...</button>
  if (variant === "secondary") return <button className="bg-gray-500">...</button>
  if (variant === "danger") return <button className="bg-red-500">...</button>
}

// GOOD: Use variants with cva (shadcn pattern)
const buttonVariants = cva("base-button-classes", {
  variants: {
    variant: {
      primary: "bg-blue-500",
      secondary: "bg-gray-500",
      danger: "bg-red-500",
      // Easy to add new variants without modifying core logic
    }
  }
})

function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props} />
  )
}
```

### Render Props / Children

```tsx
// GOOD: Open for extension via children
function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      {children}
    </div>
  )
}

// Extend without modifying Card
function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
```

### Hook Composition

```tsx
// GOOD: Base hook that can be extended
function useAsync<T>(asyncFn: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null
  })

  const execute = useCallback(async () => {
    setState(s => ({ ...s, isLoading: true }))
    try {
      const data = await asyncFn()
      setState({ data, isLoading: false, error: null })
    } catch (error) {
      setState(s => ({ ...s, isLoading: false, error }))
    }
  }, [asyncFn])

  return { ...state, execute }
}

// Extend for specific use cases
function useGeneration(prompt: string) {
  const { data, isLoading, error, execute } = useAsync(
    () => generateCode(prompt)
  )

  // Add generation-specific logic
  const retry = useCallback(() => execute(), [execute])

  return { code: data, isGenerating: isLoading, error, generate: execute, retry }
}
```

---

## L - Liskov Substitution Principle (LSP)

> Derived components should be substitutable for their base components.

### Props Extension

```tsx
// Base component interface
interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "outline"
}

// GOOD: Extended component maintains base behavior
interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode
}

function IconButton({ icon, children, ...props }: IconButtonProps) {
  return (
    <Button {...props}>
      {icon}
      {children}
    </Button>
  )
}

// Can be used anywhere Button is expected
<IconButton onClick={handleClick} variant="outline" icon={<SaveIcon />}>
  Save
</IconButton>
```

### Component Substitution

```tsx
// Base list item
interface ListItemProps {
  children: React.ReactNode
  onClick?: () => void
}

function ListItem({ children, onClick }: ListItemProps) {
  return <li onClick={onClick}>{children}</li>
}

// Extended list item - must honor ListItemProps contract
interface FeatureListItemProps extends ListItemProps {
  icon?: React.ReactNode
  badge?: string
}

function FeatureListItem({ children, onClick, icon, badge }: FeatureListItemProps) {
  return (
    <ListItem onClick={onClick}>
      {icon}
      {children}
      {badge && <Badge>{badge}</Badge>}
    </ListItem>
  )
}

// Both work in List component
function List({ items, renderItem }: ListProps) {
  return <ul>{items.map(renderItem)}</ul>
}
```

---

## I - Interface Segregation Principle (ISP)

> Clients should not depend on interfaces they don't use.

### Focused Props

```tsx
// BAD: Large interface with unused props
interface UserCardProps {
  user: User
  showAvatar: boolean
  showBio: boolean
  showStats: boolean
  showFollowButton: boolean
  onFollow: () => void
  onMessage: () => void
  onBlock: () => void
}

// GOOD: Segregated interfaces
interface UserAvatarProps {
  user: Pick<User, "name" | "avatar">
}

interface UserBioProps {
  user: Pick<User, "bio" | "location">
}

interface UserActionsProps {
  userId: string
  onFollow?: () => void
  onMessage?: () => void
}

// Compose smaller components
function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <UserAvatar user={user} />
      <UserBio user={user} />
      <UserActions userId={user.id} />
    </Card>
  )
}
```

### Hook Return Types

```tsx
// BAD: Hook returns everything
function useEditor(): {
  code: string
  setCode: (code: string) => void
  language: string
  setLanguage: (lang: string) => void
  theme: string
  setTheme: (theme: string) => void
  format: () => void
  validate: () => ValidationResult
  save: () => Promise<void>
  load: (id: string) => Promise<void>
  // ... many more
}

// GOOD: Segregated hooks
function useEditorCode() {
  return { code, setCode }
}

function useEditorSettings() {
  return { language, setLanguage, theme, setTheme }
}

function useEditorActions() {
  return { format, validate }
}

function useEditorPersistence() {
  return { save, load }
}

// Use only what you need
function CodePane() {
  const { code, setCode } = useEditorCode()
  // Don't need settings or persistence here
}
```

---

## D - Dependency Inversion Principle (DIP)

> Depend on abstractions, not concretions.

### Props as Dependencies

```tsx
// BAD: Component depends on concrete implementation
function CodePreview() {
  const code = useEditorStore.getState().code // Direct store dependency
  return <pre>{code}</pre>
}

// GOOD: Depend on abstraction (props)
interface CodePreviewProps {
  code: string
  language?: string
}

function CodePreview({ code, language = "javascript" }: CodePreviewProps) {
  return <pre data-language={language}>{code}</pre>
}

// Inject dependency at composition
function EditorWithPreview() {
  const { code, language } = useEditor()
  return (
    <>
      <CodeEditor />
      <CodePreview code={code} language={language} />
    </>
  )
}
```

### Service Injection

```tsx
// Define abstract interface
interface GenerationService {
  generate(prompt: string): Promise<string>
}

// Hook depends on abstraction
function useGeneration(service: GenerationService) {
  const [result, setResult] = useState<string>("")

  const generate = useCallback(async (prompt: string) => {
    const code = await service.generate(prompt)
    setResult(code)
  }, [service])

  return { result, generate }
}

// Concrete implementations
const googleAIService: GenerationService = {
  generate: async (prompt) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    return result.response.text()
  }
}

// Use with concrete service
function GenerationPanel() {
  const { result, generate } = useGeneration(googleAIService)
  // ...
}
```

### Context as Dependency Injection

```tsx
// Create abstract context
interface EditorContextValue {
  code: string
  setCode: (code: string) => void
  format: () => void
}

const EditorContext = createContext<EditorContextValue | null>(null)

// Provider injects concrete implementation
function EditorProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState("")

  const format = useCallback(() => {
    setCode(formatCode(code))
  }, [code])

  return (
    <EditorContext.Provider value={{ code, setCode, format }}>
      {children}
    </EditorContext.Provider>
  )
}

// Components depend on abstract context
function useEditorContext() {
  const context = useContext(EditorContext)
  if (!context) throw new Error("Must be used within EditorProvider")
  return context
}

function FormatButton() {
  const { format } = useEditorContext() // Depends on abstraction
  return <Button onClick={format}>Format</Button>
}
```

---

## Summary: SOLID in React

| Principle | React Application |
|-----------|-------------------|
| **SRP** | One component = one visual concern; one hook = one logical concern |
| **OCP** | Use composition, variants (cva), and children for extension |
| **LSP** | Extended components must honor base props contract |
| **ISP** | Small, focused props interfaces; segregated hooks |
| **DIP** | Props injection, context for DI, abstract interfaces |

## Practical Checklist

When creating components/hooks:

- [ ] Does this have a single, clear responsibility?
- [ ] Can it be extended without modification?
- [ ] Does it honor its parent's interface contract?
- [ ] Are the props focused and minimal?
- [ ] Are dependencies injected rather than hardcoded?
