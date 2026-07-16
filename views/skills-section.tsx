"use client"

import { Section } from "@/components/ui/section"
import { Typography } from "@/components/ui/typography"
import { Card, CardContent } from "@/components/ui/card"
import { SITE_TEXT_COLOR, SITE_CARD_COLOR, SITE_BORDER_COLOR, SITE_BTN_COLOR } from "@/constants/colors"
import { cn } from "@/lib/utils"
import { SKILLS_DATA } from "@/constants/content"
import { Code2, Gamepad2, Users, Briefcase, Palette, Blocks } from "lucide-react"

const SKILL_ICONS = {
  "Web & Full-Stack": Code2,
  "Game Development": Gamepad2,
  "Blockchain / Web3": Blocks,
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
      <div className="max-w-6xl mx-auto mt-8">
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8")}>
          {SKILLS_DATA.map((skillGroup, index) => {
            const IconComponent = SKILL_ICONS[skillGroup.category as keyof typeof SKILL_ICONS]
            const skills: ReadonlyArray<{ name: string; level: number }> = skillGroup.skills
            const avgLevel = Math.round(
              skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length,
            )

            return (
              <Card
                key={index}
                className="group transition-all duration-300 hover:scale-105 hover:shadow-lg border-0"
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
                  <div className="flex items-center gap-3 mb-4">
                    {IconComponent && (
                      <div
                        className="p-2 rounded-lg transition-colors duration-300 group-hover:scale-110"
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
                          <div className={cn("flex items-center justify-between mb-1")}>
                            <Typography variant="body2" className="font-medium">
                              {skill.name}
                            </Typography>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-2 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    backgroundColor: i < filledDots ? SITE_BTN_COLOR : `${SITE_TEXT_COLOR}30`,
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

                  <div className="mt-4 pt-4 border-t" style={{ borderColor: `${SITE_BORDER_COLOR}40` }}>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: SITE_TEXT_COLOR }}>{skills.length} core skills</span>
                      <span className="px-2 py-1 rounded font-mono" style={{ backgroundColor: `${SITE_BTN_COLOR}20` }}>
                        <Typography variant="caption" color="textSecondary">LVL {avgLevel}</Typography>
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
