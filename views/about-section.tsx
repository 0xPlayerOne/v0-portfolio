<<<<<<< HEAD
'use client'

import { Section } from '@/components/ui/section'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SITE_CARD_COLOR, SITE_BORDER_COLOR, SITE_BTN_COLOR } from '@/constants/colors'
import { cn } from '@/lib/utils'
import { ABOUT_CONTENT } from '@/constants/content'
import { useState, useMemo, memo, useCallback } from 'react'
=======
"use client";

import { Section } from "@/components/ui/section";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SITE_CARD_COLOR,
  SITE_BORDER_COLOR,
  SITE_BTN_COLOR,
} from "@/constants/colors";
import { cn } from "@/lib/utils";
import { ABOUT_CONTENT } from "@/constants/content";
import { useState, useMemo, memo, useCallback } from "react";
>>>>>>> origin/staging
import {
  Zap,
  Rocket,
  Users,
  Building,
  Code,
  Blocks,
  Lightbulb,
  Gamepad2,
  FlaskRoundIcon as Flask,
  BarChartIcon as ChartNoAxesCombined,
  Eye,
<<<<<<< HEAD
} from 'lucide-react'
=======
} from "lucide-react";
>>>>>>> origin/staging

// Memoize the icon map to prevent recreation on each render
const ICON_MAP = {
  zap: Zap,
  rocket: Rocket,
  users: Users,
  building: Building,
  code: Code,
  blocks: Blocks,
  lightbulb: Lightbulb,
  gamepad2: Gamepad2,
  flask: Flask,
  'chart-no-axes-combined': ChartNoAxesCombined,
  eye: Eye,
} as const;

// Memoized tab button component
const TabButton = memo(function TabButton({
  id: _id,
  label,
  isActive,
  onClick,
}: {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
<<<<<<< HEAD
        'rounded-md border-0 px-4 py-2 text-sm font-medium transition-all duration-300',
        isActive ? 'scale-105' : 'transition-transform duration-300 hover:scale-105'
=======
        "px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 border-0",
        isActive
          ? "scale-105"
          : "hover:scale-105 transition-transform duration-300",
>>>>>>> origin/staging
      )}
      style={{
        backgroundColor: isActive ? SITE_BTN_COLOR : 'transparent',
        color: isActive ? SITE_CARD_COLOR : SITE_BTN_COLOR,
        border: isActive ? 'none' : `1px solid ${SITE_BTN_COLOR}`,
      }}
    >
      {label}
    </button>
  );
});

// Memoized value card component
const ValueCard = memo(function ValueCard({
  keyId,
  value,
}: {
<<<<<<< HEAD
  keyId: string
  value: (typeof ABOUT_CONTENT.values)[keyof typeof ABOUT_CONTENT.values]
}) {
  const IconComponent = ICON_MAP[value.icon as keyof typeof ICON_MAP]
=======
  keyId: string;
  value: (typeof ABOUT_CONTENT.values)[keyof typeof ABOUT_CONTENT.values];
}) {
  const IconComponent = ICON_MAP[value.icon as keyof typeof ICON_MAP];
>>>>>>> origin/staging

  // Memoize the card style
  const cardStyle = useMemo(
    () => ({
      backgroundColor: SITE_CARD_COLOR,
      boxShadow: `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`,
    }),
<<<<<<< HEAD
    []
  )
=======
    [],
  );
>>>>>>> origin/staging

  // Memoize the icon container style
  const iconContainerStyle = useMemo(
    () => ({
      backgroundColor: `${SITE_BTN_COLOR}20`,
    }),
<<<<<<< HEAD
    []
  )
=======
    [],
  );
>>>>>>> origin/staging

  // Memoize the icon style
  const iconStyle = useMemo(
    () => ({
      color: SITE_BTN_COLOR,
    }),
<<<<<<< HEAD
    []
  )

  // Optimize mouse event handlers
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 20px ${SITE_BTN_COLOR}40`
  }, [])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`
  }, [])
=======
    [],
  );

  // Optimize mouse event handlers
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 20px ${SITE_BTN_COLOR}40`;
    },
    [],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`;
    },
    [],
  );
>>>>>>> origin/staging

  return (
    <Card
      key={keyId}
      className="group border-0 transition-all duration-300 hover:scale-105"
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div
            className="rounded-lg p-3 transition-transform duration-300 group-hover:scale-110"
            style={iconContainerStyle}
          >
            <IconComponent
              size={32}
              style={iconStyle}
              className="transition-transform duration-300 group-hover:rotate-12"
            />
          </div>
        </div>
        <Typography variant="h3" align="center" color="secondary" gutterBottom>
          {value.title}
        </Typography>
        <Typography variant="body2" align="center">
          {value.description}
        </Typography>
      </CardContent>
    </Card>
  );
});

