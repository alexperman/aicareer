# AI Career - UI/UX Implementation Plan

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Animation Libraries](#animation-libraries)
3. [Implementation Approach](#implementation-approach)
4. [Component Structure](#component-structure)
5. [Code Examples](#code-examples)
6. [Testing Strategy](#testing-strategy)
7. [Performance Considerations](#performance-considerations)
8. [Implementation Timeline](#implementation-timeline)

## Technology Stack

Based on the project requirements, we'll implement the UI/UX design using:

- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI
- **Animation**: Framer Motion
- **State Management**: React Context
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (react-query)
- **Authentication**: Supabase Auth
- **Database**: Supabase

## Animation Libraries

### Primary: Framer Motion

Framer Motion will be our main animation library due to its:
- Declarative API that integrates well with React
- Support for gesture animations
- Built-in accessibility features
- Excellent performance optimization

### Supporting Libraries

- **AutoAnimate**: For simple list animations
- **React Spring**: For physics-based animations where needed
- **Lottie**: For complex pre-designed animations

## Implementation Approach

### 1. Layout Component

Create a base layout component that handles page transitions:

```tsx
// src/components/layout/AnimatedLayout.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { usePreferReducedMotion } from '@/hooks/usePreferReducedMotion';

interface AnimatedLayoutProps {
  children: ReactNode;
}

export function AnimatedLayout({ children }: AnimatedLayoutProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePreferReducedMotion();
  
  const variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: prefersReducedMotion ? 0 : -10 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### 2. Animation Hooks

Create custom hooks for reusable animations:

```tsx
// src/hooks/useAnimationVariants.ts
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { usePreferReducedMotion } from '@/hooks/usePreferReducedMotion';

export function useAnimationVariants() {
  const { width } = useWindowDimensions();
  const prefersReducedMotion = usePreferReducedMotion();
  
  // Skip animations if reduced motion is preferred
  if (prefersReducedMotion) {
    return {
      fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        transition: { duration: 0 }
      },
      slideUp: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        transition: { duration: 0 }
      },
      staggerChildren: 0
    };
  }
  
  // Responsive animation settings
  const distance = width < 640 ? 10 : width < 1024 ? 15 : 20;
  const duration = width < 640 ? 0.2 : width < 1024 ? 0.25 : 0.3;
  const staggerChildren = width < 640 ? 0.03 : width < 1024 ? 0.04 : 0.05;
  
  return {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      transition: { duration }
    },
    slideUp: {
      hidden: { opacity: 0, y: distance },
      visible: { opacity: 1, y: 0 },
      transition: { duration }
    },
    staggerChildren
  };
}
```

### 3. Animated Components

Create a set of base animated components:

```tsx
// src/components/ui/animated/AnimatedCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useAnimationVariants } from '@/hooks/useAnimationVariants';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedCard({ 
  header, 
  children, 
  footer, 
  delay = 0,
  className = ''
}: AnimatedCardProps) {
  const { slideUp } = useAnimationVariants();
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={slideUp}
      transition={{ 
        ...slideUp.transition, 
        delay 
      }}
    >
      <Card className={className}>
        {header && <CardHeader>{header}</CardHeader>}
        <CardContent>{children}</CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </motion.div>
  );
}
```

## Component Structure

### Animation Components Hierarchy

1. **Base Animation Components**
   - AnimatedLayout (page transitions)
   - AnimatedSection (section transitions)
   - AnimatedList (list with staggered children)
   - AnimatedCard (card with entrance animation)
   - AnimatedButton (button with feedback animations)

2. **Feature-specific Animation Components**
   - ResumeUploadAnimation (drag-drop with progress)
   - InterviewQuestionCard (flip animation)
   - ApplicationStatusBoard (drag-drop between columns)
   - AITypingEffect (for AI-generated content)
   - SuccessCelebration (completion animations)

3. **Page-specific Animation Sequences**
   - OnboardingAnimationSequence
   - ResumeEnhancementSequence
   - InterviewPrepSequence
   - JobApplicationSequence

## Code Examples

### 1. Staggered List Animation

```tsx
// src/components/ui/animated/AnimatedList.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useAnimationVariants } from '@/hooks/useAnimationVariants';

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
  delay?: number;
}

