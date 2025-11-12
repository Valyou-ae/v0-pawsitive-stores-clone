"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  Upload,
  ChevronRight,
  Type,
  Palette,
  Replace,
  Eraser,
  ZoomIn,
  ZoomOut,
  Maximize,
  Undo,
  Redo,
  Download,
  ImageIcon,
  Sparkles,
  Wand2,
} from "lucide-react"
import { extractTextFromImage, editDesignImage } from "@/lib/gemini-service"
import { PageHeader } from "@/components/page-header"

interface DetectedText {
  id: string
  text: string
  originalText: string
  color: string
  bbox: { x: number; y: number; width: number; height: number }
}

interface DetectedObject {
  id: string
  label: string
  bbox: { x: number; y: number; width: number; height: number }
}

interface RecentDesign {
  id: string
  name: string
  date: string
  thumbnail: string
}

type EditTab = "quick" | "advanced" | "history" | "batch"

export function DesignEditor() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<EditTab>("quick")
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [detectedTexts, setDetectedTexts] = useState<DetectedText[]>([])
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])
  const [chatMessage, setChatMessage] = useState("")
  const [editHistory, setEditHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [zoom, setZoom] = useState(100)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const recentDesigns: RecentDesign[] = [
    { id: "1", name: "Coffee Mug Design", date: "2 hours ago", thumbnail: "/placeholder.svg?height=48&width=48" },
    { id: "2", name: "T-shirt Print", date: "Yesterday", thumbnail: "/placeholder.svg?height=48&width=48" },
  ]

  useEffect(() => {
    const designParam = searchParams.get("design")

    if (designParam) {
      try {
        const design = JSON.parse(decodeURIComponent(designParam))
        console.log("[v0] Loading design from URL:", design)

        setSelectedDesign(design.url)

        // Convert URL to File object for editing
        fetch(design.url)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], design.name || "design.png", { type: "image/png" })
            setCurrentFile(file)

            // Analyze the design
            setAnalyzing(true)
            extractTextFromImage(file)
              .then((analysis) => {
                const texts = analysis.texts || []
                setDetectedTexts(
                  texts.map((t, i) => ({
                    id: `text${i}`,
                    text: t.text,
                    originalText: t.text,
                    color: "#000000",
                    bbox: { x: 20, y: 20 + i * 15, width: 30, height: 10 },
                  })),
                )

                setEditHistory([design.url])
                setHistoryIndex(0)
              })
              .catch((error) => {
                console.error("[v0] Error analyzing pre-loaded design:", error)
              })
              .finally(() => {
                setAnalyzing(false)
              })
          })
          .catch((error) => {
            console.error("[v0] Error loading design from URL:", error)
          })
      } catch (error) {
        console.error("[v0] Error parsing design param:", error)
      }
    }
  }, [searchParams])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const imageUrl = event.target?.result as string
      setSelectedDesign(imageUrl)
      setCurrentFile(file)
      setAnalyzing(true)

      try {
        const analysis = await extractTextFromImage(file)

        const texts = analysis.texts || []
        setDetectedTexts(
          texts.map((t, i) => ({
            id: `text${i}`,
            text: t.text,
            originalText: t.text,
            color: "#000000",
            bbox: { x: 20, y: 20 + i * 15, width: 30, height: 10 }, // Mock positions
          })),
        )

        setEditHistory([imageUrl])
        setHistoryIndex(0)
      } catch (error) {
        console.error("[v0] Error analyzing image:", error)
      } finally {
        setAnalyzing(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const fakeEvent = { target: { files: [file] } } as any
      handleImageUpload(fakeEvent)
    }
  }

  const handleQuickEdit = (type: string) => {
    console.log("[v0] Quick edit:", type)
  }

  const handleChatEdit = async () => {
    if (!chatMessage.trim() || !currentFile) return
    setAnalyzing(true)

    try {
      const blob = await fetch(selectedDesign!).then((r) => r.blob())
      const file = new File([blob], "design.png", { type: "image/png" })

      const editedImageUrl = await editDesignImage(file, "custom", {
        customPrompt: chatMessage,
      })

      setSelectedDesign(editedImageUrl)
      setChatMessage("")

      const newHistory = editHistory.slice(0, historyIndex + 1)
      newHistory.push(editedImageUrl)
      setEditHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    } catch (error) {
      console.error("[v0] Error applying custom edit:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setSelectedDesign(editHistory[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < editHistory.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setSelectedDesign(editHistory[historyIndex + 1])
    }
  }

  const suggestions = ["Make text bold", "Change to vintage style", "Remove background", "Add warm tones"]

  return (
    <>
      {/* PageHeader */}
      <PageHeader
        icon={<Wand2 className="w-6 h-6 text-white" />}
        title="Design Edits"
        description="Edit your designs with AI-powered tools"
        gradient="from-purple-500 to-blue-500"
      />

      <div className="grid grid-cols-[33%_67%] gap-6 h-[calc(100vh-280px)] p-6 bg-black">
        <div className="space-y-4 overflow-y-auto pr-2">
          {/* Upload Zone */}
          <div
            className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-purple-500/50 hover:bg-slate-900/70 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Upload Design</h3>
              <p className="text-sm text-slate-400 mb-4">Drag & drop or click to select</p>
              <p className="text-xs text-slate-500">Supports: PNG, JPG, SVG (max 10MB)</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          {/* Recent Designs */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Recent Designs</h4>
            <div className="space-y-2">
              {recentDesigns.map((design) => (
                <button
                  key={design.id}
                  className="w-full flex items-center gap-3 p-3 bg-slate-950/50 hover:bg-slate-900 border border-white/10 rounded-xl transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800">
                    <img
                      src={design.thumbnail || "/placeholder.svg"}
                      className="w-full h-full object-cover"
                      alt={design.name}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">{design.name}</div>
                    <div className="text-xs text-slate-400">{design.date}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Edit Tools */}
          {selectedDesign && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-3">
              <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Quick Edits</h4>

              <button
                onClick={() => handleQuickEdit("text")}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-xl transition-all"
              >
                <Type className="w-5 h-5 text-purple-400" />
                <span className="flex-1 text-left text-sm font-medium text-white">Edit Text</span>
                <span className="text-xs text-slate-400">⌘E</span>
              </button>

              <button
                onClick={() => handleQuickEdit("color")}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 rounded-xl transition-all"
              >
                <Palette className="w-5 h-5 text-blue-400" />
                <span className="flex-1 text-left text-sm font-medium text-white">Change Colors</span>
                <span className="text-xs text-slate-400">⌘C</span>
              </button>

              <button
                onClick={() => handleQuickEdit("replace")}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-xl transition-all"
              >
                <Replace className="w-5 h-5 text-cyan-400" />
                <span className="flex-1 text-left text-sm font-medium text-white">Replace Object</span>
                <span className="text-xs text-slate-400">⌘R</span>
              </button>

              <button
                onClick={() => handleQuickEdit("background")}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 rounded-xl transition-all"
              >
                <Eraser className="w-5 h-5 text-red-400" />
                <span className="flex-1 text-left text-sm font-medium text-white">Remove Background</span>
                <span className="text-xs text-slate-400">⌘B</span>
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col">
          {/* Canvas Toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/50">
            <div className="flex items-center gap-3">
              <button className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-slate-300" />
                <span className="text-sm text-white">{zoom}%</span>
              </button>
              <button
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                className="w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all flex items-center justify-center"
              >
                <ZoomOut className="w-4 h-4 text-slate-300" />
              </button>
              <button className="w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all flex items-center justify-center">
                <Maximize className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Undo className="w-4 h-4 text-slate-300" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= editHistory.length - 1}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Redo className="w-4 h-4 text-slate-300" />
              </button>
              <div className="w-px h-6 bg-white/10 mx-2" />
              <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-purple-500/20 text-white flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative flex-1 bg-slate-950/50 flex items-center justify-center p-12 overflow-auto">
            {!selectedDesign ? (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-slate-800 rounded-2xl flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No design selected</h3>
                <p className="text-slate-400">Upload or select a design to start editing</p>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                {analyzing && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                      <p className="text-white font-medium">AI is analyzing...</p>
                    </div>
                  </div>
                )}
                <img
                  src={selectedDesign || "/placeholder.svg"}
                  className="max-w-full max-h-full object-contain"
                  style={{ transform: `scale(${zoom / 100})` }}
                  alt="Design"
                />

                {/* Text Detection Overlays */}
                {detectedTexts.map((text) => (
                  <button
                    key={text.id}
                    className="absolute border-2 border-purple-500/50 hover:border-purple-500 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-all group cursor-pointer"
                    style={{
                      left: `${text.bbox.x}%`,
                      top: `${text.bbox.y}%`,
                      width: `${text.bbox.width}%`,
                      height: `${text.bbox.height}%`,
                    }}
                  >
                    <div className="absolute -top-8 left-0 px-2 py-1 bg-purple-500 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-white">
                      Click to edit "{text.text}"
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Chat Interface (Bottom) */}
          {selectedDesign && (
            <div className="border-t border-white/10 p-6 bg-slate-950/30">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  placeholder="Tell me what to change... (e.g., 'Make it more vintage' or 'Change text to blue')"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleChatEdit()}
                  className="flex-1 px-4 py-3 bg-slate-900/50 border border-white/10 focus:border-purple-500/50 rounded-xl text-white placeholder:text-slate-500 outline-none transition-all"
                />
                <button
                  onClick={handleChatEdit}
                  disabled={!chatMessage.trim() || analyzing}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                >
                  Apply
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setChatMessage(suggestion)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs transition-all text-slate-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
