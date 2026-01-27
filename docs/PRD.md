# Figment - Product Requirements Document

**Version**: 1.0
**Last Updated**: January 2025
**Status**: In Development

---

## Executive Summary

**Figment** is a design-to-code and code-to-design tool that bridges the gap between designers and developers. Using AI (Gemini), it converts design screenshots into production-ready React code and (in v2) exports code back to Figma.

### Vision

> Eliminate the manual translation between design and code. One tool, bidirectional flow.

### Core Value Proposition

| For | Pain Point | Solution |
|-----|------------|----------|
| **Developers** | Manually translating Figma designs to code | Upload screenshot → Get React code |
| **Designers** | No visibility into coded implementation | (v2) Code → Figma export |
| **Teams** | Design-dev handoff friction | Single source of truth |

---

## Goals

### Primary Goals (v1)

1. **Design → Code**: Convert design screenshots to functional React components
2. **Live Editing**: Edit generated code with syntax highlighting
3. **Instant Preview**: See live preview of generated/edited code
4. **Learning Tool**: Help developers understand React patterns through AI-generated code

### Secondary Goals (v2)

1. **Code → Design**: Export React/HTML/CSS to Figma
2. **Component Library**: Build and manage reusable components
3. **Version History**: Track code generation iterations
4. **Team Collaboration**: Share and iterate on designs

---

## User Personas

### Persona 1: Junior Developer

**Name**: Alex
**Role**: Frontend Developer (1-2 years experience)
**Goals**:
- Learn React patterns from well-structured code
- Speed up implementation of UI designs
- Understand component architecture

**Use Case**: Alex receives Figma designs and uses Figment to generate initial code, then learns from the patterns and customizes.

### Persona 2: Senior Developer

**Name**: Jordan
**Role**: Tech Lead (5+ years experience)
**Goals**:
- Rapid prototyping
- Consistent code generation
- Reduce repetitive UI work

**Use Case**: Jordan uses Figment to quickly scaffold components, freeing time for complex logic.

### Persona 3: Designer-Developer

**Name**: Sam
**Role**: Full-stack Designer
**Goals**:
- Quick design-to-code validation
- Iterate on designs with code feedback
- Maintain design-code consistency

**Use Case**: Sam uploads designs, tweaks the generated code, and validates visual accuracy.

---

## Features

### Phase 1: Core (MVP)

| Feature | Priority | Description |
|---------|----------|-------------|
| **F1: Image Upload** | P0 | Drag & drop or click to upload design screenshots |
| **F2: AI Generation** | P0 | Gemini converts image to React code |
| **F3: Code Editor** | P0 | CodeMirror editor with syntax highlighting |
| **F4: Live Preview** | P0 | Sandpack renders code in real-time |
| **F5: Copy Code** | P1 | One-click copy generated code |
| **F6: Theme Toggle** | P1 | Light/dark mode |

### Phase 2: Enhanced

| Feature | Priority | Description |
|---------|----------|-------------|
| **F7: Multiple Files** | P1 | Split code into component + styles |
| **F8: Framework Options** | P2 | Generate for React, Vue, or vanilla HTML |
| **F9: Component Library** | P2 | Save and reuse generated components |
| **F10: Prompt Refinement** | P1 | Guide AI with additional instructions |

### Phase 3: Advanced (v2)

| Feature | Priority | Description |
|---------|----------|-------------|
| **F11: Code → Figma** | P0 | Export React/HTML to Figma design |
| **F12: Design Inspection** | P1 | Click elements to see code mapping |
| **F13: Version History** | P2 | Track generation iterations |
| **F14: Collaboration** | P3 | Share projects with team |

---

## User Stories

### Epic 1: Design Upload

```
US-1.1: As a user, I want to drag and drop an image so I can quickly start generation.
US-1.2: As a user, I want to click to browse files so I have an alternative upload method.
US-1.3: As a user, I want to see upload progress so I know the system is working.
US-1.4: As a user, I want file validation so I only upload supported formats.
```

### Epic 2: Code Generation

```
US-2.1: As a user, I want AI to analyze my design so it understands the layout.
US-2.2: As a user, I want generated React code so I can use it in my project.
US-2.3: As a user, I want to see generation progress so I know it's working.
US-2.4: As a user, I want to add instructions so I can guide the generation.
US-2.5: As a user, I want to regenerate so I can get different results.
```

### Epic 3: Code Editing

```
US-3.1: As a user, I want syntax highlighting so code is readable.
US-3.2: As a user, I want to edit code so I can customize the output.
US-3.3: As a user, I want to copy code so I can use it in my project.
US-3.4: As a user, I want to reset code so I can start over.
US-3.5: As a user, I want multiple file tabs so I can work with split code.
```

### Epic 4: Live Preview

```
US-4.1: As a user, I want live preview so I can see my code rendered.
US-4.2: As a user, I want preview to update on edit so feedback is instant.
US-4.3: As a user, I want to see errors so I can fix my code.
US-4.4: As a user, I want responsive preview so I can test different sizes.
```

---

## Technical Requirements

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 16 (App Router) | Latest React 19, RSC support |
| **Language** | TypeScript (strict) | Type safety, better DX |
| **Styling** | Tailwind CSS v4 | Utility-first, design token support |
| **Components** | shadcn/ui (new-york) | Accessible, customizable |
| **AI** | Gemini (`@google/generative-ai`) | Vision capabilities, good React generation |
| **Editor** | CodeMirror (`@uiw/react-codemirror`) | Extensible, performant |
| **Preview** | Sandpack (`@codesandbox/sandpack-react`) | In-browser bundling, React support |
| **Testing** | Jest + Testing Library | Standard React testing |

### Architecture