export function AnimatedList({ 
  children, 
  className = '',
  delay = 0
}: AnimatedListProps) {
  const { slideUp, staggerChildren } = useAnimationVariants();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren
      }
    }
  };
  
  return (
    <motion.ul
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {children.map((child, index) => (
        <motion.li key={index} variants={slideUp}>
          {child}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### 2. AI Typing Effect

```tsx
// src/components/ui/animated/AITypingEffect.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePreferReducedMotion } from '@/hooks/usePreferReducedMotion';

interface AITypingEffectProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export function AITypingEffect({
  text,
  className = '',
  speed = 30,
  delay = 0
}: AITypingEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = usePreferReducedMotion();
  
  useEffect(() => {
    // Skip animation if reduced motion is preferred
    if (prefersReducedMotion) {
      setDisplayedText(text);
      return;
    }
    
    // Reset when text changes
    setCurrentIndex(0);
    setDisplayedText('');
    
    const timer = setTimeout(() => {
      const intervalId = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const newIndex = prevIndex + 1;
          setDisplayedText(text.substring(0, newIndex));
          
          if (newIndex >= text.length) {
            clearInterval(intervalId);
          }
          
          return newIndex;
        });
      }, speed);
      
      return () => clearInterval(intervalId);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [text, speed, delay, prefersReducedMotion]);
  
  return (
    <div className={className}>
      {displayedText}
      {currentIndex < text.length && !prefersReducedMotion && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2 h-4 bg-primary ml-1"
        />
      )}
    </div>
  );
}
```

### 3. Page Transition for Resume Enhancement

```tsx
// src/app/(authenticated)/resume-enhancement/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ResumeUpload } from '@/components/resume/ResumeUpload';
import { ExperienceSelection } from '@/components/resume/ExperienceSelection';
import { AIEnhancement } from '@/components/resume/AIEnhancement';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { usePreferReducedMotion } from '@/hooks/usePreferReducedMotion';

const steps = ['upload', 'select', 'enhance', 'preview'];

export default function ResumeEnhancementPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState(null);
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [enhancedExperiences, setEnhancedExperiences] = useState([]);
  const prefersReducedMotion = usePreferReducedMotion();
  
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };
  
  const transition = {
    duration: prefersReducedMotion ? 0 : 0.3,
    ease: [0.25, 0.1, 0.25, 1.0]
  };
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'upload':
        return <ResumeUpload onUpload={data => {
          setResumeData(data);
          handleNext();
        }} />;
      case 'select':
        return <ExperienceSelection 
          experiences={resumeData?.experiences || []} 
          onSelect={setSelectedExperiences} 
        />;
      case 'enhance':
        return <AIEnhancement 
          experiences={selectedExperiences} 
          onEnhance={setEnhancedExperiences} 
        />;
      case 'preview':
        return <ResumePreview 
          resumeData={{
            ...resumeData,
            experiences: enhancedExperiences
          }} 
        />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        {/* Progress indicator */}
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => (
            <div 
              key={step} 
              className={`flex flex-col items-center ${
                index <= currentStep ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200'
              }`}>
                {index + 1}
              </div>
              <span className="text-sm capitalize">{step}</span>
            </div>
          ))}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <motion.div 
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(currentStep / (steps.length - 1)) * 100}%` 
            }}
            transition={transition}
          />
        </div>
      </div>
      
      {/* Step content */}
      <motion.div
        custom={currentStep}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transition}
        className="min-h-[400px]"
      >
        {renderStep()}
      </motion.div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext}>
            {currentStep === 0 ? 'Get Started' : 'Continue'}
          </Button>
        ) : (
          <Button>Download Resume</Button>
        )}
      </div>
    </div>
  );
}
```

## Testing Strategy

### 1. Unit Testing

Test individual animation components:

```tsx
// src/components/ui/animated/AnimatedCard.test.tsx
import { render, screen } from '@testing-library/react';
import { AnimatedCard } from './AnimatedCard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div data-testid="motion-div" {...props}>{children}</div>
  }
}));

