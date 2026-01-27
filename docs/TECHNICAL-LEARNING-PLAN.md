# Figment Technical Learning Plan

A step-by-step guide to building Figment while learning frontend architecture, patterns, and best practices.

---

## Philosophy

> **Learn by Building, Not Just Reading**

Each module teaches you something new. You'll:
1. **Understand** the concept (why it exists)
2. **Implement** it yourself (hands-on)
3. **Reflect** on what you learned (solidify knowledge)

---

## Your Current State

```
✅ Have                          ❌ Don't Have Yet
──────────────────────────────   ──────────────────────────────
Next.js 16 + React 19 setup      API routes
Tailwind CSS v4 + shadcn/ui      Gemini integration
Project structure (features/)    Feature implementations
.env.local with API key          Tests
Design system documented         CI/CD pipeline
```

---

## Learning Modules Overview

| Module | What You'll Build | What You'll Learn |
|--------|------------------|-------------------|
| **M1** | Gemini API Route | API routes, server-side code, environment variables |
| **M2** | Upload Feature | Components, hooks separation, file handling |
| **M3** | Generation Feature | API integration, loading states, error handling |
| **M4** | Editor Feature | Third-party libraries, controlled components |
| **M5** | Preview Feature | Component composition, real-time sync |
| **M6** | Polish & Testing | Testing patterns, error boundaries |
| **M7** | CI/CD | GitHub Actions, deployment |

---

## Module 1: Gemini API Route

### Learning Goals
- [ ] Understand Next.js API routes (App Router)
- [ ] Learn server-side vs client-side code
- [ ] Handle environment variables securely
- [ ] Design clean API interfaces

### Concepts to Understand First

**Why API Routes?**
```
Browser → API Route → External Service
         (your code)   (Gemini)

Your API key stays on the server, never exposed to users.
```

**The Request/Response Cycle**
```
1. Client sends POST request with image data
2. API route receives and validates
3. API route calls Gemini
4. API route formats response
5. Client receives generated code
```

### Files to Create

| File | Purpose | Layer |
|------|---------|-------|
| `src/lib/gemini.ts` | Gemini client setup | Infrastructure |
| `src/shared/types/api.ts` | Request/response types | Domain |
| `src/app/api/generate/route.ts` | API endpoint | Application |

### Step-by-Step Implementation

#### Step 1.1: Define Types First (Domain Layer)

**Why types first?** Forces you to think about the interface before implementation.

```
src/shared/types/api.ts
```

**Think about:**
- What does the client send? (image, optional instructions)
- What does the server return? (code, or error)
- What errors can happen?

#### Step 1.2: Create Gemini Client (Infrastructure Layer)

```
src/lib/gemini.ts
```

**Learn:**
- How to initialize the Gemini SDK
- Configuration options (model, safety settings)
- Why we abstract this into a separate file (Single Responsibility)

#### Step 1.3: Create API Route (Application Layer)

```
src/app/api/generate/route.ts
```

**Learn:**
- Next.js App Router API conventions
- Request validation
- Error handling patterns
- Response formatting

#### Step 1.4: Test Manually

```bash
# Start dev server
npm run dev

# Test with curl (in another terminal)
curl -X POST http://localhost:3200/api/generate \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_image_data_here"}'
```

### Reflection Questions

After completing Module 1, answer these:

1. Why do we put the API key in `.env.local` instead of the code?
2. What happens if Gemini's API is down? How do we handle it?
3. Why separate `gemini.ts` from `route.ts`?
4. What's the difference between a 400 and 500 error?

### Checkpoint

- [ ] API route created at `/api/generate`
- [ ] Types defined for request/response
- [ ] Gemini client configured
- [ ] Can test with curl and get response
- [ ] Errors handled gracefully

---

## Module 2: Upload Feature

### Learning Goals
- [ ] Understand feature-based architecture
- [ ] Separate UI (components) from logic (hooks)
- [ ] Handle file inputs and validation
- [ ] Manage component state

### Architecture Pattern

```
src/features/upload/
├── components/
│   └── UploadZone.tsx    ← UI: How it looks
├── hooks/
│   └── useFileUpload.ts  ← Logic: How it works
├── utils/
│   └── validateFile.ts   ← Pure: Validation rules
└── __tests__/
    └── validateFile.test.ts
```

