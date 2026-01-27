# Problem Solving for Developers

A systematic approach to breaking down and solving software problems.

---

## The Problem-Solving Framework

### UNDERSTAND → PLAN → EXECUTE → REFLECT

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ UNDERSTAND  │───▶│    PLAN     │───▶│   EXECUTE   │───▶│   REFLECT   │
│             │    │             │    │             │    │             │
│ What is the │    │ How will I  │    │ Implement   │    │ What did I  │
│ problem?    │    │ solve it?   │    │ the plan    │    │ learn?      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                                                        │
       └────────────────────────────────────────────────────────┘
                         (iterate)
```

---

## Step 1: UNDERSTAND

### Questions to Ask

1. **What is the expected behavior?**
2. **What is the actual behavior?**
3. **What are the inputs and outputs?**
4. **What are the constraints?**
5. **What edge cases exist?**

### Understanding Techniques

#### Restate the Problem

```
Original: "The form isn't working"

Restated: "When a user submits the contact form with valid
data, they expect to see a success message, but instead
nothing happens and no network request is made."
```

#### Ask "What would success look like?"

```
Success = User fills form → clicks submit → sees "Message sent!"
         → form resets → data appears in backend
```

#### Identify the Scope

```
What IS part of the problem:
✓ Form submission logic
✓ Button click handler
✓ API call

What is NOT part of the problem:
✗ Form validation (already works)
✗ Form styling
✗ Backend processing
```

---

## Step 2: PLAN

### Breaking Down the Problem

Use the **Divide and Conquer** approach:

```
Big Problem
├── Sub-problem 1
│   ├── Task 1a
│   └── Task 1b
├── Sub-problem 2
│   ├── Task 2a
│   └── Task 2b
└── Sub-problem 3
    └── Task 3a
```

### Example: Build a Search Feature

```
Search Feature
├── UI Layer
│   ├── Search input component
│   ├── Results list component
│   └── Loading/empty states
├── Logic Layer
│   ├── Debounce user input
│   ├── API call function
│   └── Results filtering
└── Integration
    ├── Connect UI to logic
    ├── Handle errors
    └── Add tests
```

### Planning Techniques

#### Start with the End

```
Final State: User types → debounced → API call → results displayed

Work backwards:
4. Display results ← need results data
3. API call ← need search term
2. Debounce ← need raw input
1. Input capture ← need input component
```

#### Identify the Riskiest Part

```
Risk Assessment:
- UI components: Low risk (standard pattern)
- Debounce logic: Medium risk (timing can be tricky)
- API integration: High risk (unknown response format)

→ Start with API integration to de-risk early
```

#### Write Pseudocode

```
function handleSearch(query):
  if query is empty:
    clear results
    return

  if query hasn't changed:
    return

  set loading state
  try:
    results = await fetchResults(query)
    set results state
  catch error:
    set error state
  finally:
    clear loading state
```

---

## Step 3: EXECUTE

### The Implementation Loop

```
┌──────────────────────────────────────────┐
│                                          │
│  Write small piece → Test → Refactor ────┤
│       ↑                                  │
│       └──────────────────────────────────┘
```

### Implementation Strategies

#### Start with a Spike

A spike is a quick, throwaway experiment to learn:

```tsx
// Spike: Can I call the search API?
async function testApi() {
  const res = await fetch('/api/search?q=test')
  console.log(await res.json())
}
testApi()

// Once it works, build the real implementation
```

#### Hard-code First, Generalize Later

```tsx
// Step 1: Hard-coded
function SearchResults() {
  const results = [
    { id: 1, title: 'Result 1' },
    { id: 2, title: 'Result 2' },
  ]
  return <ul>{results.map(r => <li key={r.id}>{r.title}</li>)}</ul>
}

// Step 2: Accept props
function SearchResults({ results }) {
  return <ul>{results.map(r => <li key={r.id}>{r.title}</li>)}</ul>
}

