# Frontend Developer Learning Roadmap

A structured path from junior to senior frontend developer.

---

## Skill Levels

### Level 1: Foundation (Junior)

> "I can build features with guidance"

**Core Skills:**
- [ ] HTML semantics
- [ ] CSS layouts (flexbox, grid)
- [ ] JavaScript fundamentals (ES6+)
- [ ] React basics (components, props, state)
- [ ] Basic TypeScript
- [ ] Git basics

**Can Do:**
- Build simple components
- Style with Tailwind/CSS
- Handle user interactions
- Make API calls
- Follow existing patterns

**Learning Focus:**
- Understanding, not memorization
- Reading documentation
- Asking good questions

---

### Level 2: Proficiency (Mid-level)

> "I can build features independently"

**Core Skills:**
- [ ] React hooks (all of them)
- [ ] Custom hook creation
- [ ] State management patterns
- [ ] TypeScript generics
- [ ] Testing (unit + integration)
- [ ] Performance basics

**Can Do:**
- Design component APIs
- Manage complex state
- Write maintainable code
- Debug effectively
- Review others' code

**Learning Focus:**
- Why patterns exist
- Trade-off analysis
- Code quality

---

### Level 3: Advanced (Senior)

> "I can design systems and mentor others"

**Core Skills:**
- [ ] Architecture design
- [ ] Performance optimization
- [ ] Security best practices
- [ ] API design
- [ ] Testing strategy
- [ ] Technical leadership

**Can Do:**
- Make architectural decisions
- Evaluate trade-offs
- Mentor junior developers
- Lead technical discussions
- Plan complex features

**Learning Focus:**
- System thinking
- Communication
- Technical strategy

---

## Learning Path by Topic

### React Deep Dive

```
1. Components & JSX
   ↓
2. Props & State
   ↓
3. Hooks (useState, useEffect)
   ↓
4. useCallback, useMemo
   ↓
5. useRef, useReducer
   ↓
6. Custom Hooks
   ↓
7. Context API
   ↓
8. Suspense & Concurrent Features
   ↓
9. Server Components (React 19)
```

**Practice Project:** Build a todo app, then refactor it 5 times as you learn each concept.

### TypeScript Mastery

```
1. Basic Types
   ↓
2. Interfaces vs Types
   ↓
3. Union & Intersection
   ↓
4. Type Narrowing
   ↓
5. Generics (basics)
   ↓
6. Generics (advanced)
   ↓
7. Utility Types
   ↓
8. Conditional Types
   ↓
9. Mapped Types
```

**Practice:** Type an existing JavaScript codebase.

### State Management Evolution

```
1. useState (local state)
   ↓
2. Lifting state up
   ↓
3. useReducer (complex local state)
   ↓
4. Context (shared state)
   ↓
5. React Query (server state)
   ↓
6. Zustand/Jotai (global client state)
```

**Key Insight:** Most apps don't need Redux. Server state (React Query) + local state covers 90% of cases.

### Testing Journey

```
1. Why test?
   ↓
2. Jest basics
   ↓
3. Testing Library
   ↓
4. Testing hooks
   ↓
5. Mocking
   ↓
6. Integration tests
   ↓
7. E2E (Playwright/Cypress)
   ↓
8. TDD practice
```

**Key Insight:** Test behavior, not implementation. Ask "what would a user see/do?"

### Architecture Understanding

```
1. File/folder organization
   ↓
2. Component patterns (presentational/container)
   ↓
3. Custom hooks extraction
   ↓
4. Feature-based architecture
   ↓
5. Layer separation
   ↓
6. API design patterns
   ↓
7. State architecture
   ↓
8. System design
```

---

## Weekly Learning Schedule

### The 70/20/10 Rule

| Activity | Time | Description |
|----------|------|-------------|
| **Building (70%)** | ~25 hrs | Writing code, solving problems |
| **Learning (20%)** | ~7 hrs | Tutorials, docs, courses |
| **Networking (10%)** | ~3 hrs | Code review, discussions, mentorship |

### Suggested Weekly Structure

| Day | Focus |
|-----|-------|
| **Monday** | Build - New feature work |
| **Tuesday** | Build - Continue feature |
| **Wednesday** | Learn - Deep dive on one topic |
| **Thursday** | Build - Apply what you learned |
| **Friday** | Review - Refactor, code review |
| **Weekend** | Explore - Side project, new tech |

---

## Learning Strategies

### 1. Build in Public

```
Week 1: Start simple project
Week 2-4: Add features, document decisions
Week 5+: Share, get feedback, iterate
```

**Benefits:** Accountability, feedback, portfolio

### 2. Read Other People's Code

Good codebases to study:
- **React** itself (patterns, conventions)
- **Next.js** (architecture)
- **Radix UI** (component design)
- **TanStack Query** (state management)

**How to read:**
1. Start with one file
2. Trace the data flow
3. Note patterns you don't understand
4. Research those patterns
5. Try to recreate simplified versions

### 3. Teach What You Learn

```
Learn → Practice → Teach → Deeper Understanding
```

Ways to teach:
- Write blog posts
- Answer Stack Overflow questions
- Mentor a junior developer
- Create tutorials/videos
- Explain concepts to rubber duck

### 4. Deliberate Practice

Not just coding, but **focused** coding:

| Bad Practice | Good Practice |
|--------------|---------------|
| Build what's comfortable | Build what stretches you |
| Avoid debugging | Seek out bugs to fix |
| Copy-paste solutions | Understand then implement |
| Skip tests | Write tests first |
| Ignore feedback | Seek code reviews |

---

## Resources by Level

### Foundation

| Resource | Type | Topic |
|----------|------|-------|
| React.dev | Docs | React basics |
| JavaScript.info | Tutorial | JS fundamentals |
| CSS Tricks | Articles | CSS techniques |
| TypeScript Handbook | Docs | TS basics |

### Intermediate

| Resource | Type | Topic |
|----------|------|-------|
| Patterns.dev | Book | Design patterns |
| Testing Library docs | Docs | Testing |
| Dan Abramov's blog | Articles | React deep dives |
| Kent C. Dodds | Courses | Testing, patterns |

### Advanced

| Resource | Type | Topic |
|----------|------|-------|
| Martin Fowler's blog | Articles | Architecture |
| System Design Primer | Guide | System thinking |
| Tech lead YouTube | Videos | Leadership |
| Conference talks | Videos | Advanced topics |

---

## Milestone Projects

### Level 1 Projects

1. **Todo App** - State management basics
2. **Weather App** - API integration
3. **Portfolio Site** - Styling, deployment

### Level 2 Projects

1. **E-commerce Store** - Complex state, routing
2. **Dashboard** - Data visualization, tables
3. **Chat App** - Real-time, websockets

### Level 3 Projects

1. **Full SaaS App** - Auth, billing, teams
2. **Component Library** - API design, docs
3. **Open Source Contribution** - Real-world impact

---

## Signs of Growth

### You're Growing When...

- You read your old code and cringe
- You anticipate edge cases before they happen
- You ask "why" more than "how"
- You can explain concepts simply
- You spot patterns across codebases
- Junior devs come to you with questions
- You question best practices (appropriately)
- You consider trade-offs, not just solutions

### Warning Signs of Stagnation

- Avoiding unfamiliar technologies
- Copy-pasting without understanding
- Not asking for code reviews
- Building the same thing repeatedly
- Not reading others' code
- Dismissing new approaches
