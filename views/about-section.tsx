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
} from "lucide-react";

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
  "chart-no-axes-combined": ChartNoAxesCombined,
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
        "px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 border-0",
        isActive
          ? "scale-105"
          : "hover:scale-105 transition-transform duration-300",
      )}
      style={{
        backgroundColor: isActive ? SITE_BTN_COLOR : "transparent",
        color: isActive ? SITE_CARD_COLOR : SITE_BTN_COLOR,
        border: isActive ? "none" : `1px solid ${SITE_BTN_COLOR}`,
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
  keyId: string;
  value: (typeof ABOUT_CONTENT.values)[keyof typeof ABOUT_CONTENT.values];
}) {
  const IconComponent = ICON_MAP[value.icon as keyof typeof ICON_MAP];

  // Memoize the card style
  const cardStyle = useMemo(
    () => ({
      backgroundColor: SITE_CARD_COLOR,
      boxShadow: `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`,
    }),
    [],
  );

  // Memoize the icon container style
  const iconContainerStyle = useMemo(
    () => ({
      backgroundColor: `${SITE_BTN_COLOR}20`,
    }),
    [],
  );

  // Memoize the icon style
  const iconStyle = useMemo(
    () => ({
      color: SITE_BTN_COLOR,
    }),
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

  return (
    <Card
      key={keyId}
      className="group transition-all duration-300 hover:scale-105 border-0"
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="text-center p-6">
        <div className="mb-4 flex justify-center">
          <div
            className="p-3 rounded-lg group-hover:scale-110 transition-transform duration-300"
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
const StatCard = memo(function StatCard({
  stat,
}: {
  stat: (typeof ABOUT_CONTENT.stats)[number];
}) {
  const IconComponent = ICON_MAP[stat.icon as keyof typeof ICON_MAP];

  // Memoize the card style
  const cardStyle = useMemo(
    () => ({
      backgroundColor: SITE_CARD_COLOR,
      boxShadow: `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`,
    }),
    [],
  );

  // Memoize the icon container style
  const iconContainerStyle = useMemo(
    () => ({
      backgroundColor: `${SITE_BTN_COLOR}20`,
    }),
    [],
  );

  // Memoize the icon style
  const iconStyle = useMemo(
    () => ({
      color: SITE_BTN_COLOR,
    }),
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

  return (
    <Card
      className="group transition-all duration-300 hover:scale-110 border-0"
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="text-center p-6">
        <div className="mb-4 flex justify-center">
          <div
            className="p-3 rounded-lg group-hover:scale-125 transition-transform duration-300"
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
          className="mb-2 group-hover:text-glow transition-all duration-300"
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
  item: (typeof ABOUT_CONTENT.journey)[number];
}) {
  const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];

  // Memoize the timeline dot style
  const timelineDotStyle = useMemo(
    () => ({
      backgroundColor: SITE_CARD_COLOR,
      boxShadow: `0 0 0 2px ${SITE_BORDER_COLOR}, 0 0 15px ${SITE_BTN_COLOR}60`,
    }),
    [],
  );

  // Memoize the card style
  const cardStyle = useMemo(
    () => ({
      backgroundColor: SITE_CARD_COLOR,
      boxShadow: `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`,
    }),
    [],
  );

  // Memoize the badge style
  const badgeStyle = useMemo(
    () => ({
      backgroundColor: SITE_BTN_COLOR,
      color: SITE_CARD_COLOR,
    }),
    [],
  );

  // Memoize the icon style
  const iconStyle = useMemo(
    () => ({
      color: SITE_BTN_COLOR,
    }),
    [],
  );

  return (
    <div className="relative flex items-start gap-6">
      {/* Timeline dot with icon */}
      <div
        className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center border-0 hover:scale-105"
        style={timelineDotStyle}
      >
        <IconComponent size={24} style={iconStyle} />
      </div>

      <Card
        className="flex-1 group transition-all duration-300 hover:scale-102 border-0"
        style={cardStyle}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
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
  const [activeTab, setActiveTab] = useState<"overview" | "journey" | "stats">(
    "overview",
  );

  // Memoize the tab container style
  const tabContainerStyle = useMemo(
    () => ({
      backgroundColor: `${SITE_CARD_COLOR}80`,
    }),
    [],
  );

  // Memoize the timeline line style
  const timelineLineStyle = useMemo(
    () => ({
      backgroundColor: SITE_BORDER_COLOR,
    }),
    [],
  );

  // Memoize tab click handlers
  const handleOverviewClick = useCallback(() => setActiveTab("overview"), []);
  const handleJourneyClick = useCallback(() => setActiveTab("journey"), []);

  // Memoize the tabs array
  const tabs = useMemo(
    () => [
      { id: "overview", label: "Overview", onClick: handleOverviewClick },
      { id: "journey", label: "Journey", onClick: handleJourneyClick },
    ],
    [handleOverviewClick, handleJourneyClick],
  );

  // Memoize the values entries to prevent recreation on each render
  const valuesEntries = useMemo(() => Object.entries(ABOUT_CONTENT.values), []);

  // Memoize the journey items to prevent recreation on each render
  const journeyItems = useMemo(() => ABOUT_CONTENT.journey, []);

  // Memoize the stats items to prevent recreation on each render
  const statsItems = useMemo(() => ABOUT_CONTENT.stats, []);

  return (
    <Section id="about">
      <Typography variant="h2" align="center" color="primary" gutterBottom>
        About Me
      </Typography>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-4">
        <div className="flex gap-2 p-1 rounded-lg" style={tabContainerStyle}>
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

      <div className="max-w-6xl mx-auto">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="text-center max-w-4xl mx-auto">
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
            <div className={cn("hidden md:grid md:grid-cols-3 gap-6 sm:gap-8")}>
              {valuesEntries.map(([key, value]) => (
                <ValueCard key={key} keyId={key} value={value} />
              ))}
            </div>

            {/* Stats Cards - Always visible */}
            <div
              className={cn("grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8")}
            >
              {statsItems.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>
          </div>
        )}

        {/* Journey Tab */}
        {activeTab === "journey" && (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div
                className="absolute left-8 top-0 bottom-0 w-0.5"
                style={timelineLineStyle}
              />

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