// Step 3: Add loading/empty states
function SearchResults({ results, isLoading }) {
  if (isLoading) return <Skeleton />
  if (!results.length) return <Empty />
  return <ul>{results.map(r => <li key={r.id}>{r.title}</li>)}</ul>
}
```

#### Commit Frequently

```
git commit -m "Add search input component"
git commit -m "Add debounce hook"
git commit -m "Connect search to API"
git commit -m "Add loading state"
git commit -m "Add error handling"
```

Each commit is a save point you can return to.

---

## Step 4: REFLECT

### After Solving

Ask yourself:

1. **What worked well?**
2. **What took longer than expected?**
3. **What would I do differently?**
4. **What did I learn?**
5. **Can I generalize this solution?**

### Document Your Learning

```markdown
## TIL: Debounce in React

Problem: API called on every keystroke

Solution: Custom useDebounce hook

Key Insight: The dependency array matters -
returning the debounced value, not the function

Code: [link to implementation]
```

---

## Debugging Methodology

### When You're Stuck

```
1. Reproduce reliably
   ↓
2. Isolate the problem
   ↓
3. Form hypotheses
   ↓
4. Test hypotheses
   ↓
5. Fix and verify
```

### The Scientific Method for Bugs

| Step | Action | Example |
|------|--------|---------|
| **Observe** | What happens? | "Button click does nothing" |
| **Question** | Why? | "Is the handler attached?" |
| **Hypothesize** | Maybe... | "onClick not bound correctly" |
| **Predict** | If true, then... | "Console.log in handler won't fire" |
| **Test** | Check prediction | Add console.log, click button |
| **Analyze** | Was I right? | "Log fired, so handler IS attached" |
| **Repeat** | New hypothesis | "Maybe the async call is failing" |

### Rubber Duck Debugging

Explain the problem out loud:

```
"Okay, so I have a button. When clicked, it should call
handleSubmit. handleSubmit is defined here... it calls
the API... wait, I'm not awaiting the response. That's
probably why the loading state never clears!"
```

### Binary Search Debugging

When you don't know where the bug is:

```
1. Comment out half the code
2. Does the bug still happen?
   - Yes → Bug is in remaining half
   - No → Bug is in commented half
3. Repeat with the buggy half
4. Continue until you find the exact line
```

---

## Common Problem Types

### Type 1: "It Doesn't Work"

**Approach:**
1. Define "work" - what should happen?
2. What actually happens?
3. Where does the behavior diverge?

### Type 2: "It's Slow"

**Approach:**
1. Measure first (React DevTools, Performance tab)
2. Identify the bottleneck
3. Optimize only that bottleneck
4. Measure again

### Type 3: "How Do I Build X?"

**Approach:**
1. Break X into components
2. Build simplest version first
3. Add features incrementally
4. Refactor as patterns emerge

### Type 4: "I Don't Understand This Code"

**Approach:**
1. Start with the entry point
2. Trace one path through the code
3. Add console.logs to verify understanding
4. Draw the data flow

---

## Mental Models

### "Zoom In, Zoom Out"

```
Zoom Out: See the big picture
├── How does this fit in the system?
├── What are the dependencies?
└── What's the user's goal?

Zoom In: See the details
├── What's happening on this line?
├── What's the type of this variable?
└── What's the exact error message?
```

### "What's the Simplest Thing That Could Work?"

Before building complex solutions:

```
Need: Persist user preference

Complex: Redux + localStorage middleware + hydration

Simple: localStorage.setItem('pref', value)

Start simple, add complexity only when needed.
```

### "Make It Work, Make It Right, Make It Fast"

```
1. Make it work - Get any solution working
2. Make it right - Refactor for clarity
3. Make it fast - Optimize if needed

Don't skip steps! Working code you can improve
beats perfect code that doesn't exist.
```

---

## Asking for Help

### Before Asking

1. [ ] Searched documentation
2. [ ] Searched Stack Overflow
3. [ ] Tried at least 3 approaches
4. [ ] Can explain what you've tried
5. [ ] Have a minimal reproducible example

### How to Ask

**Bad:**
> "It doesn't work, please help"

**Good:**
> "I'm trying to debounce search input in React.
>
> Expected: API called 300ms after user stops typing
> Actual: API called on every keystroke
>
> Here's my code: [minimal example]
>
> I tried using useEffect with a timeout, but the
> timeout doesn't seem to clear properly.
>
> What am I missing?"
