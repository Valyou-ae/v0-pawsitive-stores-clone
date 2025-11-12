"use client"

import { useState, useEffect } from "react"
import { Upload, Trash2, Zap, Download, Share, X, Plus } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function BrandKit() {
  const [activeBrand, setActiveBrand] = useState("1")
  const [brandColors, setBrandColors] = useState(["#7C3AED", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"])
  const [savedDesigns, setSavedDesigns] = useState<any[]>([])
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const designsParam = searchParams.get("designs")
    if (designsParam) {
      try {
        const incomingDesigns = JSON.parse(decodeURIComponent(designsParam))
        setSavedDesigns((prev) => [...incomingDesigns, ...prev])
        toast({
          title: "✅ Saved to Brand Kit",
          description: `${incomingDesigns.length} design${incomingDesigns.length > 1 ? "s" : ""} added to your brand kit`,
        })
        // Clear URL params after saving
        window.history.replaceState({}, "", "/brand-kit")
      } catch (error) {
        console.error("[v0] Error parsing design data:", error)
      }
    }
  }, [searchParams, toast])

  const brands = [
    { id: "1", name: "My Brand" },
    { id: "2", name: "Coffee Shop Co" },
    { id: "3", name: "Retro Designs" },
  ]

  const brandFonts = [
    { family: "Inter", weight: "Regular" },
    { family: "Playfair Display", weight: "Bold" },
    { family: "Roboto Mono", weight: "Medium" },
  ]

  const recentDesigns = [
    ...savedDesigns.map((d) => ({ id: d.id, name: d.style + " Design", thumbnail: d.url })),
    { id: 1, name: "Summer Tee", thumbnail: "/placeholder.svg?height=200&width=200" },
    { id: 2, name: "Coffee Mug", thumbnail: "/placeholder.svg?height=200&width=200" },
    { id: 3, name: "Poster Design", thumbnail: "/placeholder.svg?height=200&width=200" },
    { id: 4, name: "Tote Bag", thumbnail: "/placeholder.svg?height=200&width=200" },
  ].slice(0, 4)

  return (
    <div className="p-6 space-y-6">
      {/* Brand Selector */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => setActiveBrand(brand.id)}
            className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeBrand === brand.id
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                : "bg-slate-900/50 border border-white/10 text-slate-300 hover:bg-slate-900 hover:border-white/20"
            }`}
          >
            {brand.name}
          </button>
        ))}
        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold whitespace-nowrap flex items-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all">
          <Plus className="w-5 h-5" />
          Create New Brand
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Logo Section */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Logo</h3>
            <button className="w-full aspect-square border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-xl flex flex-col items-center justify-center transition-all group">
              <Upload className="w-12 h-12 text-slate-400 group-hover:text-purple-400 transition-colors mb-3" />
              <span className="text-sm text-slate-300">Upload Logo</span>
              <span className="text-xs text-slate-500 mt-1">PNG, JPG, SVG (max 5MB)</span>
            </button>
          </div>

          {/* Brand Colors */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Brand Colors</h3>
              <button className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                + Add Color
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {brandColors.map((color, i) => (
                <div key={i} className="group">
                  <button
                    className="w-full aspect-square rounded-xl border-2 border-white/10 hover:border-white/30 transition-all relative"
                    style={{ backgroundColor: color }}
                  >
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg cursor-pointer">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  </button>
                  <div className="text-xs text-center text-slate-400 mt-2 font-mono">{color}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Fonts */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Brand Fonts</h3>
              <button className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                + Add Font
              </button>
            </div>
            <div className="space-y-3">
              {brandFonts.map((font, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-950/50 rounded-xl flex items-center justify-between hover:bg-slate-900 transition-all group"
                >
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: font.family }}>
                      Aa Bb Cc
                    </div>
                    <div className="text-sm text-slate-400">
                      {font.family} • {font.weight}
                    </div>
                  </div>
                  <button className="text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Auto-Apply Card */}
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Auto-Apply</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">Automatically apply this brand kit to all new designs</p>
            <label className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-xl cursor-pointer hover:bg-slate-900 transition-all">
              <input type="checkbox" className="w-5 h-5 accent-purple-500" defaultChecked />
              <span className="text-sm font-medium text-white">Enable Auto-Apply</span>
            </label>
          </div>

          {/* Recent Designs Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Designs</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {recentDesigns.map((design) => (
                <div
                  key={design.id}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
                >
                  <img
                    src={design.thumbnail || "/placeholder.svg"}
                    alt={design.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-sm font-semibold text-white">{design.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all">
              View All (24)
            </button>
          </div>

          {/* Export & Share Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-3">
            <h3 className="text-lg font-bold text-white mb-4">Export & Share</h3>
            <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download Brand Guide PDF
            </button>
            <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2">
              <Share className="w-5 h-5" />
              Share with Team
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
