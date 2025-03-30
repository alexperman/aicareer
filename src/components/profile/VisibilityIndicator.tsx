import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { User, Globe, Lock } from 'lucide-react';

interface VisibilityIndicatorProps {
  visibility: 'public' | 'private';
  showEmail: boolean;
  showLocation: boolean;
  showSocialLinks: boolean;
}

export function VisibilityIndicator({
  visibility,
  showEmail,
  showLocation,
  showSocialLinks,
}: VisibilityIndicatorProps) {
  const [tooltipContent, setTooltipContent] = useState<string>('');

  useEffect(() => {
    const content = [];

    if (visibility === 'public') {
      content.push('Profile is publicly visible');
    } else {
      content.push('Profile is private');
    }

    if (showEmail) {
      content.push('Email is visible');
    } else {
      content.push('Email is private');
    }

    if (showLocation) {
      content.push('Location is visible');
    } else {
      content.push('Location is private');
    }

    if (showSocialLinks) {
      content.push('Social links are visible');
    } else {
      content.push('Social links are private');
    }

    setTooltipContent(content.join('\n'));
  }, [visibility, showEmail, showLocation, showSocialLinks]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {visibility === 'public' ? (
                <>
                  <Globe className="h-4 w-4 text-green-500 inline" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-gray-500 inline" />
                  Private
                </>
              )}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