**Why this structure?**
- **Components**: Receive data, render UI, call handlers
- **Hooks**: Manage state, side effects, business logic
- **Utils**: Pure functions, no React, easy to test

### Step-by-Step Implementation

#### Step 2.1: Utils First (Easiest to Test)

```
src/features/upload/utils/validateFile.ts
```

**Implement:**
- Check file type (png, jpg, webp)
- Check file size (max 10MB)
- Return validation result with error message

**Write test:**
```
src/features/upload/__tests__/validateFile.test.ts
```

#### Step 2.2: Hook (Business Logic)

```
src/features/upload/hooks/useFileUpload.ts
```

**Manage:**
- File state (null | File)
- Preview URL (for displaying image)
- Error state
- Upload handler

**Pattern to learn: Custom Hook Return Type**
```tsx
interface UseFileUploadReturn {
  file: File | null
  preview: string | null
  error: string | null
  handleFileSelect: (file: File) => void
  clearFile: () => void
}
```

#### Step 2.3: Component (UI Only)

```
src/features/upload/components/UploadZone.tsx
```

**Implement:**
- Drag and drop zone
- Click to browse
- Preview thumbnail
- Error display

**Pattern to learn: Component receives hook**
```tsx
function UploadZone() {
  const { file, preview, error, handleFileSelect, clearFile } = useFileUpload()

  // Component only renders, doesn't contain logic
  return (...)
}
```

### Reflection Questions

1. Why not put validation logic inside the component?
2. What's the benefit of the hook returning an object vs multiple values?
3. How would you add a "loading" state to this feature?
4. If you needed upload progress, where would that code live?

### Checkpoint

- [ ] `validateFile.ts` with tests passing
- [ ] `useFileUpload.ts` hook managing state
- [ ] `UploadZone.tsx` rendering UI
- [ ] Can select file and see preview
- [ ] Invalid files show error message

---

## Module 3: Generation Feature

### Learning Goals
- [ ] Integrate with your own API
- [ ] Handle async operations (loading, success, error)
- [ ] Learn the fetch → loading → result pattern
- [ ] Understand optimistic vs pessimistic updates

### Architecture

```
src/features/generation/
├── components/
│   ├── GenerationPanel.tsx   ← Controls and status
│   └── GenerationStatus.tsx  ← Loading/error states
├── hooks/
│   └── useGenerateCode.ts    ← API call logic
├── utils/
│   └── prompts.ts            ← Prompt templates
└── __tests__/
```

### Key Pattern: Async State Machine

```
idle → loading → success
              ↘ error
```

```tsx
interface GenerationState {
  status: 'idle' | 'loading' | 'success' | 'error'
  code: string | null
  error: string | null
}
```

### Step-by-Step Implementation

#### Step 3.1: Prompt Engineering

```
src/features/generation/utils/prompts.ts
```

**Create:**
- Base prompt for design → React
- Function to build full prompt with user instructions
- Keep prompts maintainable and testable

#### Step 3.2: Generation Hook

```
src/features/generation/hooks/useGenerateCode.ts
```

**Implement:**
- State machine (idle/loading/success/error)
- API call to your `/api/generate`
- Convert image to base64
- Handle all states

#### Step 3.3: UI Components

```
src/features/generation/components/GenerationPanel.tsx
src/features/generation/components/GenerationStatus.tsx
```

**Pattern: Conditional rendering by state**
```tsx
switch (status) {
  case 'idle':
    return <IdleState />
  case 'loading':
    return <LoadingState />
  case 'success':
    return <SuccessState code={code} />
  case 'error':
    return <ErrorState error={error} />
}
```

### Reflection Questions

1. Why use a state machine instead of multiple boolean flags?
2. What happens if the user clicks "Generate" twice quickly?
3. How would you add a "cancel" feature?
4. Where should retry logic live?

### Checkpoint

- [ ] Can trigger generation from uploaded image
- [ ] Loading state displays during API call
- [ ] Success shows generated code
- [ ] Errors display with helpful message
- [ ] Can regenerate with same image

