"use client"

import { useLibraryContext } from "@/context/library-context"
import { Star, Download, Eye, Calendar, Folder } from "lucide-react"
import { LibraryEmptyState } from "./library-empty-state"
import { useProjectContext } from "@/context/project-context"

export function LibraryList() {
  const { filteredItems, toggleSelection, selectedIds, updateItem, incrementDownloads } = useLibraryContext()
  const { allProjects } = useProjectContext()

  if (filteredItems.length === 0) {
    return <LibraryEmptyState />
  }

  const handleDownload = async (item: any) => {
    try {
      const response = await fetch(item.url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${item.name}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      incrementDownloads(item.id)
    } catch (error) {
      console.error("[v0] Download error:", error)
    }
  }

  return (
    <div className="space-y-2">
      {filteredItems.map((item) => {
        const project = allProjects.find((p) => p.id === item.projectId)
        const isSelected = selectedIds.includes(item.id)

        return (
          <div
            key={item.id}
            className={`glass-card p-4 rounded-xl border transition-all hover:border-purple-500/50 ${
              isSelected ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-slate-900/50"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelection(item.id)}
                className="w-5 h-5 rounded border-slate-600 text-purple-500 focus:ring-purple-500/20"
              />

              {/* Thumbnail */}
              <img
                src={item.url || "/placeholder.svg"}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23334155' width='64' height='64'/%3E%3C/svg%3E`
                }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                  {item.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-purple-300">
                    {item.type}
                  </span>
                  {item.style && (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                      {item.style}
                    </span>
                  )}
                  {project && (
                    <span className="flex items-center gap-1">
                      <Folder className="w-3 h-3" />
                      {project.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{item.views}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Download className="w-4 h-4" />
                  <span>{item.downloads}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateItem(item.id, { isFavorite: !item.isFavorite })}
                  className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-yellow-500/50 transition-all"
                >
                  <Star
                    className={`w-4 h-4 ${item.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-slate-400"}`}
                  />
                </button>
                <button
                  onClick={() => handleDownload(item)}
                  className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-all"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
