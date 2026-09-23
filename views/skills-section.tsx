import { Section } from '@/components/ui/section'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { SKILLS_DATA } from '@/constants/content'
import { Code2, Gamepad2, Users, Briefcase, Palette, Blocks } from 'lucide-react'

const SKILL_ICONS = {
  'Web & Full-Stack': Code2,
  'Game Development': Gamepad2,
  'Blockchain / Web3': Blocks,
  Business: Briefcase,
  Leadership: Users,
  Product: Palette,
} as const

// Precomputed on module scope — SKILLS_DATA is a frozen const, so these
// values never change at runtime and need not be recalculated per render.
const SKILL_AVG_LEVELS = SKILLS_DATA.map((group) =>
  Math.round(group.skills.reduce((sum, skill) => sum + skill.level, 0) / group.skills.length)
)

export function SkillsSection() {
  return (
    <Section id="skills">
      <Typography variant="h2" align="center" color="primary" gutterBottom>
        Skills & Expertise
      </Typography>
      <div className="mx-auto mt-8 max-w-6xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {SKILLS_DATA.map((skillGroup, index) => {
            const IconComponent = SKILL_ICONS[skillGroup.category as keyof typeof SKILL_ICONS]

            return (
              <Card
                key={skillGroup.category}
                variant="site"
                className="group hover:scale-105 hover:shadow-lg"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    {IconComponent && (
                      <div className="bg-site-btn-20 rounded-lg p-2 transition-colors duration-300 group-hover:scale-110">
                        <IconComponent
                          size={24}
                          className="text-site-btn transition-transform duration-300 group-hover:rotate-12"
                        />
                      </div>
                    )}
                    <Typography variant="h3" color="secondary">
                      {skillGroup.category}
                    </Typography>
                  </div>

                  <div className="space-y-3">
                    {skillGroup.skills.map((skill) => {
                      const filledDots = Math.round((skill.level / 100) * 5)
                      return (
                        <div key={skill.name} className="group/skill">
                          <div className="mb-1 flex items-center justify-between">
                            <Typography variant="body2" className="font-medium">
                              {skill.name}
                            </Typography>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    'h-2 w-2 rounded-full transition-all duration-300',
                                    i < filledDots ? 'bg-site-btn' : 'bg-site-text-30'
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="bg-site-text-20 h-1 rounded-full transition-all duration-500 group-hover/skill:h-2">
                            <div
                              className="bg-site-btn glow-bar h-full w-(--skill-level) rounded-full transition-all duration-700 ease-out"
                              style={{ '--skill-level': `${skill.level}%` } as CSSProperties}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-site-border-40 mt-4 border-t pt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-site-text">{skillGroup.skills.length} core skills</span>
                      <span className="bg-site-btn-20 rounded px-2 py-1 font-mono">
                        <Typography variant="caption" color="textSecondary">
                          LVL {SKILL_AVG_LEVELS[index]}
                        </Typography>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
