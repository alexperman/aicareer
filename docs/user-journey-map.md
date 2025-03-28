# AI Career - User Journey Map

## Overview

This document provides a visual representation of the user journeys through the AI Career platform, highlighting key transitions, animations, and interaction points. It serves as a companion to the UI/UX Design Guide and Implementation Plan.

## Job Seeker Journey Map

```mermaid
graph TD
    Landing[Landing Page] -->|Fade + Slide Animation| Login[Login/Signup]
    Login -->|Success Animation| Onboarding[Onboarding Flow]
    Onboarding -->|Step Transition| Dashboard[Dashboard]
    
    Dashboard -->|Slide Left| Profile[Profile Management]
    Dashboard -->|Slide Right| JobSearch[Job Search]
    Dashboard -->|Slide Up| ResumeEnhance[Resume Enhancement]
    Dashboard -->|Slide Down| InterviewPrep[Interview Preparation]
    
    ResumeEnhance -->|Multi-step Animation| ResumeUpload[Upload Resume]
    ResumeUpload -->|Parse Animation| ResumeSelect[Select Experiences]
    ResumeSelect -->|Process Animation| ResumeEnrich[AI Enrichment]
    ResumeEnrich -->|Reveal Animation| ResumePreview[Preview Enhanced Resume]
    ResumePreview -->|Download Animation| ResumeDownload[Download Resume]
    
    JobSearch -->|Filter Animation| JobResults[Job Results]
    JobResults -->|Expand Animation| JobDetail[Job Details]
    JobDetail -->|Slide Up Modal| ApplyJob[Apply to Job]
    ApplyJob -->|Multi-step Form| Application[Application Process]
    Application -->|Success Animation| ApplicationSubmitted[Application Submitted]
    
    InterviewPrep -->|Card Flip Animation| QuestionGeneration[Generate Questions]
    QuestionGeneration -->|Typing Animation| PracticeSession[Practice Session]
    PracticeSession -->|Record Animation| Feedback[AI Feedback]
    Feedback -->|Progress Animation| InterviewReady[Interview Ready]
    
    ApplicationSubmitted -->|Status Change Animation| ApplicationTracking[Application Tracking]
    ApplicationTracking -->|Timeline Animation| InterviewSchedule[Interview Scheduling]
    InterviewSchedule -->|Calendar Animation| InterviewConfirmed[Interview Confirmed]
    
    InterviewConfirmed -->|Notification Animation| OfferReceived[Offer Received]
    OfferReceived -->|Compare Animation| OfferNegotiation[Offer Negotiation]
    OfferNegotiation -->|Celebration Animation| OfferAccepted[Offer Accepted]
```

## Recruiter Journey Map

```mermaid
graph TD
    LandingR[Landing Page] -->|Fade + Slide Animation| LoginR[Login/Signup]
    LoginR -->|Success Animation| OnboardingR[Agency Onboarding]
    OnboardingR -->|Step Transition| DashboardR[Recruiter Dashboard]
    
    DashboardR -->|Slide Left| ProfileR[Agency Profile]
    DashboardR -->|Slide Right| CandidateSearch[Candidate Search]
    DashboardR -->|Slide Up| JobManagement[Job Management]
    DashboardR -->|Slide Down| CommunicationCenter[Communication Center]
    
    CandidateSearch -->|Filter Animation| CandidateResults[Candidate Results]
    CandidateResults -->|Expand Animation| CandidateDetail[Candidate Details]
    CandidateDetail -->|Slide Up Modal| ContactCandidate[Contact Candidate]
    
    JobManagement -->|Create Animation| CreateJob[Create Job Posting]
    CreateJob -->|Form Animation| JobPosted[Job Posted]
    JobPosted -->|List Animation| ApplicationReview[Application Review]
    
    ApplicationReview -->|Expand Animation| CandidateEvaluation[Candidate Evaluation]
    CandidateEvaluation -->|Status Change Animation| InterviewSetup[Interview Setup]
    InterviewSetup -->|Calendar Animation| InterviewScheduled[Interview Scheduled]
    
    InterviewScheduled -->|Status Update Animation| PostInterview[Post-Interview]
    PostInterview -->|Form Animation| OfferCreation[Offer Creation]
    OfferCreation -->|Send Animation| OfferSent[Offer Sent]
    OfferSent -->|Status Update Animation| Hired[Candidate Hired]
    
    CommunicationCenter -->|Tab Animation| Messaging[Messaging]
    Messaging -->|Typing Animation| ChatInterface[Chat Interface]
    CommunicationCenter -->|Tab Animation| Notifications[Notifications]
```

