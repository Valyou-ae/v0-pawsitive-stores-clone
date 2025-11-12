"use client"

import { useLibraryContext } from "@/context/library-context"
import { ImageIcon, Camera, Star, Clock, X } from "lucide-react"
import { useMemo } from "react"

export function LibrarySidebar() {
  const { items, filters, setFilters, clearFilters } = useLibraryContext()

  // Calculate counts
  const counts = useMemo(() => {
    const designCount = items.filter((item) => item.type === "design").length
    const mockupCount = items.filter((item) => item.type === "mockup").length
    const favoriteCount = items.filter((item) => item.isFavorite).length

    // Get unique styles
    const styles = [...new Set(items.filter((item) => item.style).map((item) => item.style))]
    const styleCounts = styles.map((style) => ({
      style,
      count: items.filter((item) => item.style === style).length,
    }))

    return { designCount, mockupCount, favoriteCount, styleCounts }
  }, [items])

  const hasActiveFilters =
    filters.type.length > 0 || filters.styles.length > 0 || filters.favorites || filters.searchQuery

  return (
    <div className="col-span-1 space-y-4">
      {/* Filters card */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Type filter */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5" />
              Type
            </h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer group">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.type.includes("design")}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...filters.type, "design"]
                        : filters.type.filter((t) => t !== "design")
                      setFilters({ type: newTypes })
                    }}
                    className="w-4 h-4 rounded border-slate-600 text-purple-500 focus:ring-purple-500/20"
                  />
                  <span className="text-sm text-slate-300">Designs</span>
                </div>
                <span className="text-xs text-slate-500 group-hover:text-slate-400">{counts.designCount}</span>
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer group">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.type.includes("mockup")}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...filters.type, "mockup"]
                        : filters.type.filter((t) => t !== "mockup")
                      setFilters({ type: newTypes })
                    }}
                    className="w-4 h-4 rounded border-slate-600 text-purple-500 focus:ring-purple-500/20"
                  />
                  <span className="text-sm text-slate-300">Mockups</span>
                </div>
                <span className="text-xs text-slate-500 group-hover:text-slate-400">{counts.mockupCount}</span>
              </label>
            </div>
          </div>

          {/* Style filter */}
          {counts.styleCounts.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5" />
                Style
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {counts.styleCounts.map(({ style, count }) => (
                  <label
                    key={style}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.styles.includes(style!)}
                        onChange={(e) => {
                          const newStyles = e.target.checked
                            ? [...filters.styles, style!]
                            : filters.styles.filter((s) => s !== style)
                          setFilters({ styles: newStyles })
                        }}
                        className="w-4 h-4 rounded border-slate-600 text-purple-500 focus:ring-purple-500/20"
                      />
                      <span className="text-sm text-slate-300">{style}</span>
                    </div>
                    <span className="text-xs text-slate-500 group-hover:text-slate-400">{count}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quick filters */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Filters</h4>
            <div className="space-y-2">
              <button
                onClick={() => setFilters({ favorites: !filters.favorites })}
                className={`w-full flex items-center gap-2 p-3 rounded-xl transition-all ${
                  filters.favorites
                    ? "bg-purple-500/20 border border-purple-500/30 text-purple-300"
                    : "bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-purple-400"
                }`}
              >
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Favorites</span>
                <span className="ml-auto text-xs">{counts.favoriteCount}</span>
              </button>

              <button
                onClick={() => {
                  const sevenDaysAgo = new Date()
                  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
                  setFilters({
                    dateRange: {
                      start: sevenDaysAgo,
                      end: new Date(),
                    },
                  })
                }}
                className="w-full flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-purple-400 transition-all"
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Recent (7 days)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
