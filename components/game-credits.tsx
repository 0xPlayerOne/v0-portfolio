import { Gamepad2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'

import { GAME_CREDITS } from '@/constants/content'
import { MOBY_GAMES_LINK } from '@/constants/links'
import { useCardHover } from '@/lib/card-styles'

export function GameCreditsCard() {
  const { handleMouseEnter, handleMouseLeave } = useCardHover()

  return (
    <Card
      variant="site"
      className="group relative w-full max-w-6xl hover:scale-105 lg:max-w-2xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-site-btn-20 rounded-lg p-2 transition-colors duration-300 group-hover:scale-110">
            <Gamepad2
              size={24}
              className="text-site-btn transition-transform duration-300 group-hover:rotate-12"
            />
          </div>
          <Typography variant="h3" color="secondary">
            Game Credits
          </Typography>
        </div>

        <div className="mb-6">
          {GAME_CREDITS.map((credit) => (
            <div key={credit.title} className="my-2 flex items-center justify-between">
              <a
                href={credit.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-3 min-w-0 flex-1 no-underline transition-transform duration-300 hover:scale-105"
              >
                <Typography variant="body1" className="truncate">
                  {credit.title}
                </Typography>
              </a>
              <span className="bg-site-btn-20 ml-2 flex-shrink-0 rounded px-2 py-1 font-mono">
                <Typography variant="caption" color="textSecondary">
                  {credit.year}
                </Typography>
              </span>
            </div>
          ))}
        </div>
        <Button variant="site-outline" size="sm" asChild className="w-full hover:scale-105">
          <a href={MOBY_GAMES_LINK} target="_blank" rel="noopener noreferrer">
            <Gamepad2 size={16} className="mr-2" />
            View on MobyGames
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