## Key Interaction Points & Animations

### 1. Resume Enhancement Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Interface
    participant AI as AI System
    
    U->>UI: Upload Resume
    Note over UI: Drag & Drop Animation
    UI->>AI: Process Resume
    Note over UI: Loading Animation
    AI->>UI: Return Parsed Data
    Note over UI: Success Animation
    UI->>U: Display Parsed Resume
    Note over UI: Reveal Animation
    
    U->>UI: Select Experiences
    Note over UI: Toggle Animation
    UI->>AI: Request Enhancement
    Note over UI: Processing Animation
    AI->>UI: Return Enhanced Content
    Note over UI: Typing Animation
    UI->>U: Show Before/After
    Note over UI: Compare Animation
    
    U->>UI: Approve Changes
    Note over UI: Confirmation Animation
    UI->>U: Generate Final Resume
    Note over UI: Success Animation
```

### 2. Interview Preparation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Interface
    participant AI as AI System
    
    U->>UI: Select Job Application
    Note over UI: Selection Animation
    UI->>AI: Request Interview Questions
    Note over UI: Loading Animation
    AI->>UI: Return Questions
    Note over UI: Card Reveal Animation
    UI->>U: Display Question Cards
    
    U->>UI: Start Practice Session
    Note over UI: Transition Animation
    U->>UI: Record Answer
    Note over UI: Microphone Animation
    UI->>AI: Analyze Answer
    Note over UI: Processing Animation
    AI->>UI: Provide Feedback
    Note over UI: Highlight Animation
    UI->>U: Show Feedback
    
    U->>UI: Next Question
    Note over UI: Card Flip Animation
    Note over UI: Repeat for all questions
    
    UI->>U: Show Summary
    Note over UI: Chart Animation
    UI->>U: Provide Improvement Areas
    Note over UI: Expand Animation
```

### 3. Job Application Tracking Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Interface
    participant S as System
    
    U->>UI: View Applications
    Note over UI: Board Animation
    UI->>U: Display Kanban Board
    
    U->>UI: Update Application Status
    Note over UI: Drag Animation
    UI->>S: Save Status Change
    S->>UI: Confirm Update
    Note over UI: Success Animation
    
    S->>UI: Status Change Notification
    Note over UI: Notification Animation
    UI->>U: Show Status Update
    
    U->>UI: View Application Details
    Note over UI: Expand Animation
    UI->>U: Show Timeline
    Note over UI: Timeline Animation
    
    U->>UI: Add Follow-up Note
    Note over UI: Form Animation
    UI->>S: Save Note
    S->>UI: Confirm Save
    Note over UI: Success Animation
```

## Page Transition Matrix

| From | To | Animation Type | Duration | Easing |
|------|------|---------------|----------|--------|
| Landing | Login | Fade + Slide | 300ms | ease-out |
| Login | Dashboard | Zoom + Fade | 400ms | ease-in-out |
| Dashboard | Any Section | Slide Direction | 300ms | ease-in-out |
| List View | Detail View | Expand | 250ms | ease-out |
| Form Step | Next Step | Slide Left | 300ms | ease-in-out |
| Form Step | Previous Step | Slide Right | 300ms | ease-in-out |
| Modal Open | - | Scale + Fade | 200ms | ease-out |
| Modal Close | - | Scale + Fade | 150ms | ease-in |
| Notification | - | Slide Down + Fade | 200ms | ease-out |
| Success State | - | Scale + Color | 300ms | spring(1, 0.3) |

## Micro-interactions

### Button States

```mermaid
stateDiagram-v2
    [*] --> Default
    Default --> Hover: Mouse over
    Hover --> Active: Mouse down
    Active --> Focus: Mouse up
    Focus --> Default: Mouse out
    Default --> Disabled: Disable
    Disabled --> Default: Enable
    Default --> Loading: Submit
    Loading --> Success: Complete
    Loading --> Error: Fail
    Success --> Default: Reset
    Error --> Default: Reset
