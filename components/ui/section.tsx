import type React from 'react'

interface SectionProps {
  id: string
  children: React.ReactNode
}

export function Section({ id, children }: SectionProps) {
  return (
    <section
      id={id}
      className="surface-section flex min-h-[max(600px,calc(100dvh-100px))] items-center justify-center border-0 bg-site-bg py-8 text-site-text sm:py-12 md:py-16"
    >
      <div className="container mx-auto w-full px-4">{children}</div>
    </section>
  )
}
