"use client"

import { Download, Trash2, Tag } from "lucide-react"
import { useLibraryContext } from "@/context/library-context"
import { useProjectContext } from "@/context/project-context"
import { useState } from "react"

export function LibraryBulkActions() {
  const { selectedIds, bulkDelete, bulkTag, bulkMove, clearSelection, items } = useLibraryContext()
  const { allProjects } = useProjectContext()
  const [showTagInput, setShowTagInput] = useState(false)
  const [newTag, setNewTag] = useState("")

  const handleBulkDownload = async () => {
    const selectedItems = items.filter((item) => selectedIds.includes(item.id))
    for (const item of selectedItems) {
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
      } catch (error) {
        console.error("[v0] Download error:", error)
      }
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} items?`)) {
      bulkDelete(selectedIds)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim()) {
      bulkTag(selectedIds, [newTag.trim()])
      setNewTag("")
      setShowTagInput(false)
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-card px-6 py-4 rounded-2xl border border-purple-500/50 bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-purple-500/20">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-white">
            {selectedIds.length} {selectedIds.length === 1 ? "item" : "items"} selected
          </span>

          <div className="w-px h-6 bg-white/10" />

          <button
            onClick={handleBulkDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium text-white transition-all"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>

          <div className="relative">
            <button
              onClick={() => setShowTagInput(!showTagInput)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium text-white transition-all"
            >
              <Tag className="w-4 h-4" />
              Add Tags
            </button>

            {showTagInput && (
              <div className="absolute bottom-full mb-2 left-0 p-3 bg-slate-900 border border-white/20 rounded-lg shadow-xl min-w-[200px]">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Enter tag..."
                  className="w-full px-3 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:border-purple-500 outline-none mb-2"
                  autoFocus
                />
                <button
                  onClick={handleAddTag}
                  className="w-full py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-medium text-white transition-all"
                >
                  Add Tag
                </button>
              </div>
            )}
          </div>

          <select
            onChange={(e) => {
              if (e.target.value) {
                bulkMove(selectedIds, e.target.value)
              }
            }}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-medium text-white outline-none cursor-pointer"
          >
            <option value="">Move to Project...</option>
            {allProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-lg text-sm font-medium text-red-300 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          <div className="w-px h-6 bg-white/10" />

          <button onClick={clearSelection} className="text-sm text-slate-400 hover:text-white transition-colors">
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
