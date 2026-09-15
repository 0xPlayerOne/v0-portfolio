import { Section } from '@/components/ui/section'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ABOUT_CONTENT } from '@/constants/content'
import { useCardHover } from '@/lib/card-styles'
import { useState, memo } from 'react'
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

const STAT_CARD_HOVER = { enterSize: '25px', enterGlow: 'var(--color-site-btn-50)' }

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
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        'rounded-md px-4 py-2 text-sm font-medium transition-all duration-300',
        isActive
          ? 'scale-105 border-0 bg-site-btn text-site-card'
          : 'border border-site-btn bg-transparent text-site-btn hover:scale-105'
      )}
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
      variant="site"
      className="group hover:scale-105"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-site-btn-20 rounded-lg p-3 transition-transform duration-300 group-hover:scale-110">
            <IconComponent
              size={32}
              className="text-site-btn transition-transform duration-300 group-hover:rotate-12"
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
      variant="site"
      className="group hover:scale-110"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-site-btn-20 rounded-lg p-3 transition-transform duration-300 group-hover:scale-125">
            <IconComponent
              size={32}
              className="text-site-btn transition-transform duration-300 group-hover:rotate-12"
            />
          </div>
        </div>
        <Typography
          variant="h2"
          align="center"
          color="primary"
          className="group-hover:glow-text mb-2 transition-all duration-300"
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
      <div className="bg-site-card glow-dot flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-0 hover:scale-105">
        <IconComponent size={24} className="text-site-btn" />
      </div>

      <Card variant="site" className="group flex-1 hover:scale-102">
        <CardContent className="p-6">
          <div className="mb-2 flex items-center gap-3">
            <Badge variant="site">{item.year}</Badge>
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

// Static content references — ABOUT_CONTENT is a frozen import, no need for useMemo.
// Tabs are static; inline handlers keep the component at a single hook (useState).

// Main component with optimizations
export const AboutSection = memo(function AboutSection() {
  const [activeTab, setActiveTab] = useState<'overview' | 'journey'>('overview')

  return (
    <Section id="about">
      <Typography variant="h2" align="center" color="primary" gutterBottom>
        About Me
      </Typography>

      {/* Tab Navigation */}
      <div className="mb-4 flex justify-center">
        <div className="bg-site-card-80 flex gap-2 rounded-lg p-1">
          <TabButton
            label="Overview"
            isActive={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            label="Journey"
            isActive={activeTab === 'journey'}
            onClick={() => setActiveTab('journey')}
          />
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
              {Object.entries(ABOUT_CONTENT.values).map(([key, value]) => (
                <ValueCard key={key} value={value} />
              ))}
            </div>

            {/* Stats Cards - Always visible */}
            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
              {ABOUT_CONTENT.stats.map((stat) => (
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
              <div className="bg-site-border absolute top-0 bottom-0 left-8 w-0.5" />

              <div className="space-y-8">
                {ABOUT_CONTENT.journey.map((item) => (
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
