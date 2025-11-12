"use client"

import { useState, useEffect } from "react"
import confetti from "canvas-confetti"
import { Toast } from "@/components/toast"
import { DesignSkeleton } from "@/components/design-skeleton"
import { useToast } from "@/hooks/use-toast"
import { useProjectContext } from "@/context/project-context"
import { useRouter } from "next/navigation"
import { Camera, Edit, Bookmark, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"

const styles = [
  {
    name: "Modern",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    icon: "✨",
    description: "Clean & contemporary",
  },
  {
    name: "Vintage",
    gradient: "from-amber-600 via-orange-500 to-yellow-600",
    icon: "📻",
    description: "Classic & timeless",
  },
  {
    name: "Minimalist",
    gradient: "from-slate-400 via-gray-500 to-zinc-600",
    icon: "▢",
    description: "Simple & elegant",
  },
  {
    name: "Abstract",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    icon: "🎨",
    description: "Creative & artistic",
  },
  {
    name: "Watercolor",
    gradient: "from-sky-400 via-blue-500 to-indigo-500",
    icon: "💧",
    description: "Soft & flowing",
  },
  {
    name: "Typography",
    gradient: "from-violet-500 via-purple-600 to-indigo-600",
    icon: "Aa",
    description: "Letter focused",
  },
]

const fonts = [
  { name: "AI's Choice", preview: "Aa", recommended: true, className: "" },
  { name: "Bebas Neue", preview: "BOLD", className: "font-bebas" },
  { name: "Playfair Display", preview: "Elegant", className: "font-playfair" },
  { name: "Oswald", preview: "STRONG", className: "font-oswald" },
  { name: "Pacifico", preview: "Playful", className: "font-pacifico" },
  { name: "Raleway", preview: "Clean", className: "font-raleway" },
  { name: "Roboto Slab", preview: "Modern", className: "font-roboto-slab" },
  { name: "Dancing Script", preview: "Fancy", className: "font-dancing" },
  { name: "Montserrat", preview: "Simple", className: "font-montserrat" },
]

const promptExamples = [
  { prompt: "A cute puppy wearing a crown surrounded by stars", emoji: "🐕👑" },
  { prompt: "Retro sunset with palm trees and vintage typography", emoji: "🌴🌅" },
  { prompt: "Minimalist mountain landscape in black and white", emoji: "⛰️🎨" },
  { prompt: "Vintage coffee shop logo with hand-drawn illustration", emoji: "☕🎨" },
  { prompt: "Watercolor flowers with elegant gold accents", emoji: "🌸✨" },
  { prompt: "Bold geometric pattern in vibrant colors", emoji: "🔷💥" },
  { prompt: "Cute cat astronaut floating in space with stars", emoji: "🐱🚀" },
  { prompt: "Abstract art with flowing shapes and gradients", emoji: "🎨🌈" },
  { prompt: "Typography poster with motivational quote", emoji: "💬✨" },
  { prompt: "Minimalist line art portrait of a lion", emoji: "🦁✏️" },
  { prompt: "Retro gaming pixel art design", emoji: "🕹️👾" },
  { prompt: "Tropical paradise scene with exotic birds", emoji: "🦜🌺" },
  { prompt: "Pop art comic book style superhero", emoji: "💥🦸" },
  { prompt: "Zen garden with Japanese aesthetic", emoji: "🪨🍃" },
  { prompt: "Steampunk mechanical heart illustration", emoji: "⚙️❤️" },
]

const getRandomExamples = () => {
  const shuffled = [...promptExamples].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

export function DesignGenerator() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("Modern")
  const [font, setFont] = useState("AI's Choice")
  const [variations, setVariations] = useState([3])
  const [generating, setGenerating] = useState(false)
  const [designs, setDesigns] = useState<
    Array<{
      id: number
      prompt: string
      style: string
      url: string
      createdAt: string
      resolution: string
      isFavorite: boolean
    }>
  >([])
  const { toast } = useToast()
  const { createProject, addDesignsToProject, currentProject } = useProjectContext()

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const [currentExamples, setCurrentExamples] = useState<Array<{ prompt: string; emoji: string }>>([])
  const router = useRouter()
  const [selectedDesignIds, setSelectedDesignIds] = useState<string[]>([])
  const [designObjects, setDesignObjects] = useState<
    Array<{
      id: string
      name: string
      url: string
      style: string
      createdAt: Date
    }>
  >([])

  useEffect(() => {
    setCurrentExamples(getRandomExamples())
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a design prompt",
        variant: "destructive",
      })
      return
    }

    setGenerating(true)
    const newDesigns: Array<{
      id: number
      prompt: string
      style: string
      url: string
      createdAt: string
      resolution: string
      isFavorite: boolean
    }> = []

    const newDesignObjects: Array<{
      id: string
      name: string
      url: string
      style: string
      createdAt: Date
    }> = []

    try {
      const generatePromises = Array.from({ length: variations[0] }, async (_, i) => {
        const response = await fetch("/api/generate-design", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            style,
            font,
            variation: i + 1,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.details || "Failed to generate design")
        }

        return response.json()
      })

      const results = await Promise.allSettled(generatePromises)

      results.forEach((result, i) => {
        if (result.status === "fulfilled") {
          const data = result.value
          const newDesign = {
            id: Date.now() + i,
            prompt,
            style,
            url: data.imageUrl,
            createdAt: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            resolution: "1024x1024",
            isFavorite: false,
          }
          newDesigns.push(newDesign)

          const designObject = {
            id: `design_${Date.now()}_${i}`,
            name: `${prompt.substring(0, 30)}${prompt.length > 30 ? "..." : ""} #${i + 1}`,
            url: data.imageUrl,
            style: style,
            createdAt: new Date(),
          }
          newDesignObjects.push(designObject)
        } else {
          console.error(`[v0] Design ${i + 1} failed:`, result.reason)
        }
      })

      if (newDesignObjects.length > 0) {
        if (!currentProject) {
          createProject(newDesignObjects[0])
        } else {
          addDesignsToProject(currentProject.id, newDesignObjects)
        }

        setDesigns((prev) => [...newDesigns, ...prev])
        setDesignObjects((prev) => [...newDesignObjects, ...prev])

        console.log("[v0] Created", newDesignObjects.length, "design objects")

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#06B6D4", "#3B82F6", "#8B5CF6", "#EC4899"],
        })

        setToastMessage(
          `🎉 ${newDesignObjects.length} design${newDesignObjects.length > 1 ? "s" : ""} generated successfully!`,
        )
        setShowToast(true)
      } else {
        throw new Error("All design generations failed")
      }
    } catch (error) {
      console.error("[v0] Design generation error:", error)
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate designs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async (design: { id: number; prompt: string; style: string; url: string }) => {
    try {
      const response = await fetch(design.url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `design-${design.id}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Download error:", error)
      toast({
        title: "Download failed",
        description: "Failed to download design",
        variant: "destructive",
      })
    }
  }

  const handleFullView = (design: any) => {
    window.open(design.url, "_blank")
  }

  const handleFavorite = (designId: number) => {
    setDesigns((prev) => prev.map((d) => (d.id === designId ? { ...d, isFavorite: !d.isFavorite } : d)))
  }

  const handleMoreOptions = (design: any) => {
    toast({
      title: "More options",
      description: "Additional options coming soon!",
    })
  }

  const refreshExamples = () => {
    setCurrentExamples(getRandomExamples())
  }

  return (
    <>
      <PageHeader
        icon={<Sparkles className="w-6 h-6 text-white" />}
        title="Generate Design"
        description="Create original AI-powered designs for your products"
        gradient="from-purple-500 to-blue-500"
      />

      <div className="grid grid-cols-3 gap-6 p-6 h-full bg-black">
        {showToast && <Toast message={toastMessage} type="success" onClose={() => setShowToast(false)} />}

        {/* 33% Form Card (spans 1 column) - Sticky */}
        <div className="col-span-1">
          <div className="glass-card p-6 rounded-2xl border border-white/10 sticky top-6 h-fit bg-slate-900/50 backdrop-blur-xl">
            <div className="space-y-4">
              {/* Prompt Section */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586a2 2 0 01-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Design Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
                  placeholder="Describe your design idea..."
                  className="w-full h-20 px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none transition-all"
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{prompt.length}/500</span>
                  <span className="text-slate-500">Be specific for best results</span>
                </div>
              </div>

              {/* Style Section */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                  Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {styles.map((styleOption) => (
                    <button
                      key={styleOption.name}
                      onClick={() => setStyle(styleOption.name)}
                      className={`relative p-3 rounded-xl border transition-all group ${
                        style === styleOption.name
                          ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                          : "border-slate-700 hover:border-purple-400 bg-slate-800/50"
                      }`}
                    >
                      {style === styleOption.name && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                          <svg className="w-3 h-3 text-white stroke-[3]" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <div className="text-xl mb-1">{styleOption.icon}</div>
                      <div className="text-[10px] font-medium text-white truncate">{styleOption.name}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  {styles.find((s) => s.name === style)?.description}
                </p>
              </div>

              {/* Font Section */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                  Font Style
                </label>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                >
                  {fonts.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name} {f.recommended ? "⭐" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Variations Section */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Variations
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setVariations([num])}
                      className={`py-2.5 rounded-xl font-bold transition-all ${
                        variations[0] === num
                          ? "bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/30"
                          : "bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-purple-400"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                className="w-full relative group overflow-hidden rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 opacity-100 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 blur-2xl opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="relative py-3.5 flex items-center justify-center gap-3">
                  {generating ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="font-bold text-lg text-white">Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2l1.586-1.586a2 2 0 012.828 0L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      <span className="font-bold text-lg text-white">Generate Designs</span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                        {variations[0]} credits
                      </span>
                    </>
                  )}
                </div>
              </button>

              <p className="text-center text-xs text-slate-500 mt-3">
                <kbd className="px-2 py-1 bg-white/10 rounded">⌘</kbd> +{" "}
                <kbd className="px-2 py-1 bg-white/10 rounded">Enter</kbd> to generate
              </p>
            </div>
          </div>
        </div>

        {/* 67% Gallery (spans 2 columns) */}
        <div className="col-span-2 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2">
            {generating ? (
              <DesignSkeleton />
            ) : designs.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-3xl">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-xl shadow-purple-500/30">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No designs yet</h3>
                  <p className="text-slate-400 mb-8">Create your first AI-powered design</p>

                  <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
                    {currentExamples.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(example.prompt)}
                        className="p-6 bg-slate-900/50 backdrop-blur-xl border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:bg-slate-900/70 rounded-2xl transition-all duration-300 group"
                      >
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {example.emoji}
                        </div>
                        <h4 className="text-sm font-semibold text-white mb-1">
                          {example.prompt.split(" ").slice(0, 4).join(" ")}
                        </h4>
                        <p className="text-xs text-slate-400">{example.prompt.split(" ").slice(4).join(" ")}</p>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={refreshExamples}
                    className="mx-auto flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Refresh examples
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {selectedDesignIds.length > 0 && (
                  <div className="p-6 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Next Steps</h4>
                      <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-semibold text-purple-300">
                        {selectedDesignIds.length} selected
                      </span>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          const selected = designObjects.filter((d) => selectedDesignIds.includes(d.id))

                          if (selected.length > 0) {
                            // Create project with first design
                            const project = createProject(selected[0])

                            // Add remaining designs if any
                            if (selected.length > 1) {
                              addDesignsToProject(project.id, selected.slice(1))
                            }

                            console.log("[v0] Created project:", project.id)
                            console.log("[v0] Added designs:", selected.length)

                            toast({
                              title: "Project Created!",
                              description: `Created project with ${selected.length} design${selected.length > 1 ? "s" : ""}`,
                            })

                            router.push(`/mockups?projectId=${project.id}`)
                          }
                        }}
                        className="w-full px-4 py-3 bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/30 rounded-xl text-sm font-semibold text-cyan-300 transition-all flex items-center justify-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        Create Mockups ({selectedDesignIds.length}{" "}
                        {selectedDesignIds.length === 1 ? "design" : "designs"})
                      </button>

                      <button
                        onClick={() => {
                          const selected = designObjects.filter((d) => selectedDesignIds.includes(d.id))

                          if (selected.length > 0) {
                            // Pass the first selected design as the active design
                            const designData = encodeURIComponent(JSON.stringify(selected[0]))

                            console.log("[v0] Navigating to Edit Design with:", selected[0])

                            toast({
                              title: "Opening Editor",
                              description: "Loading your design for editing",
                            })

                            router.push(`/edit-design?design=${designData}`)
                          }
                        }}
                        className="w-full px-4 py-3 bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/30 rounded-xl text-sm font-semibold text-purple-300 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit className="w-5 h-5" />
                        Edit Selected Design
                      </button>

                      <button
                        onClick={() => {
                          const selected = designObjects.filter((d) => selectedDesignIds.includes(d.id))
                          if (selected.length > 0) {
                            const designData = encodeURIComponent(JSON.stringify(selected))
                            toast({
                              title: "Saved to Brand Kit",
                              description: `${selected.length} design${selected.length > 1 ? "s" : ""} saved`,
                            })
                            router.push(`/brand-kit?designs=${designData}`)
                          } else {
                            router.push("/brand-kit")
                          }
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Bookmark className="w-5 h-5" />
                        Save to Brand Kit
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {designs.map((design, index) => {
                    const designObject = designObjects[index]
                    const isSelected = designObject && selectedDesignIds.includes(designObject.id)

                    return (
                      <div
                        key={design.id}
                        className="group relative glass-card rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all"
                      >
                        {designObject && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedDesignIds((prev) =>
                                prev.includes(designObject.id)
                                  ? prev.filter((id) => id !== designObject.id)
                                  : [...prev, designObject.id],
                              )
                            }}
                            className="absolute top-3 right-3 z-10 w-7 h-7 rounded-lg transition-all flex items-center justify-center backdrop-blur-sm"
                            style={{
                              backgroundColor: isSelected ? "rgba(168, 85, 247, 0.9)" : "rgba(15, 23, 42, 0.9)",
                              borderWidth: "2px",
                              borderStyle: "solid",
                              borderColor: isSelected ? "#a855f7" : "rgba(255, 255, 255, 0.2)",
                            }}
                          >
                            {isSelected && (
                              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        )}

                        <img
                          src={design.url || "/placeholder.svg"}
                          className="w-full aspect-square object-cover"
                          alt={design.prompt}
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23334155' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fill='%2394a3b8' fontFamily='sans-serif' fontSize='16'%3EDesign%3C/text%3E%3C/svg%3E`
                          }}
                        />

                        {/* ... existing hover overlay ... */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs text-purple-300">
                                {design.style}
                              </span>
                              <span className="text-xs text-slate-400">{design.createdAt}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDownload(design)}
                                className="flex-1 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-sm text-white hover:bg-white/20 transition-all"
                              >
                                Download
                              </button>
                              <button
                                onClick={() => handleFavorite(design.id)}
                                className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg hover:bg-white/20 transition-all"
                              >
                                <svg
                                  className={`w-4 h-4 ${design.isFavorite ? "fill-red-500 stroke-red-500" : "stroke-white"}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