// Memoized stat card component
<<<<<<< HEAD
const StatCard = memo(function StatCard({ stat }: { stat: (typeof ABOUT_CONTENT.stats)[number] }) {
  const IconComponent = ICON_MAP[stat.icon as keyof typeof ICON_MAP]
=======
const StatCard = memo(function StatCard({
  stat,
}: {
  stat: (typeof ABOUT_CONTENT.stats)[number];
}) {
  const IconComponent = ICON_MAP[stat.icon as keyof typeof ICON_MAP];
>>>>>>> origin/staging

  // Memoize the card style
  const cardStyle = useMemo(
    () => ({
      backgroundColor: SITE_CARD_COLOR,
      boxShadow: `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`,
    }),
<<<<<<< HEAD
    []
  )
=======
    [],
  );
>>>>>>> origin/staging

  // Memoize the icon container style
  const iconContainerStyle = useMemo(
    () => ({
      backgroundColor: `${SITE_BTN_COLOR}20`,
    }),
<<<<<<< HEAD
    []
  )
=======
    [],
  );
>>>>>>> origin/staging

  // Memoize the icon style
  const iconStyle = useMemo(
    () => ({
      color: SITE_BTN_COLOR,
    }),
<<<<<<< HEAD
    []
  )

  // Optimize mouse event handlers
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 25px ${SITE_BTN_COLOR}50`
  }, [])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`
  }, [])
=======
    [],
  );

  // Optimize mouse event handlers
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 25px ${SITE_BTN_COLOR}50`;
    },
    [],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`;
    },
    [],
  );
>>>>>>> origin/staging

  return (
    <Card
      className="group border-0 transition-all duration-300 hover:scale-110"
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div
            className="rounded-lg p-3 transition-transform duration-300 group-hover:scale-125"
            style={iconContainerStyle}
          >
            <IconComponent
              size={32}
              style={iconStyle}
              className="transition-transform duration-300 group-hover:rotate-12"
            />
          </div>
        </div>
        <Typography
          variant="h2"
          align="center"
          color="primary"
          className="group-hover:text-glow mb-2 transition-all duration-300"
        >
          {stat.value}
        </Typography>
        <Typography variant="body2" align="center" color="secondary">
          {stat.label}
        </Typography>
      </CardContent>
    </Card>
  );
});

// Memoized journey item component
const JourneyItem = memo(function JourneyItem({
  item,
}: {
<<<<<<< HEAD
  item: (typeof ABOUT_CONTENT.journey)[number]
}) {
  const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP]
=======
  item: (typeof ABOUT_CONTENT.journey)[number];
}) {
  const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];
>>>>>>> origin/staging

  // Memoize the timeline dot style
  const timelineDotStyle = useMemo(
    () => ({
      backgroundColor: SITE_CARD_COLOR,
      boxShadow: `0 0 0 2px ${SITE_BORDER_COLOR}, 0 0 15px ${SITE_BTN_COLOR}60`,
    }),
<<<<<<< HEAD
    []
  )
=======
    [],
  );
>>>>>>> origin/staging

  // Memoize the card style
  const cardStyle = useMemo(
    () => ({
      backgroundColor: SITE_CARD_COLOR,
      boxShadow: `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`,
    }),
<<<<<<< HEAD
    []
  )
=======
    [],
  );
>>>>>>> origin/staging

  // Memoize the badge style
  const badgeStyle = useMemo(
    () => ({
      backgroundColor: SITE_BTN_COLOR,
      color: SITE_CARD_COLOR,
    }),
<<<<<<< HEAD
    []
  )
=======
    [],
  );
>>>>>>> origin/staging

  // Memoize the icon style
  const iconStyle = useMemo(
    () => ({
      color: SITE_BTN_COLOR,
    }),
<<<<<<< HEAD
    []
  )
=======
    [],
  );
>>>>>>> origin/staging

  return (
    <div className="relative flex items-start gap-6">
      {/* Timeline dot with icon */}
      <div
        className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-0 hover:scale-105"
        style={timelineDotStyle}
      >
        <IconComponent size={24} style={iconStyle} />
      </div>

      <Card
        className="hover:scale-102 group flex-1 border-0 transition-all duration-300"
        style={cardStyle}
      >
        <CardContent className="p-6">
<<<<<<< HEAD
          <div className="mb-2 flex items-center gap-3">
=======
          <div className="flex items-center gap-3 mb-2">
>>>>>>> origin/staging
            <Badge variant="secondary" style={badgeStyle}>
              {item.year}
            </Badge>
            <Typography variant="h3" color="secondary">
              {item.title}
            </Typography>
          </div>
          <Typography variant="body2">{item.description}</Typography>
        </CardContent>
      </Card>
    </div>
  );
});

