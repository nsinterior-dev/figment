# Code Review Guide

A guide for both giving and receiving code reviews effectively.

---

## Philosophy

### Code Review is About

- **Learning** - Both reviewer and author learn
- **Quality** - Catching bugs before production
- **Consistency** - Maintaining codebase standards
- **Knowledge Sharing** - Spreading context across team

### Code Review is NOT About

- Proving you're smarter
- Nitpicking style preferences
- Blocking progress
- Finding blame

---

## The Reviewer's Mindset

### Before Reviewing

1. **Understand the context** - Read the PR description, linked issues
2. **Check your biases** - Different doesn't mean wrong
3. **Time box** - Don't spend hours on a single review

### During Review

Ask yourself these questions:

| Category | Questions |
|----------|-----------|
| **Correctness** | Does this code do what it's supposed to? |
| **Design** | Is this the right approach? Are there simpler alternatives? |
| **Readability** | Can I understand this without the author explaining? |
| **Maintainability** | Will this be easy to change later? |
| **Performance** | Are there obvious performance issues? |
| **Security** | Are there security vulnerabilities? |
| **Testing** | Is this tested? Are the right things tested? |

### The Review Hierarchy

Focus your attention in this order:

```
1. Architecture/Design    (Most important)
2. Correctness/Bugs
3. Performance
4. Security
5. Readability
6. Style/Formatting        (Least important - automate this)
```

---

## How to Give Feedback

### Be Specific

```
❌ "This is confusing"
✅ "The variable name 'x' doesn't convey its purpose.
    Consider 'selectedUserId' to make the intent clear."
```

### Explain Why

```
❌ "Don't use any"
✅ "Using 'any' here bypasses TypeScript's safety checks.
    Consider using a union type like 'string | number'
    to maintain type safety while allowing flexibility."
```

### Suggest, Don't Demand

```
❌ "Change this to use useMemo"
✅ "Consider using useMemo here - the calculation runs on every
    render and the dependency (items) changes infrequently.
    What do you think?"
```

### Distinguish Blockers from Suggestions

Use clear prefixes:

| Prefix | Meaning | Example |
|--------|---------|---------|
| **Blocker:** | Must fix before merge | "Blocker: This will cause a memory leak" |
| **Suggestion:** | Nice to have | "Suggestion: Could simplify with optional chaining" |
| **Question:** | Seeking understanding | "Question: Why async here instead of sync?" |
| **Nit:** | Very minor, take it or leave it | "Nit: Extra blank line" |

### Praise Good Code

```
✅ "Nice use of discriminated unions here - makes the type checking
    much cleaner!"
✅ "Good catch on the edge case handling"
```

---

## Common Review Categories

### Architecture Concerns

```tsx
// Red flag: Component doing too much
function UserDashboard() {
  // Fetches data
  // Handles form submission
  // Manages local state
  // Renders complex UI
  // ...200 lines of code
}

// Feedback:
"This component has multiple responsibilities. Consider splitting:
- useUserData() hook for fetching
- UserDashboardLayout for structure
- UserStats, UserActivity as child components"
```

### Performance Concerns

```tsx
// Red flag: Creating objects/functions in render
function List({ items, onSelect }) {
  return items.map(item => (
    <Item
      key={item.id}
      onClick={() => onSelect(item.id)}  // New function every render
      style={{ color: 'blue' }}           // New object every render
    />
  ))
}

// Feedback:
"The onClick handler creates a new function on every render, which
can cause unnecessary re-renders of memoized children. Consider
using useCallback or passing item.id as data and handling in parent."
```

### Readability Concerns

```tsx
// Red flag: Clever but unclear
const result = data?.items?.filter(Boolean).reduce((a, b) => ({...a, [b.id]: b}), {})

// Feedback:
"This one-liner is hard to parse. Consider breaking into steps:
1. Filter out falsy items
2. Convert to object keyed by id
Each step could be a named function or intermediate variable."
```

### Security Concerns

```tsx
// Red flag: Unsanitized user input
function Comment({ content }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />
}

// Feedback:
"Blocker: Using dangerouslySetInnerHTML with user-provided content
creates an XSS vulnerability. Either sanitize the HTML with a library
like DOMPurify or render as plain text."
```

---

## The Author's Mindset

### Before Submitting

1. **Self-review first** - Read your own diff
2. **Write a good description** - Context, what changed, why
3. **Keep PRs small** - Easier to review, faster to merge
4. **Run tests locally** - Don't waste reviewer time on broken code

### Good PR Description Template

```markdown
## What
Brief description of what this PR does

## Why
Link to issue/ticket, explain the motivation

## How
High-level approach taken

## Testing
How you verified this works

## Screenshots
(If UI changes)
```

### Receiving Feedback

| Do | Don't |
|----|-------|
| Assume good intent | Take it personally |
| Ask clarifying questions | Get defensive |
| Explain your reasoning | Dismiss without consideration |
| Thank reviewers | Argue every point |

### Responding to Comments

```
✅ "Good point, I'll refactor this into a custom hook"
✅ "I considered that, but went with this approach because [reason].
    Would you still prefer the alternative?"
✅ "Could you elaborate? I'm not sure I understand the concern"
```

---

## Review Checklist

### Quick Check (Every PR)

- [ ] Code compiles/builds
- [ ] Tests pass
- [ ] No obvious bugs
- [ ] Readable variable/function names
- [ ] No console.log or debug code

### Standard Check

- [ ] Logic is correct
- [ ] Edge cases handled
- [ ] Error handling present
- [ ] Types are proper (no `any`)
- [ ] Components follow patterns
- [ ] No code duplication

### Deep Check (Complex PRs)

- [ ] Architecture is sound
- [ ] Performance implications considered
- [ ] Security implications considered
- [ ] Backwards compatibility maintained
- [ ] Documentation updated

---

## Automation

Let tools handle the tedious stuff:

| Tool | Catches |
|------|---------|
| **ESLint** | Code style, potential bugs |
| **Prettier** | Formatting |
| **TypeScript** | Type errors |
| **Tests** | Regressions |

This frees reviewers to focus on:
- Design decisions
- Business logic correctness
- Edge cases
- Knowledge sharing
