'use client'

import { Section } from '@/components/ui/section'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SITE_CARD_COLOR, SITE_BORDER_COLOR, SITE_BTN_COLOR } from '@/constants/colors'
import { cn } from '@/lib/utils'
import { ABOUT_CONTENT } from '@/constants/content'
import { CARD_BASE_STYLE, useCardHover } from '@/lib/card-styles'
import { useState, memo, useCallback } from 'react'
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
} from 'lucide-react'

const STAT_CARD_HOVER = { enterSize: '25px', enterGlow: `${SITE_BTN_COLOR}50` }

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
} as const

// Memoized tab button component
const TabButton = memo(function TabButton({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-md border-0 px-4 py-2 text-sm font-medium transition-all duration-300',
        isActive ? 'scale-105' : 'transition-transform duration-300 hover:scale-105'
      )}
      style={{
        backgroundColor: isActive ? SITE_BTN_COLOR : 'transparent',
        color: isActive ? SITE_CARD_COLOR : SITE_BTN_COLOR,
        border: isActive ? 'none' : `1px solid ${SITE_BTN_COLOR}`,
      }}
    >
      {label}
    </button>
  )
})

// Memoized value card component
const ValueCard = memo(function ValueCard({
  value,
}: {
  value: (typeof ABOUT_CONTENT.values)[keyof typeof ABOUT_CONTENT.values]
}) {
  const IconComponent = ICON_MAP[value.icon as keyof typeof ICON_MAP]

  const { handleMouseEnter, handleMouseLeave } = useCardHover()

  return (
    <Card
      className="group border-0 transition-all duration-300 hover:scale-105"
      style={CARD_BASE_STYLE}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div
            className="rounded-lg p-3 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${SITE_BTN_COLOR}20` }}
          >
            <IconComponent
              size={32}
              style={{ color: SITE_BTN_COLOR }}
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
  )
})

// Memoized stat card component
const StatCard = memo(function StatCard({ stat }: { stat: (typeof ABOUT_CONTENT.stats)[number] }) {
  const IconComponent = ICON_MAP[stat.icon as keyof typeof ICON_MAP]

  const { handleMouseEnter, handleMouseLeave } = useCardHover(STAT_CARD_HOVER)

  return (
    <Card
      className="group border-0 transition-all duration-300 hover:scale-110"
      style={CARD_BASE_STYLE}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div
            className="rounded-lg p-3 transition-transform duration-300 group-hover:scale-125"
            style={{ backgroundColor: `${SITE_BTN_COLOR}20` }}
          >
            <IconComponent
              size={32}
              style={{ color: SITE_BTN_COLOR }}
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
  )
})

// Memoized journey item component
const JourneyItem = memo(function JourneyItem({
  item,
}: {
  item: (typeof ABOUT_CONTENT.journey)[number]
}) {
  const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP]

  return (
    <div className="relative flex items-start gap-6">
      {/* Timeline dot with icon */}
      <div
        className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-0 hover:scale-105"
        style={{
          backgroundColor: SITE_CARD_COLOR,
          boxShadow: `0 0 0 2px ${SITE_BORDER_COLOR}, 0 0 15px ${SITE_BTN_COLOR}60`,
        }}
      >
        <IconComponent size={24} style={{ color: SITE_BTN_COLOR }} />
      </div>

      <Card
        className="group flex-1 border-0 transition-all duration-300 hover:scale-102"
        style={CARD_BASE_STYLE}
      >
        <CardContent className="p-6">
          <div className="mb-2 flex items-center gap-3">
            <Badge
              variant="secondary"
              style={{ backgroundColor: SITE_BTN_COLOR, color: SITE_CARD_COLOR }}
            >
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
  )
})

// Hoisted static derivations — ABOUT_CONTENT is a const, so these
// never change and do not need to be recomputed or memoized per render.
const VALUES_ENTRIES = Object.entries(ABOUT_CONTENT.values)

const JOURNEY_ITEMS = ABOUT_CONTENT.journey

const STATS_ITEMS = ABOUT_CONTENT.stats

// Main component with optimizations
export const AboutSection = memo(function AboutSection() {
  const [activeTab, setActiveTab] = useState<'overview' | 'journey'>('overview')

  const handleOverviewClick = useCallback(() => setActiveTab('overview'), [])
  const handleJourneyClick = useCallback(() => setActiveTab('journey'), [])

  const tabs = [
    { id: 'overview' as const, label: 'Overview', onClick: handleOverviewClick },
    { id: 'journey' as const, label: 'Journey', onClick: handleJourneyClick },
  ]

  return (
    <Section id="about">
      <Typography variant="h2" align="center" color="primary" gutterBottom>
        About Me
      </Typography>

      {/* Tab Navigation */}
      <div className="mb-4 flex justify-center">
        <div
          className="flex gap-2 rounded-lg p-1"
          style={{ backgroundColor: `${SITE_CARD_COLOR}80` }}
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
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
            </div>

            {/* Overview Cards - Hidden on small screens */}
            <div className="hidden gap-6 sm:gap-8 md:grid md:grid-cols-3">
              {VALUES_ENTRIES.map(([key, value]) => (
                <ValueCard key={key} value={value} />
              ))}
            </div>

            {/* Stats Cards - Always visible */}
            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
              {STATS_ITEMS.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>
          </div>
        )}

        {/* Journey Tab */}
        {activeTab === 'journey' && (
          <div className="mx-auto max-w-4xl">
            <div className="relative">
              {/* Timeline line */}
              <div
                className="absolute top-0 bottom-0 left-8 w-0.5"
                style={{ backgroundColor: SITE_BORDER_COLOR }}
              />

              <div className="space-y-8">
                {JOURNEY_ITEMS.map((item) => (
                  <JourneyItem key={item.title} item={item} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  )
})
