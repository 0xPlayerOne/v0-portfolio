import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { SITE_BTN_COLOR } from "@/constants/colors"
import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { getLanguageColor } from "@/lib/language-colors"
import { smoothScrollToSection } from "@/lib/smooth-scroll"
import { cn } from "@/lib/utils"

describe("browser utilities", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0, writable: true })
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1_024, writable: true })
  })

  it("merges Tailwind classes and maps language colors", () => {
    expect(cn("px-2", false && "hidden", "px-4")).toBe("px-4")
    expect(getLanguageColor("TypeScript")).toBe("#3178c6")
    expect(getLanguageColor("UnknownLanguage")).toBe(SITE_BTN_COLOR)
  })

  it("smoothly scrolls to an existing section and reuses its cached position", () => {
    vi.useFakeTimers()
    const section = document.createElement("section")
    section.id = "projects"
    Object.defineProperty(section, "offsetTop", { configurable: true, value: 500 })
    document.body.append(section)
    const scrollTo = vi.fn()
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    window.scrollTo = scrollTo

    smoothScrollToSection("projects", 80)
    smoothScrollToSection("projects", 80)

    expect(scrollTo).toHaveBeenNthCalledWith(1, { top: 420, behavior: "smooth" })
    expect(scrollTo).toHaveBeenNthCalledWith(2, { top: 420, behavior: "smooth" })

    vi.advanceTimersByTime(3_000)
    vi.useRealTimers()
  })

  it("tracks the closest section above the viewport", async () => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0)
      return 1
    })
    const about = document.createElement("section")
    about.id = "about"
    Object.defineProperty(about, "offsetTop", { configurable: true, value: 100 })
    const projects = document.createElement("section")
    projects.id = "projects"
    Object.defineProperty(projects, "offsetTop", { configurable: true, value: 600 })
    document.body.append(about, projects)

    const { result } = renderHook(() => useScrollSpy({ sectionIds: ["about", "projects"], offset: 20 }))
    await act(async () => undefined)
    expect(result.current).toBeNull()

    Object.defineProperty(window, "scrollY", { configurable: true, value: 650, writable: true })
    await act(async () => window.dispatchEvent(new Event("scroll")))

    expect(result.current).toBe("projects")
  })
})
