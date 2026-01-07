# Code Reviewer Skill

Reviews code for architecture compliance, quality, and best practices.

## When to Use

Use `/code-reviewer` when:
- Completing a feature or component
- After writing significant code
- Before committing changes
- When refactoring existing code
- To validate hook/component structure

## Review Checklist

### 1. Architecture Compliance

```
[ ] Components in correct layer (features/*/components/)
[ ] Hooks in correct layer (features/*/hooks/)
[ ] Utils are pure functions (features/*/utils/)
[ ] No business logic in components
[ ] No UI logic in hooks
[ ] Proper import order followed
```

### 2. TypeScript Quality

```
[ ] No `any` types
[ ] Interfaces properly named (ComponentProps, UseHookReturn)
[ ] Return types defined for functions
[ ] Type guards used for unknown data
[ ] Proper use of `interface` vs `type`
```

### 3. Component Standards

```
[ ] Uses shadcn/ui pattern with cva
[ ] Props extend React.ComponentProps
[ ] Uses data-slot attribute
[ ] Uses cn() for className merging
[ ] No inline styles
[ ] Tailwind classes only
```

### 4. Hook Standards

```
[ ] Options interface defined
[ ] Return interface defined
[ ] useCallback for functions
[ ] useMemo for expensive computations
[ ] Proper dependency arrays
[ ] Error handling included
```

### 5. SOLID Principles

```
[ ] Single Responsibility - one purpose per component/hook
[ ] Open/Closed - extensible via props/composition
[ ] Liskov Substitution - honors parent interfaces
[ ] Interface Segregation - focused props
[ ] Dependency Inversion - props injection, not hardcoded
```

### 6. Common Issues to Flag

| Issue | Problem | Fix |
|-------|---------|-----|
| Logic in component | Violates SRP | Extract to hook |
| Giant component | Hard to maintain | Split into smaller |
| `any` type | No type safety | Define interface |
| Inline styles | Inconsistent | Use Tailwind |
| Missing error handling | Silent failures | Add try/catch |
| Stale closure | Bug-prone | Check useCallback deps |
| Object in useEffect deps | Infinite loop | Use primitive or useMemo |

## Review Output Format

```markdown
## Code Review: [Component/Hook Name]

### Summary
[1-2 sentence overview]

### Architecture
- [ ] Correct layer placement
- [ ] Import rules followed
[Notes]

### TypeScript
- [ ] No `any` types
- [ ] Proper interfaces
[Notes]

### Patterns
- [ ] shadcn/ui pattern (components)
- [ ] Hook pattern (hooks)
[Notes]

### SOLID Compliance
- [ ] SRP
- [ ] OCP
- [ ] LSP
- [ ] ISP
- [ ] DIP
[Notes]

### Issues Found
1. [Issue] - [Location] - [Suggested fix]
2. ...

### Recommendations
-
```

## Example Review

```markdown
## Code Review: CodeEditor

### Summary
Component properly separates UI from logic but has a few TypeScript issues.

### Architecture
- [x] Correct layer: features/editor/components/
- [x] Uses useEditor hook for logic
- [ ] Import order incorrect (types not last)

### TypeScript
- [ ] Line 15: Uses `any` for onChange handler
- [x] Props interface properly extends ComponentProps

### Patterns
- [x] Uses cva for variants
- [x] Uses cn() for className
- [ ] Missing data-slot attribute

### SOLID Compliance
- [x] SRP - Single purpose (code display)
- [x] OCP - Extensible via className prop
- [x] ISP - Focused props interface

### Issues Found
1. `any` type on line 15 - Define proper event type
2. Missing data-slot - Add `data-slot="code-editor"`
3. Import order - Move type imports to end

### Recommendations
- Consider adding error boundary for syntax errors
- Add aria-label for accessibility
```
