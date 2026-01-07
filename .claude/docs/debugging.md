# Debugging Protocol

## The Problem with AI Debugging

AI tends to:
- Guess fixes based on error messages alone
- Apply "common solutions" without verifying
- Miss edge cases and race conditions
- Fix symptoms, not root causes
- Skip investigation steps

**NEVER jump to fixes. ALWAYS investigate first.**

---

## Phase 1: Gather Evidence

```
1. REPRODUCE
   - Exact steps to reproduce
   - Every time or intermittent?
   - What conditions?

2. OBSERVE
   - Actual vs expected behavior
   - Full error messages

3. COLLECT DATA
   - Console logs (errors, warnings)
   - React DevTools state
   - Network tab (requests, responses)
   - Component render count
```

## Phase 2: Investigate

```
4. TRACE THE FLOW
   - Where does data originate?
   - What transformations happen?
   - Where does it break?

5. ISOLATE
   - Minimal reproduction?
   - Which component/hook is responsible?

6. FORM HYPOTHESIS
   - List multiple possibilities
   - Not just one guess
```

## Phase 3: Verify Before Fixing

```
7. CONFIRM HYPOTHESIS
   - Add targeted console.logs
   - Does it explain ALL symptoms?
   - If not, go back to investigation

8. ONLY THEN: Propose Fix
   - Explain WHY it addresses root cause
   - Note edge cases handled
```

---

## Commands for AI

| Phase | Command |
|-------|---------|
| Start | "Investigate this bug - don't fix yet" |
| Evidence | "What do the console/network logs show?" |
| Trace | "Trace the data flow from source to error" |
| Isolate | "Which specific component/hook is failing?" |
| Hypothesis | "What are 3 possible causes?" |
| Verify | "How can we confirm which cause is correct?" |
| Fix | "Now propose a fix and explain why it works" |

---

## Bug Report Template

```markdown
**Actual behavior:** [What happens]

**Expected behavior:** [What should happen]

**Steps to reproduce:**
1.
2.
3.

**Console output:**
[paste errors/logs]

**Network requests:** [relevant data]

**Component state:** [React DevTools]

**What I've tried:**
-

**My hypothesis:** [Your guess]
```

---

## Red Flags - Push Back

| AI Says | You Say |
|---------|---------|
| "This is probably..." | "Don't guess. What does the evidence show?" |
| "The common fix is..." | "Is that the fix for THIS case?" |
| "Try changing X to Y" | "Why? What evidence points to X?" |
| "This should work" | "How do we verify it addresses root cause?" |
| "I've fixed the bug" | "Show me the investigation that led to this" |

---

## Console.log Strategy

```tsx
// BAD
console.log("here")
console.log(data)

// GOOD
console.log("[ComponentName] mount - props:", props)
console.log("[ComponentName] state change - before:", prev, "after:", next)
console.log("[useHook] fetch start - params:", params)
console.log("[useHook] fetch error - error:", error)
```

---

## Bug Categories

| Category | Focus |
|----------|-------|
| Render issues | Props, state, re-render triggers |
| State bugs | Hook deps, stale closures, race conditions |
| Data issues | API responses, transformations, type mismatches |
| Timing bugs | useEffect deps, async/await, event order |
| Style bugs | Tailwind classes, conditionals, specificity |
