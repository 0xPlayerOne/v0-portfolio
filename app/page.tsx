import { PongHeader } from '@/components/header'
import { AboutSection } from '@/views/about-section'
import { SkillsSection } from '@/views/skills-section'
import { ProjectsSection } from '@/views/projects-section'
import { ContactSection } from '@/views/contact-section'
import { fetchPinnedRepos } from '@/lib/github'

export default async function Home() {
  const projects = await fetchPinnedRepos()

  return (
    <div className="min-h-screen">
      <PongHeader />
      <main>
        <AboutSection />
        <SkillsSection />
        <ProjectsSection initialProjects={projects} />
        <ContactSection />
      </main>
    </div>
  )
}