// Main component with optimizations
export const AboutSection = memo(function AboutSection() {
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState<'overview' | 'journey' | 'stats'>('overview')
=======
  const [activeTab, setActiveTab] = useState<"overview" | "journey" | "stats">(
    "overview",
  );
>>>>>>> origin/staging

  // Memoize the tab container style
  const tabContainerStyle = useMemo(
    () => ({
      backgroundColor: `${SITE_CARD_COLOR}80`,
    }),
<<<<<<< HEAD
    []
  )
=======
    [],
  );
>>>>>>> origin/staging

  // Memoize the timeline line style
  const timelineLineStyle = useMemo(
    () => ({
      backgroundColor: SITE_BORDER_COLOR,
    }),
<<<<<<< HEAD
    []
  )

  // Memoize tab click handlers
  const handleOverviewClick = useCallback(() => setActiveTab('overview'), [])
  const handleJourneyClick = useCallback(() => setActiveTab('journey'), [])
=======
    [],
  );

  // Memoize tab click handlers
  const handleOverviewClick = useCallback(() => setActiveTab("overview"), []);
  const handleJourneyClick = useCallback(() => setActiveTab("journey"), []);
>>>>>>> origin/staging

  // Memoize the tabs array
  const tabs = useMemo(
    () => [
<<<<<<< HEAD
      { id: 'overview', label: 'Overview', onClick: handleOverviewClick },
      { id: 'journey', label: 'Journey', onClick: handleJourneyClick },
    ],
    [handleOverviewClick, handleJourneyClick]
  )

  // Memoize the values entries to prevent recreation on each render
  const valuesEntries = useMemo(() => Object.entries(ABOUT_CONTENT.values), [])

  // Memoize the journey items to prevent recreation on each render
  const journeyItems = useMemo(() => ABOUT_CONTENT.journey, [])
=======
      { id: "overview", label: "Overview", onClick: handleOverviewClick },
      { id: "journey", label: "Journey", onClick: handleJourneyClick },
    ],
    [handleOverviewClick, handleJourneyClick],
  );

  // Memoize the values entries to prevent recreation on each render
  const valuesEntries = useMemo(() => Object.entries(ABOUT_CONTENT.values), []);

  // Memoize the journey items to prevent recreation on each render
  const journeyItems = useMemo(() => ABOUT_CONTENT.journey, []);
>>>>>>> origin/staging

  // Memoize the stats items to prevent recreation on each render
  const statsItems = useMemo(() => ABOUT_CONTENT.stats, []);

  return (
    <Section id="about">
      <Typography variant="h2" align="center" color="primary" gutterBottom>
        About Me
      </Typography>

      {/* Tab Navigation */}
      <div className="mb-4 flex justify-center">
        <div className="flex gap-2 rounded-lg p-1" style={tabContainerStyle}>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={tab.onClick}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="mx-auto max-w-4xl text-center">
              <Typography variant="body1" align="center" gutterBottom>
                {ABOUT_CONTENT.intro}
              </Typography>
              {ABOUT_CONTENT.mission ? (
                <Typography variant="body1" align="center" gutterBottom>
                  {ABOUT_CONTENT.mission}
                </Typography>
              ) : null}
            </div>

            {/* Overview Cards - Hidden on small screens */}
            <div className={cn('hidden gap-6 sm:gap-8 md:grid md:grid-cols-3')}>
              {valuesEntries.map(([key, value]) => (
                <ValueCard key={key} keyId={key} value={value} />
              ))}
            </div>

            {/* Stats Cards - Always visible */}
<<<<<<< HEAD
            <div className={cn('grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4')}>
=======
            <div
              className={cn("grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8")}
            >
>>>>>>> origin/staging
              {statsItems.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>
          </div>
        )}

        {/* Journey Tab */}
        {activeTab === 'journey' && (
          <div className="mx-auto max-w-4xl">
            <div className="relative">
              {/* Timeline line */}
<<<<<<< HEAD
              <div className="absolute bottom-0 left-8 top-0 w-0.5" style={timelineLineStyle} />
=======
              <div
                className="absolute left-8 top-0 bottom-0 w-0.5"
                style={timelineLineStyle}
              />
>>>>>>> origin/staging

              <div className="space-y-8">
                {journeyItems.map((item, index) => (
                  <JourneyItem key={index} item={item} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
});
