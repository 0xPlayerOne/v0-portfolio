<<<<<<< HEAD
'use client'

import type React from 'react'
import { useEffect, useState, useCallback, memo, useMemo } from 'react'
import { NAVBAR_HEIGHT } from '@/constants/navigation'
import { SITE_BG_COLOR, SITE_TEXT_COLOR, SITE_BORDER_COLOR } from '@/constants/colors'
import { cn } from '@/lib/utils'
=======
"use client";

import type React from "react";
import { useEffect, useState, useCallback, memo, useMemo } from "react";
import { NAVBAR_HEIGHT } from "@/constants/navigation";
import {
  SITE_BG_COLOR,
  SITE_TEXT_COLOR,
  SITE_BORDER_COLOR,
} from "@/constants/colors";
import { cn } from "@/lib/utils";
>>>>>>> origin/staging

interface SectionProps {
  id: string;
  children: React.ReactNode;
}

// Memoize the Section component to prevent unnecessary re-renders
export const Section = memo(function Section({ id, children }: SectionProps) {
<<<<<<< HEAD
  const [sectionHeight, setSectionHeight] = useState('auto')
=======
  const [sectionHeight, setSectionHeight] = useState("auto");
>>>>>>> origin/staging

  // Optimize the height update function with useCallback
  const updateHeight = useCallback(() => {
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      // Use min-height instead of fixed height for better mobile experience
      const minHeight = Math.max(600, window.innerHeight - NAVBAR_HEIGHT);
      setSectionHeight(`${minHeight}px`);
    });
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    updateHeight()
=======
    updateHeight();
>>>>>>> origin/staging

    // Throttle resize events for better performance
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
<<<<<<< HEAD
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(updateHeight, 100)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [updateHeight])
=======
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateHeight, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateHeight]);
>>>>>>> origin/staging

  // Memoize the style object to prevent recreation on each render
  const sectionStyle = useMemo(
    () => ({
      minHeight: sectionHeight,
      backgroundColor: SITE_BG_COLOR,
      color: SITE_TEXT_COLOR,
      boxShadow: `0 0 0 1px ${SITE_BORDER_COLOR}20, 0 0 5px ${SITE_BORDER_COLOR}30`,
    }),
<<<<<<< HEAD
    [sectionHeight]
  )
=======
    [sectionHeight],
  );
>>>>>>> origin/staging

  return (
    <section
      id={id}
<<<<<<< HEAD
      className={cn('flex items-center justify-center border-0 py-8 sm:py-12 md:py-16')}
=======
      className={cn(
        "flex items-center justify-center py-8 sm:py-12 md:py-16 border-0",
      )}
>>>>>>> origin/staging
      style={sectionStyle}
    >
      <div className="container mx-auto w-full px-4">{children}</div>
    </section>
  );
});
