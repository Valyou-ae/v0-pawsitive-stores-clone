"use client"

import type React from "react"
import { useState } from "react"
import { Upload, Wand2, Loader2, Type, Replace, ImageIcon, Sliders } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/page-header"

type EditMode = "text" | "object" | "background" | "color"

export function SmartEditor() {
  const { toast } = useToast()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [editedImage, setEditedImage] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [activeMode, setActiveMode] = useState<EditMode>("text")

  // Text replacement
  const [detectedText, setDetectedText] = useState("Sample Text")
  const [newText, setNewText] = useState("")

  // Object replacement
  const [detectedObject, setDetectedObject] = useState("Dog")
  const [newObject, setNewObject] = useState("")

  // Background
  const [bgPrompt, setBgPrompt] = useState("")

  // Color adjustments
  const [brightness, setBrightness] = useState([100])
  const [contrast, setContrast] = useState([100])
  const [saturation, setSaturation] = useState([100])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedImage(url)
      setEditedImage(null)
      toast({
        title: "Image uploaded",
        description: "Ready for AI editing",
      })
    }
  }

  const handleApplyEdit = async () => {
    if (!uploadedImage) return

    setProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setEditedImage(`/placeholder.svg?height=500&width=500&query=${encodeURIComponent("edited design " + activeMode)}`)
    setProcessing(false)
    toast({
      title: "Edit applied!",
      description: "Your design has been updated",
    })
  }

  return (
    <>
      {/* Page Header */}
      <PageHeader
        icon={<Wand2 className="w-6 h-6 text-white" />}
        title="Smart Editor"
        description="Advanced AI-powered design editing tools"
        gradient="from-purple-500 to-blue-500"
      />

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6 p-6 bg-black">
        {/* Left Panel - Upload & Controls */}
        <div className="space-y-4">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Upload Design</h3>
            {!uploadedImage ? (
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-purple-500/50 hover:bg-slate-900/70 transition-all cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="text-sm font-medium text-white mb-2">Upload your design</p>
                <label htmlFor="editor-upload">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 rounded-lg text-sm font-semibold text-white cursor-pointer transition-all shadow-lg shadow-purple-500/20">
                    Choose File
                  </span>
                </label>
                <input
                  id="editor-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded design"
                  className="w-full rounded-xl border border-white/10"
                />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-all"
                >
                  Upload Different Image
                </button>
              </div>
            )}
          </div>

          {uploadedImage && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">AI Editing Tools</h3>

              {/* Tabs */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                  { value: "text", icon: Type, label: "Text" },
                  { value: "object", icon: Replace, label: "Object" },
                  { value: "background", icon: ImageIcon, label: "BG" },
                  { value: "color", icon: Sliders, label: "Color" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveMode(tab.value as EditMode)}
                    className={`p-3 rounded-xl border transition-all ${
                      activeMode === tab.value
                        ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                        : "border-white/10 hover:border-purple-400 bg-slate-800/50"
                    }`}
                  >
                    <tab.icon
                      className={`w-5 h-5 mx-auto mb-1 ${activeMode === tab.value ? "text-purple-400" : "text-slate-400"}`}
                    />
                    <div className="text-xs font-medium text-white">{tab.label}</div>
                  </button>
                ))}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {activeMode === "text" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Detected Text
                      </label>
                      <input
                        value={detectedText}
                        disabled
                        className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-sm text-slate-400 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Replace With
                      </label>
                      <input
                        placeholder="Enter new text..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 focus:border-purple-500/50 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none transition-all"
                      />
                    </div>
                  </>
                )}

                {activeMode === "object" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Detected Object
                      </label>
                      <input
                        value={detectedObject}
                        disabled
                        className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-sm text-slate-400 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Replace With
                      </label>
                      <input
                        placeholder="e.g., Cat, Flower, Car..."
                        value={newObject}
                        onChange={(e) => setNewObject(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 focus:border-purple-500/50 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none transition-all"
                      />
                    </div>
                  </>
                )}

                {activeMode === "background" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        New Background
                      </label>
                      <input
                        placeholder="e.g., Beach sunset, City skyline..."
                        value={bgPrompt}
                        onChange={(e) => setBgPrompt(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 focus:border-purple-500/50 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none transition-all"
                      />
                    </div>
                    <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-all">
                      Remove Background
                    </button>
                  </>
                )}

                {activeMode === "color" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Brightness: {brightness[0]}%
                      </label>
                      <input
                        type="range"
                        value={brightness[0]}
                        onChange={(e) => setBrightness([Number(e.target.value)])}
                        min="0"
                        max="200"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Contrast: {contrast[0]}%
                      </label>
                      <input
                        type="range"
                        value={contrast[0]}
                        onChange={(e) => setContrast([Number(e.target.value)])}
                        min="0"
                        max="200"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Saturation: {saturation[0]}%
                      </label>
                      <input
                        type="range"
                        value={saturation[0]}
                        onChange={(e) => setSaturation([Number(e.target.value)])}
                        min="0"
                        max="200"
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApplyEdit}
                disabled={processing}
                className="w-full mt-6 relative group overflow-hidden rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 opacity-100 group-hover:opacity-90 transition-opacity" />
                <div className="relative py-3.5 flex items-center justify-center gap-3">
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                      <span className="font-bold text-lg text-white">Processing...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 text-white" />
                      <span className="font-bold text-lg text-white">Apply Edit</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Before/After Preview */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Preview</h3>

          {!uploadedImage ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-800 rounded-2xl flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-slate-400">Upload an image to see the preview</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider">Before</label>
                <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-950/50">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Original"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </div>

              {editedImage && (
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">After</label>
                  <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-950/50">
                    <img
                      src={editedImage || "/placeholder.svg"}
                      alt="Edited"
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-purple-500/20">
                    Download Edited Version
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
