import { Gamepad2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'

import { GAME_CREDITS } from '@/constants/content'
import { MOBY_GAMES_LINK } from '@/constants/links'
import { SITE_CARD_COLOR, SITE_BORDER_COLOR, SITE_BTN_COLOR } from '@/constants/colors'

const GameCreditsCard = () => {
  return (
    <Card
      className="group relative w-full max-w-6xl border-0 transition-all duration-300 hover:scale-105 lg:max-w-2xl"
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
      <CardContent className="p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div
            className="rounded-lg p-2 transition-colors duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${SITE_BTN_COLOR}20` }}
          >
            <Gamepad2
              size={24}
              style={{ color: SITE_BTN_COLOR }}
              className="transition-transform duration-300 group-hover:rotate-12"
            />
          </div>
          <Typography variant="h3" color="secondary">
            Game Credits
          </Typography>
        </div>

        <div className="mb-6">
          {GAME_CREDITS.map((credit, index) => (
            <div key={index} className="my-2 flex items-center justify-between">
              <a
                href={credit.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-3 min-w-0 flex-1 transition-transform duration-300 hover:scale-105"
                style={{ textDecoration: 'none' }}
              >
                <Typography variant="body1" className="truncate">
                  {credit.title}
                </Typography>
              </a>
              <span
                className="ml-2 flex-shrink-0 rounded px-2 py-1 font-mono"
                style={{ backgroundColor: `${SITE_BTN_COLOR}20` }}
              >
                <Typography variant="caption" color="textSecondary">
                  {credit.year}
                </Typography>
              </span>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-full border-0 transition-transform duration-300 hover:scale-105"
          style={{
            backgroundColor: `${SITE_BTN_COLOR}20`,
            color: SITE_BTN_COLOR,
            borderColor: SITE_BTN_COLOR,
          }}
        >
          <a href={MOBY_GAMES_LINK} target="_blank" rel="noopener noreferrer">
            <Gamepad2 size={16} className="mr-2" />
            View on MobyGames
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

export { GameCreditsCard }
