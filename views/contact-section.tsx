'use client'

import { Section } from '@/components/ui/section'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  SITE_CARD_COLOR,
  SITE_BORDER_COLOR,
  SITE_BTN_COLOR,
  CANVAS_COLOR,
} from '@/constants/colors'
import { cn } from '@/lib/utils'
import { CONTACT_LINKS, CONTACT_CONTENT } from '@/constants/content'
import { Twitter, Github, Linkedin, Mail } from 'lucide-react'

export function ContactSection() {
  return (
    <Section id="contact">
      <Typography variant="h2" align="center" color="primary" gutterBottom>
        {CONTACT_CONTENT.title}
      </Typography>
      <div className="mx-auto max-w-4xl text-center">
        <Typography variant="body1" align="center" gutterBottom>
          {CONTACT_CONTENT.description}
        </Typography>
        <div className={cn('mb-8 grid grid-cols-1 gap-6 sm:mb-12 sm:grid-cols-3 sm:gap-8')}>
          {CONTACT_LINKS.map((contact, index) => {
            const getIcon = (platform: string) => {
              switch (platform.toLowerCase()) {
                case 'twitter':
                  return <Twitter size={24} style={{ color: SITE_BTN_COLOR }} />
                case 'github':
                  return <Github size={24} style={{ color: SITE_BTN_COLOR }} />
                case 'linkedin':
                  return <Linkedin size={24} style={{ color: SITE_BTN_COLOR }} />
                default:
                  return null
              }
            }

            const getUrl = (platform: string, handle: string) => {
              switch (platform.toLowerCase()) {
                case 'twitter':
                  return `https://twitter.com/${handle.replace('@', '')}`
                case 'github':
                  return `https://github.com/${handle.replace('@', '')}`
                case 'linkedin':
                  return `https://linkedin.com/in/${handle.replace('@', '')}`
                default:
                  return '#'
              }
            }

            return (
              <Card
                key={index}
                className="group cursor-pointer border-0 transition-all duration-300 hover:scale-105"
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
                  <a
                    href={getUrl(contact.platform, contact.handle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center"
                  >
                    <div className="mb-3 flex justify-center">
                      <div
                        className="rounded-lg p-3 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${SITE_BTN_COLOR}20` }}
                      >
                        {getIcon(contact.platform)}
                      </div>
                    </div>
                    <Typography variant="h3" align="center" color="secondary" gutterBottom>
                      {contact.platform}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {contact.handle}
                    </Typography>
                  </a>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <Button
          size="lg"
          className="group text-base transition-transform duration-300 hover:scale-105 sm:text-lg"
          style={{ backgroundColor: SITE_BTN_COLOR, color: CANVAS_COLOR }}
          onClick={() => {
            // Anti-spam email encoding
            const user = 'contact'
            const domain = 'andrewmf.com'
            const email = user + '@' + domain
            const subject = encodeURIComponent('Hello from your website!')
            const body = encodeURIComponent(
              'Hi Andrew,\n\nI found your website and would like to connect.\n\nBest regards,'
            )
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
          }}
        >
          <Mail
            size={20}
            className="mr-2 transition-transform duration-300 group-hover:scale-110"
          />
          {CONTACT_CONTENT.buttonText}
        </Button>
      </div>
    </Section>
  )
}