```
src/
├── app/                    # Next.js pages (routing only)
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home - main workspace
│   └── api/
│       └── generate/       # AI generation endpoint
│           └── route.ts
│
├── components/ui/          # shadcn/ui primitives
│
├── features/
│   ├── upload/             # Image upload feature
│   │   ├── components/
│   │   │   └── UploadZone.tsx
│   │   ├── hooks/
│   │   │   └── useFileUpload.ts
│   │   ├── utils/
│   │   │   └── validateFile.ts
│   │   └── __tests__/
│   │
│   ├── generation/         # AI code generation
│   │   ├── components/
│   │   │   └── GenerationPanel.tsx
│   │   ├── hooks/
│   │   │   └── useGenerateCode.ts
│   │   ├── utils/
│   │   │   └── prompts.ts
│   │   └── __tests__/
│   │
│   ├── editor/             # Code editor
│   │   ├── components/
│   │   │   ├── CodeEditor.tsx
│   │   │   └── EditorTabs.tsx
│   │   ├── hooks/
│   │   │   └── useEditor.ts
│   │   └── __tests__/
│   │
│   ├── preview/            # Live preview
│   │   ├── components/
│   │   │   └── PreviewPane.tsx
│   │   ├── hooks/
│   │   │   └── usePreview.ts
│   │   └── __tests__/
│   │
│   └── inspector/          # Design inspection (v2)
│       ├── components/
│       ├── hooks/
│       └── __tests__/
│
├── shared/
│   └── types/
│       └── index.ts        # Shared TypeScript interfaces
│
└── lib/
    ├── utils.ts            # cn() and utilities
    └── gemini.ts           # Gemini client configuration
```

### API Design

#### POST /api/generate

**Request**:
```typescript
{
  image: string        // Base64 encoded image
  prompt?: string      // Optional user instructions
  framework?: "react" | "vue" | "html"
}
```

**Response**:
```typescript
{
  success: boolean
  code: string         // Generated code
  files?: {            // Optional split files
    name: string
    content: string
  }[]
  error?: string
}
```

### Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Upload    │────▶│  Generate   │────▶│   Editor    │
│   Zone      │     │   (Gemini)  │     │ (CodeMirror)│
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   Preview   │
                                        │  (Sandpack) │
                                        └─────────────┘
```

---

## UI/UX Specifications

### Layout

```
┌────────────────────────────────────────────────────────┐
│  Logo                              Theme Toggle  Help  │
├───────────────────┬────────────────────────────────────┤
│                   │                                    │
│    Upload Zone    │           Code Editor              │
│    (or Design)    │                                    │
│                   ├────────────────────────────────────┤
│    Generation     │                                    │
│    Controls       │          Live Preview              │
│                   │                                    │
└───────────────────┴────────────────────────────────────┘
```

### Key Interactions

| Action | Behavior |
|--------|----------|
| Drop image | Validate → Show preview → Enable generate |
| Click Generate | Show loading → Stream code → Update editor |
| Edit code | Debounce 300ms → Update preview |
| Copy code | Copy to clipboard → Show toast |
| Toggle theme | Instant switch → Persist preference |

### Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Desktop (>1024px) | Side-by-side panels |
| Tablet (768-1024px) | Stacked with tabs |
| Mobile (<768px) | Single panel with navigation |

---

## Success Metrics

### Quantitative

| Metric | Target | Measurement |
|--------|--------|-------------|
| Generation accuracy | >80% usable code | User feedback |
| Generation time | <10 seconds | API response time |
| Editor performance | <50ms keystroke | Performance monitoring |
| Preview sync | <500ms update | User testing |

### Qualitative

- Users can generate working React code from screenshots
- Generated code follows React best practices
- Code is readable and maintainable
- Users learn from generated patterns

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI generates poor code | High | Iterative prompt engineering, user feedback loop |
| Gemini API rate limits | Medium | Implement caching, request throttling |
| Sandpack performance | Medium | Debounce updates, lazy loading |
| Complex designs fail | High | Start with simple components, document limitations |

---

## Milestones

### M1: Foundation (Week 1-2)
- [ ] Project setup complete
- [ ] Upload feature working
- [ ] Basic AI integration

### M2: Core Features (Week 3-4)
- [ ] Code editor integrated
- [ ] Live preview working
- [ ] End-to-end flow complete

### M3: Polish (Week 5-6)
- [ ] Error handling
- [ ] Loading states
- [ ] Theme support
- [ ] Documentation

### M4: Launch (Week 7+)
- [ ] Testing complete
- [ ] Performance optimized
- [ ] Deploy to production

---

## Open Questions

1. **Prompt Strategy**: What instructions produce the best React code?
2. **File Splitting**: When should code be split into multiple files?
3. **Style Output**: Tailwind vs CSS-in-JS vs plain CSS?
4. **Error Recovery**: How to handle partial/failed generations?

---

## Appendix

### A: Gemini Prompt Template (Draft)

```
You are a React expert. Analyze this design screenshot and generate a React component.

Requirements:
- Use React 19 with functional components
- Use TypeScript with proper types
- Use Tailwind CSS for styling
- Make it responsive
- Follow accessibility best practices
- Use semantic HTML

Output only the code, no explanations.
```

### B: Supported File Types

| Format | Max Size | Notes |
|--------|----------|-------|
| PNG | 10MB | Preferred for UI screenshots |
| JPG/JPEG | 10MB | Acceptable |
| WebP | 10MB | Acceptable |
| GIF | 5MB | Static only |

### C: Component Output Structure

```tsx
// Generated component structure
import * as React from "react"

interface ComponentProps {
  // Props inferred from design
}

export function Component({ ...props }: ComponentProps) {
  return (
    // JSX matching design
  )
}
```
