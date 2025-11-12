"use client"

import { Search, Grid, List, SortAsc, SortDesc } from "lucide-react"
import { useLibraryContext } from "@/context/library-context"
import { useProjectContext } from "@/context/project-context"

export function LibraryHeader() {
  const { filters, setFilters, view, setView, sortBy, setSortBy, sortOrder, setSortOrder } = useLibraryContext()
  const { allProjects } = useProjectContext()

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search designs and mockups..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
          />
        </div>

        {/* Project filter */}
        <select
          value={filters.projectId || ""}
          onChange={(e) => setFilters({ projectId: e.target.value || undefined })}
          className="px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
        >
          <option value="">All Projects</option>
          {allProjects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name} ({project.designs.length + project.mockups.length})
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
        >
          <option value="date">Date</option>
          <option value="name">Name</option>
          <option value="views">Views</option>
          <option value="downloads">Downloads</option>
        </select>

        {/* Sort order */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="p-3 bg-slate-950/50 border border-slate-700 rounded-xl hover:border-purple-500/50 transition-all"
        >
          {sortOrder === "asc" ? (
            <SortAsc className="w-5 h-5 text-slate-400" />
          ) : (
            <SortDesc className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {/* View toggle */}
        <div className="flex items-center gap-2 p-1 bg-slate-950/50 border border-slate-700 rounded-xl">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-all ${
              view === "grid" ? "bg-purple-500/20 text-purple-300" : "text-slate-400 hover:text-white"
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-all ${
              view === "list" ? "bg-purple-500/20 text-purple-300" : "text-slate-400 hover:text-white"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