---

## Module 4: Editor Feature

### Learning Goals
- [ ] Integrate third-party library (CodeMirror)
- [ ] Understand controlled vs uncontrolled components
- [ ] Handle code as state
- [ ] Learn debouncing

### Architecture

```
src/features/editor/
├── components/
│   ├── CodeEditor.tsx       ← CodeMirror wrapper
│   └── EditorToolbar.tsx    ← Copy, reset buttons
├── hooks/
│   └── useEditor.ts         ← Editor state management
└── __tests__/
```

### Key Concept: Controlled Component

```tsx
// Uncontrolled: Component manages its own state
<input defaultValue="hello" />

// Controlled: Parent manages state
const [value, setValue] = useState("hello")
<input value={value} onChange={e => setValue(e.target.value)} />
```

CodeMirror needs to be controlled so you can:
- Set initial value from generation
- Get current value for preview
- Reset to original

### Step-by-Step Implementation

#### Step 4.1: Editor Hook

```
src/features/editor/hooks/useEditor.ts
```

**Manage:**
- Current code
- Original code (for reset)
- Copy to clipboard
- Has changes flag

#### Step 4.2: CodeMirror Wrapper

```
src/features/editor/components/CodeEditor.tsx
```

**Learn:**
- How to wrap third-party components
- Extension configuration
- Theme customization

#### Step 4.3: Toolbar

```
src/features/editor/components/EditorToolbar.tsx
```

**Implement:**
- Copy button with feedback
- Reset button
- Maybe language selector (future)

### Reflection Questions

1. Why wrap CodeMirror instead of using it directly?
2. What's the benefit of keeping "original code" separate?
3. How would you add syntax error highlighting?
4. Where would "save to file" functionality go?

### Checkpoint

- [ ] CodeMirror renders with syntax highlighting
- [ ] Can edit generated code
- [ ] Copy to clipboard works
- [ ] Reset restores original
- [ ] Code changes reflected in parent state

---

## Module 5: Preview Feature

### Learning Goals
- [ ] Integrate Sandpack for live preview
- [ ] Sync state between components
- [ ] Handle preview errors
- [ ] Learn about debouncing for performance

### Architecture

```
src/features/preview/
├── components/
│   ├── PreviewPane.tsx       ← Sandpack wrapper
│   └── PreviewError.tsx      ← Error display
├── hooks/
│   └── usePreview.ts         ← Preview state
└── __tests__/
```

### Key Concept: State Lifting

```
                    page.tsx
                   /        \
         UploadZone          CodeEditor
              ↓                   ↓
          [image] ──────→ [code] ←────→ PreviewPane

State flows DOWN, events flow UP
```

### Step-by-Step Implementation

#### Step 5.1: Sandpack Setup

```
src/features/preview/components/PreviewPane.tsx
```

**Configure:**
- React template
- Custom files from editor
- Theme matching app

#### Step 5.2: Sync Hook

```
src/features/preview/hooks/usePreview.ts
```

**Manage:**
- Debounced code updates
- Error state
- Preview visibility

#### Step 5.3: Wire It All Together

```
src/app/page.tsx
```

**Compose all features:**
```tsx
function Home() {
  const [image, setImage] = useState<File | null>(null)
  const [code, setCode] = useState<string>("")

  return (
    <Layout>
      <UploadZone onImageSelect={setImage} />
      <GenerationPanel image={image} onCodeGenerated={setCode} />
      <CodeEditor code={code} onChange={setCode} />
      <PreviewPane code={code} />
    </Layout>
  )
}
```

### Reflection Questions

1. Why lift state to the page instead of using context?
2. What's the tradeoff of debouncing preview updates?
3. How would you add "responsive preview" (different screen sizes)?
4. Where would "export to CodeSandbox" functionality go?

### Checkpoint

