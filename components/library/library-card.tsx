"use client"

import type React from "react"

import { useState } from "react"
import { useLibraryContext } from "@/context/library-context"
import { Download, Star, Eye, ExternalLink, Trash2 } from "lucide-react"
import { useProjectContext } from "@/context/project-context"

interface LibraryCardProps {
  item: any
}

export function LibraryCard({ item }: LibraryCardProps) {
  const { toggleSelection, selectedIds, updateItem, deleteItem, incrementViews, incrementDownloads } =
    useLibraryContext()
  const { allProjects } = useProjectContext()
  const [showActions, setShowActions] = useState(false)

  const isSelected = selectedIds.includes(item.id)
  const project = allProjects.find((p) => p.id === item.projectId)

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
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

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(item.url, "_blank")
    incrementViews(item.id)
  }

  return (
    <div
      className={`group relative glass-card rounded-xl overflow-hidden border transition-all ${
        isSelected ? "border-purple-500 ring-2 ring-purple-500/20" : "border-white/10 hover:border-purple-500/50"
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          toggleSelection(item.id)
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

      {/* Image */}
      <img
        src={item.url || "/placeholder.svg"}
        alt={item.name}
        className="w-full aspect-square object-cover"
        onError={(e) => {
          e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23334155' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fill='%2394a3b8' fontFamily='sans-serif' fontSize='16'%3E${item.type}%3C/text%3E%3C/svg%3E`
        }}
      />

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity ${
          showActions ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Title and tags */}
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-white truncate mb-2">{item.name}</h4>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                {item.type}
              </span>
              {item.style && (
                <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-xs text-white">
                  {item.style}
                </span>
              )}
              {project && (
                <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-xs text-slate-300 truncate max-w-[120px]">
                  {project.name}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-slate-300 mb-3">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{item.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              <span>{item.downloads}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-sm text-white hover:bg-white/20 transition-all"
            >
              Download
            </button>
            <button
              onClick={handleView}
              className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg hover:bg-white/20 transition-all"
            >
              <ExternalLink className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                updateItem(item.id, { isFavorite: !item.isFavorite })
              }}
              className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg hover:bg-white/20 transition-all"
            >
              <Star className={`w-4 h-4 ${item.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-white"}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm("Delete this item?")) {
                  deleteItem(item.id)
                }
              }}
              className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 transition-all"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
