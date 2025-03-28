# AI Career - UI/UX Design Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Design System](#design-system)
3. [Page Transitions & Animations](#page-transitions--animations)
4. [User Journeys](#user-journeys)
5. [Key Use Cases](#key-use-cases)
6. [Accessibility Considerations](#accessibility-considerations)
7. [Responsive Design](#responsive-design)
8. [Performance Optimization](#performance-optimization)

## Introduction

This document outlines the UI/UX design principles, animations, transitions, and user journeys for the AI Career platform. The platform aims to provide a seamless, intuitive experience for job seekers and recruiters, with a focus on AI-enhanced career development tools.

### Platform Goals

- Provide an intuitive, engaging experience for job seekers and recruiters
- Streamline the job application process with AI assistance
- Create meaningful connections between candidates and employers
- Offer personalized career insights and guidance
- Maintain high performance and accessibility standards

## Design System

### Colors

- **Primary**: #3B82F6 (Blue)
- **Secondary**: #10B981 (Green)
- **Accent**: #8B5CF6 (Purple)
- **Neutral**: 
  - Background: #F9FAFB
  - Card: #FFFFFF
  - Text: #111827
  - Subtle Text: #6B7280

### Typography

- **Headings**: Inter, sans-serif
- **Body**: Inter, sans-serif
- **Code**: Fira Code, monospace

### Components

Built with Shadcn UI, our components follow a consistent design language:

- **Buttons**: Rounded corners, consistent padding, hover/focus states
- **Cards**: Subtle shadows, consistent padding, rounded corners
- **Forms**: Clear labels, validation states, consistent spacing
- **Navigation**: Clear hierarchy, active states, consistent spacing

## Page Transitions & Animations

### Global Transition System

All page transitions follow these principles:

1. **Consistency**: Similar elements transition in similar ways
2. **Purpose**: Animations convey meaning and direction
3. **Performance**: Animations are optimized for performance
4. **Subtlety**: Animations enhance rather than distract

### Transition Types

1. **Page Transitions**

```tsx
// Implementation using Framer Motion
<AnimatePresence mode="wait">
  <motion.div
    key={router.pathname}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

2. **Component Transitions**

- **Fade In**: For new content appearing (opacity: 0 → 1)
- **Slide In**: For sequential content (transform: translateY(20px) → 0)
- **Scale**: For emphasis (transform: scale(0.95) → 1)

3. **Micro-interactions**

- Button hover/press effects
- Form field focus states
- Toggle switches
- Loading indicators
- Success/error animations

### Animation Timing

- **Fast**: 150-200ms (button clicks, toggles)
- **Medium**: 200-300ms (component transitions)
- **Slow**: 300-500ms (page transitions, complex animations)

### Staggered Animations

For lists and grids, items animate in sequence with a slight delay:

```tsx
<motion.ul>
  {items.map((item, i) => (
    <motion.li
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, duration: 0.3 }}
    >
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

## User Journeys

### Job Seeker Journey

1. **Onboarding**
   - Welcome screen with value proposition
   - Account creation/login
   - Profile creation with guided steps
   - Resume upload and parsing

2. **Resume Enhancement**
   - Resume parsing and visualization
   - Experience selection for enrichment
   - AI-enhanced resume preview
   - Download and sharing options

3. **Job Search & Application**
   - Job discovery with personalized recommendations
   - Job details and company information
   - Application preparation with AI assistance
   - Application tracking and status updates

4. **Interview Preparation**
   - AI-generated interview questions
   - Practice session with feedback
   - Company-specific preparation
   - Interview scheduling and reminders

5. **Offer Negotiation**
   - Offer comparison and analysis
   - Negotiation strategy with AI guidance
   - Acceptance and onboarding preparation

### Recruiter Journey

1. **Onboarding**
   - Agency registration and verification
   - Team member invitation
   - Profile and preferences setup

2. **Candidate Discovery**
   - Search with advanced filters
   - AI-powered candidate matching
   - Candidate profile review

3. **Engagement**
   - Initial contact through platform messaging
   - Interview scheduling
   - Application review and feedback
   - Offer management

### Transition Mapping

| From | To | Transition | Animation |
|------|------|------------|-----------|
| Landing | Login | Slide right | Fade old, reveal new |
| Login | Dashboard | Expand | Zoom in to dashboard |
| Dashboard | Profile | Slide up | Push previous content down |
| Dashboard | Job Search | Slide left | Carousel effect |
| Job Details | Application | Slide up | Modal appearance |
| Application | Confirmation | Scale | Success animation |

## Key Use Cases

### 1. Resume Enhancement & AI Enrichment

**Problem**: Users need to create standout resumes that highlight their skills effectively.

**Solution**: AI-powered resume enhancement that enriches experiences with compelling descriptions.

**User Flow**:
1. Upload resume or enter details manually
2. AI parses and structures the information
3. User selects experiences to enhance
4. AI generates enriched descriptions
5. User reviews and edits suggestions
6. Final resume is generated for download

**Key Interactions**:
- Drag-and-drop resume upload with progress animation
- Interactive experience selection with toggle animations
- Real-time AI generation with typing effect
- Side-by-side comparison with before/after states
- Download with success animation

**Animation Focus**:
- Smooth transitions between steps
- Progress indicators with fluid animations
- Subtle highlighting of AI-enhanced sections
- Celebratory animation upon completion

### 2. Interview Preparation

**Problem**: Users need to prepare for interviews with company-specific questions.

**Solution**: AI-generated interview questions and practice sessions.

**User Flow**:
1. Select job application or enter company/role
2. AI generates relevant interview questions
3. User practices answering questions
4. AI provides feedback on answers
5. User can retry or move to next question
6. Summary of performance and improvement areas

**Key Interactions**:
- Question cards with flip animation
- Voice recording with waveform visualization
- Real-time feedback with highlight animations
- Progress tracking with animated charts
- Practice mode with timer animations

**Animation Focus**:
- Conversational UI with typing indicators
- Microphone activation with pulse animation
- Feedback appearance with gentle highlighting
- Transition between questions with card rotation

### 3. Job Application Tracking

**Problem**: Users need to track multiple job applications and their statuses.

**Solution**: Visual application tracking board with status updates.

**User Flow**:
1. View all applications in kanban-style board
2. Move applications between status columns
3. Receive notifications for status changes
4. Access application details and communication
5. Schedule follow-ups and reminders

**Key Interactions**:
- Drag-and-drop cards between columns
- Expand/collapse application details
- Filter and search with animated results
- Timeline visualization with progress indicators
- Notification badges with subtle animations

**Animation Focus**:
- Smooth drag-and-drop with physics
- Card expansion with content reveal
- Filter transitions with staggered results
- Status change celebrations
- Subtle background patterns for different statuses

## Accessibility Considerations

### Animation Controls

- Respect `prefers-reduced-motion` settings:

```tsx
const prefersReducedMotion = 
  typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

const animationSettings = prefersReducedMotion 
  ? { duration: 0 } 
  : { duration: 0.3 };
```

### Focus Management

- Maintain focus during transitions
- Provide keyboard navigation for all interactive elements
- Use focus indicators that are visible in all color schemes

### Screen Reader Support

- Provide ARIA labels for animated content
- Ensure all interactive elements have accessible names
- Use semantic HTML elements

## Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Adaptation Strategy

- **Mobile**: Simplified animations, stacked layouts
- **Tablet**: Moderate animations, hybrid layouts
- **Desktop**: Full animations, expanded layouts

### Animation Adjustments

```tsx
const useResponsiveAnimation = () => {
  const { width } = useWindowDimensions();
  
  if (width < 640) {
    return {
      duration: 0.2,
      distance: 10,
      stagger: 0.03
    };
  } else if (width < 1024) {
    return {
      duration: 0.25,
      distance: 15,
      stagger: 0.04
    };
  } else {
    return {
      duration: 0.3,
      distance: 20,
      stagger: 0.05
    };
  }
};
```

## Performance Optimization

### Animation Performance

- Use CSS transforms and opacity for smooth animations
- Implement `will-change` selectively for complex animations
- Avoid animating expensive properties (layout, paint)
- Use hardware acceleration for complex animations

### Loading States

- Implement skeleton screens instead of spinners
- Use content placeholders that match the expected layout
- Animate loading states with subtle pulse effects

### Code Splitting

- Load animation libraries only when needed
- Split animation code by route for reduced initial load

```tsx
// Dynamic import of animation components
const AnimatedCard = dynamic(() => import('@/components/AnimatedCard'), {
  ssr: false,
  loading: () => <CardSkeleton />
});
```

### Measurement and Monitoring

- Track animation performance metrics (FPS, jank)
- Implement performance budgets for animations
- Use React DevTools Profiler to identify performance issues