describe('AnimatedCard', () => {
  it('renders children correctly', () => {
    render(
      <AnimatedCard>
        <p>Test content</p>
      </AnimatedCard>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
  
  it('renders header and footer when provided', () => {
    render(
      <AnimatedCard
        header={<h2>Test Header</h2>}
        footer={<p>Test Footer</p>}
      >
        <p>Test content</p>
      </AnimatedCard>
    );
    
    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.getByText('Test Footer')).toBeInTheDocument();
  });
});
```

### 2. Integration Testing

Test animation sequences and page transitions:

```tsx
// src/app/(authenticated)/resume-enhancement/ResumeEnhancement.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResumeEnhancementPage from './page';

// Mock hooks and components
jest.mock('@/hooks/usePreferReducedMotion', () => ({
  usePreferReducedMotion: () => false
}));

jest.mock('@/components/resume/ResumeUpload', () => ({
  ResumeUpload: ({ onUpload }) => (
    <button onClick={() => onUpload({ experiences: [] })}>
      Mock Upload
    </button>
  )
}));

describe('ResumeEnhancementPage', () => {
  it('progresses through steps correctly', async () => {
    render(<ResumeEnhancementPage />);
    
    // Initial step (upload)
    expect(screen.getByText('Mock Upload')).toBeInTheDocument();
    
    // Click upload button to move to next step
    fireEvent.click(screen.getByText('Mock Upload'));
    
    // Should now be on select step
    await waitFor(() => {
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });
    
    // Continue to enhance step
    fireEvent.click(screen.getByText('Continue'));
    
    // Should now be on enhance step
    await waitFor(() => {
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });
    
    // Continue to preview step
    fireEvent.click(screen.getByText('Continue'));
    
    // Should now be on final step
    await waitFor(() => {
      expect(screen.getByText('Download Resume')).toBeInTheDocument();
    });
  });
});
```

### 3. Visual Regression Testing

Use Storybook and Chromatic to test animations visually:

```tsx
// src/components/ui/animated/AnimatedCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedCard } from './AnimatedCard';

const meta: Meta<typeof AnimatedCard> = {
  component: AnimatedCard,
  parameters: {
    layout: 'centered',
    chromatic: { delay: 300 } // Wait for animation to complete
  }
};

export default meta;
type Story = StoryObj<typeof AnimatedCard>;

export const Default: Story = {
  args: {
    children: <p className="p-4">Card content</p>
  }
};

export const WithHeaderAndFooter: Story = {
  args: {
    header: <h3 className="text-lg font-semibold">Card Header</h3>,
    children: <p className="p-4">Card content</p>,
    footer: <p className="text-sm text-gray-500">Card Footer</p>
  }
};
```

## Performance Considerations

### 1. Code Splitting

```tsx
// src/app/layout.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Only load animation components when needed
const AnimatedLayout = dynamic(
  () => import('@/components/layout/AnimatedLayout').then(mod => mod.AnimatedLayout),
  {
    ssr: false,
    loading: () => <div>Loading...</div>
  }
);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <AnimatedLayout>{children}</AnimatedLayout>
        </Suspense>
      </body>
    </html>
  );
}
```

### 2. Animation Optimization

```tsx
// src/components/ui/animated/OptimizedAnimation.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface OptimizedAnimationProps {
  children: ReactNode;
}

export function OptimizedAnimation({ children }: OptimizedAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  // Only animate if the component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShouldAnimate(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('animation-container');
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);
  
  // Skip animation if reduced motion is preferred
  if (prefersReducedMotion) {
    return <>{children}</>;
  }
  
  return (
    <div id="animation-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </div>
  );
}
```

## Implementation Timeline

### Phase 1: Foundation (Week 1-2)

1. Set up animation libraries and dependencies
2. Create base animation components
3. Implement global page transitions
4. Create animation hooks and utilities
5. Set up testing framework for animations

### Phase 2: Core User Journeys (Week 3-4)

1. Implement onboarding flow animations
2. Build resume enhancement animation sequence
3. Create job search and application animations
4. Develop interview preparation animations
5. Build offer negotiation animations

### Phase 3: Polish and Optimization (Week 5-6)

1. Implement responsive adjustments
2. Optimize animation performance
3. Add accessibility features
4. Conduct visual regression testing
5. Implement performance monitoring

### Phase 4: Final Integration (Week 7-8)

1. Integrate animations with backend functionality
2. Conduct user testing and gather feedback
3. Refine animations based on feedback
4. Document animation system
5. Final performance optimization
