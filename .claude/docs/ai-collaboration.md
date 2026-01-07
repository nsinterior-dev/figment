# AI Collaboration Guidelines

## The Problem

AI tends to:
- Assume it understands problems from descriptions alone
- Jump to "obvious" fixes without investigation
- Generate surface-level solutions
- Produce spaghetti code when not constrained
- Ignore established patterns for quick fixes

## How to Keep AI on Track

### 1. Enforce Architecture

Instead of:
> "Create a code editor component"

Say:
> "Create a CodeEditor in `features/editor/components/`.
> Logic in a hook in `hooks/`.
> Tailwind only. Check existing patterns first."

### 2. Use Checkpoints

```
Step 1: "Show me your plan before coding"
Step 2: "Implement just the hook first"
Step 3: "Now the component"
Step 4: "Review - does this follow CLAUDE.md?"
```

### 3. Atomic Changes

Request one thing at a time:
1. "Create the TypeScript interfaces first"
2. "Now the utility functions"
3. "Now the hook"
4. "Finally, the component"

### 4. Start Sessions with Context

```
"Follow CLAUDE.md. Implement [feature] in [module].
Check existing patterns before creating new ones."
```

## Quick Corrections

| When You See | Say |
|--------------|-----|
| Logic in component | "Extract that to a hook" |
| `any` type | "Type that properly" |
| Inline styles | "Use Tailwind" |
| Giant file | "Split this - SRP" |
| New util created | "Check if one exists first" |
| Mixed concerns | "Separate UI from logic" |
| Assumption made | "Don't assume - investigate first" |
