import { PongHeader } from "@/components/header";
import { AboutSection } from "@/views/about-section";
import { SkillsSection } from "@/views/skills-section";
import { ProjectsSection } from "@/views/projects-section";
import { ContactSection } from "@/views/contact-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <PongHeader />
      <main>
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
}