```

### Form Field States

```mermaid
stateDiagram-v2
    [*] --> Empty
    Empty --> Focused: Click/Tab
    Focused --> Typing: Input
    Typing --> Valid: Valid input
    Typing --> Invalid: Invalid input
    Valid --> Filled: Blur
    Invalid --> Error: Blur
    Filled --> Focused: Click/Tab
    Error --> Focused: Click/Tab
```

## Mobile-specific Journey Adaptations

For mobile devices, the following adaptations are made to the user journey:

1. **Simplified Animations**
   - Reduced motion magnitude
   - Shorter durations (200ms vs 300ms)
   - Fewer parallel animations

2. **Navigation Adjustments**
   - Bottom sheet modals instead of side panels
   - Full-screen transitions instead of partial overlays
   - Bottom navigation bar instead of side navigation

3. **Interaction Adjustments**
   - Larger touch targets
   - Swipe gestures for navigation
   - Pull-to-refresh for content updates

```mermaid
graph TD
    MobileLanding[Mobile Landing] -->|Fade Animation| MobileLogin[Login/Signup]
    MobileLogin -->|Success Animation| MobileDashboard[Dashboard]
    
    MobileDashboard -->|Tab Animation| MobileProfile[Profile]
    MobileDashboard -->|Tab Animation| MobileJobs[Jobs]
    MobileDashboard -->|Tab Animation| MobileResume[Resume]
    MobileDashboard -->|Tab Animation| MobileInterview[Interview]
    
    MobileResume -->|Full Screen Transition| MobileResumeFlow[Resume Flow]
    MobileJobs -->|Full Screen Transition| MobileJobFlow[Job Flow]
    MobileInterview -->|Full Screen Transition| MobileInterviewFlow[Interview Flow]
    
    MobileResumeFlow -->|Bottom Sheet| MobileResumeOptions[Resume Options]
    MobileJobFlow -->|Bottom Sheet| MobileJobOptions[Job Options]
    MobileInterviewFlow -->|Bottom Sheet| MobileInterviewOptions[Interview Options]
```

## Responsive Behavior Map

| Component | Mobile (<640px) | Tablet (640-1024px) | Desktop (>1024px) |
|-----------|-----------------|---------------------|-------------------|
| Navigation | Bottom tabs | Side drawer | Persistent sidebar |
| Dashboard | Stacked cards | 2-column grid | 3-column grid |
| Forms | Full screen steps | Panel steps | Inline steps |
| Modals | Full screen | 80% width | 50% width |
| Lists | Vertical scroll | 2-column grid | 3-column grid |
| Details | Accordion sections | Tabbed sections | Side-by-side sections |
| Animations | Minimal | Moderate | Full |

## Accessibility Considerations in the Journey

Each step in the user journey includes these accessibility adaptations:

1. **Motion Sensitivity**
   - All animations respect `prefers-reduced-motion`
   - Alternative static transitions available

2. **Keyboard Navigation**
   - Full journey navigable via keyboard
   - Focus indicators visible at all times
   - Logical tab order maintained

3. **Screen Reader Support**
   - ARIA live regions for dynamic content
   - Status announcements for transitions
   - Descriptive labels for interactive elements

4. **Color and Contrast**
   - All UI elements meet WCAG AA standards
   - Animations don't rely solely on color changes
   - Focus states visible in all color schemes