- [ ] Sandpack renders React code
- [ ] Preview updates when code changes
- [ ] Errors display helpfully
- [ ] Debounced (doesn't lag on fast typing)
- [ ] Full flow works: upload → generate → edit → preview

---

## Module 6: Polish & Testing

### Learning Goals
- [ ] Write meaningful tests
- [ ] Add error boundaries
- [ ] Improve loading states
- [ ] Add keyboard shortcuts

### Testing Strategy

```
                    Tests Pyramid
                       /\
                      /E2E\           1-2 tests (full flow)
                     /────\
                    / Integ \         5-10 tests (features)
                   /────────\
                  /   Unit    \       20+ tests (utils, hooks)
                 /──────────────\
```

### What to Test

| Layer | What to Test | Example |
|-------|-------------|---------|
| Utils | Input/output | `validateFile` returns correct errors |
| Hooks | State changes | `useFileUpload` clears error on new file |
| Components | User interactions | Clicking upload triggers file dialog |
| Integration | Feature flows | Upload → Generate → See code |

### Step-by-Step

#### Step 6.1: Unit Tests for Utils

Test all your pure functions:
- `validateFile.ts`
- `prompts.ts`

#### Step 6.2: Hook Tests

```tsx
import { renderHook, act } from '@testing-library/react'
import { useFileUpload } from './useFileUpload'

test('sets error for invalid file type', () => {
  const { result } = renderHook(() => useFileUpload())

  act(() => {
    result.current.handleFileSelect(new File([''], 'test.txt', { type: 'text/plain' }))
  })

  expect(result.current.error).toBe('Invalid file type')
})
```

#### Step 6.3: Component Tests

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UploadZone } from './UploadZone'

test('shows preview after file selection', async () => {
  render(<UploadZone />)

  const file = new File(['image'], 'test.png', { type: 'image/png' })
  const input = screen.getByLabelText(/upload/i)

  await userEvent.upload(input, file)

  expect(screen.getByRole('img')).toBeInTheDocument()
})
```

### Checkpoint

- [ ] Utils have 100% test coverage
- [ ] Each hook has key behavior tests
- [ ] Components test user interactions
- [ ] All tests pass: `npm run test`

---

## Module 7: CI/CD

### Learning Goals
- [ ] Understand GitHub Actions
- [ ] Set up continuous integration
- [ ] Deploy to Google Cloud Run
- [ ] Manage secrets securely

### CI Pipeline (Automatic Testing)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### CD Pipeline (Automatic Deployment)

Only after CI passes, on release:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  release:
    types: [published]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_CREDENTIALS }}
      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: figment
          region: asia-southeast1
          source: .
```

### Google Cloud Setup

1. Enable APIs: Cloud Run, Artifact Registry
2. Create service account for GitHub Actions
3. Add secrets to GitHub repository
4. Configure Cloud Run service

### Checkpoint

- [ ] CI runs on every push
- [ ] Tests must pass to merge
- [ ] Deploy triggers on release
- [ ] App runs on Cloud Run
- [ ] Environment variables configured

---

## Learning Milestones

### Milestone 1: First API Call
After Module 1, you can:
- Create API routes
- Handle requests/responses
- Integrate external APIs

### Milestone 2: First Feature
After Module 2, you understand:
- Feature-based architecture
- Hooks vs components
- State management basics

### Milestone 3: Full Flow
After Module 5, you can:
- Build complete features
- Manage complex state
- Compose multiple features

### Milestone 4: Production Ready
After Module 7, you know:
- Testing strategies
- CI/CD pipelines
- Deployment processes

---

## How to Use This Plan

### Daily Practice

```
Morning (1-2 hours):
1. Read the module's concepts section
2. Think about WHY before HOW

Afternoon (2-3 hours):
3. Implement step by step
4. Don't copy-paste - type it out
5. Add console.logs to understand flow

Evening (30 min):
6. Answer reflection questions
7. Note what confused you
8. Plan tomorrow
```

### When Stuck

1. Re-read the concept section
2. Check the reference docs (patterns.md, architecture.md)
3. Add console.logs to trace the issue
4. Ask `/mentor` for guidance (not solutions)

### Progress Tracking

Mark checkpoints as you complete them. Each completed module is a meaningful accomplishment.

---

## Next Steps

Ready to start? Begin with **Module 1: Gemini API Route**.

Command to start:
```bash
npm run dev
```

First file to create:
```
src/shared/types/api.ts
```

Good luck! Remember: understanding > speed.
