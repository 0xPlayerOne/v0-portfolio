'use client'

import { Section } from '@/components/ui/section'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import {
  SITE_TEXT_COLOR,
  SITE_CARD_COLOR,
  SITE_BORDER_COLOR,
  SITE_BTN_COLOR,
} from '@/constants/colors'
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

export function SkillsSection() {
  return (
    <Section id="skills">
      <Typography variant="h2" align="center" color="primary" gutterBottom>
        Skills & Expertise
      </Typography>
      <div className="mx-auto mt-8 max-w-6xl">
        <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3')}>
          {SKILLS_DATA.map((skillGroup, index) => {
            const IconComponent = SKILL_ICONS[skillGroup.category as keyof typeof SKILL_ICONS]
            const skills: ReadonlyArray<{ name: string; level: number }> = skillGroup.skills
            const avgLevel = Math.round(
              skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length
            )

            return (
              <Card
                key={index}
                className="group border-0 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: SITE_CARD_COLOR,
                  boxShadow: `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 20px ${SITE_BTN_COLOR}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`
                }}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    {IconComponent && (
                      <div
                        className="rounded-lg p-2 transition-colors duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${SITE_BTN_COLOR}20` }}
                      >
                        <IconComponent
                          size={24}
                          style={{ color: SITE_BTN_COLOR }}
                          className="transition-transform duration-300 group-hover:rotate-12"
                        />
                      </div>
                    )}
                    <Typography variant="h3" color="secondary">
                      {skillGroup.category}
                    </Typography>
                  </div>

                  <div className="space-y-3">
                    {skills.map((skill, skillIndex) => {
                      const filledDots = Math.round((skill.level / 100) * 5)
                      return (
                        <div key={skillIndex} className="group/skill">
                          <div className={cn('mb-1 flex items-center justify-between')}>
                            <Typography variant="body2" className="font-medium">
                              {skill.name}
                            </Typography>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="h-2 w-2 rounded-full transition-all duration-300"
                                  style={{
                                    backgroundColor:
                                      i < filledDots ? SITE_BTN_COLOR : `${SITE_TEXT_COLOR}30`,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          <div
                            className="h-1 rounded-full transition-all duration-500 group-hover/skill:h-2"
                            style={{ backgroundColor: `${SITE_TEXT_COLOR}20` }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{
                                backgroundColor: SITE_BTN_COLOR,
                                width: `${skill.level}%`,
                                boxShadow: `0 0 8px ${SITE_BTN_COLOR}60`,
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div
                    className="mt-4 border-t pt-4"
                    style={{ borderColor: `${SITE_BORDER_COLOR}40` }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: SITE_TEXT_COLOR }}>{skills.length} core skills</span>
                      <span
                        className="rounded px-2 py-1 font-mono"
                        style={{ backgroundColor: `${SITE_BTN_COLOR}20` }}
                      >
                        <Typography variant="caption" color="textSecondary">
                          LVL {avgLevel}
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
