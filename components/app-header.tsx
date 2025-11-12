"use client"

import { Search, Sparkles, ChevronRight, Sun, Moon } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "@/context/theme-context"

export function AppHeader() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, toggleTheme } = useTheme()

  const module = pathname.substring(1) || "dashboard"

  const moduleLabels: Record<string, string> = {
    dashboard: "Dashboard",
    generate: "Generate Design",
    "edit-design": "Design Edits",
    mockups: "Mockups",
    marketplace: "Marketplace",
    analytics: "Analytics",
    team: "Team",
    "brand-kit": "Brand Kit",
    library: "Library",
    integrations: "Integrations",
  }

  const moduleSubTabs: Record<string, Array<{ id: string; label: string }>> = {
    generate: [
      { id: "quick", label: "Quick Generate" },
      { id: "batch", label: "Batch Create" },
      { id: "templates", label: "Templates" },
      { id: "history", label: "History" },
    ],
    "edit-design": [
      { id: "quick-edits", label: "Quick Edits" },
      { id: "advanced", label: "Advanced Edit" },
      { id: "history", label: "History" },
      { id: "batch", label: "Batch Edit" },
    ],
    mockups: [
      { id: "devices", label: "Devices" },
      { id: "apparel", label: "Apparel" },
      { id: "print", label: "Print Products" },
      { id: "packaging", label: "Packaging" },
    ],
  }

  const currentSubTabs = moduleSubTabs[module] || []
  const [activeTab, setActiveTab] = useState(currentSubTabs[0]?.id || "")

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
      {/* Top Row - Breadcrumb | Search | Credits | Upgrade */}
      <div className="h-16 px-6 flex items-center justify-between gap-6">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Genmock</span>
          <ChevronRight className="w-4 h-4 text-border" />
          <span className="text-foreground font-medium">{moduleLabels[module]}</span>
        </div>

        {/* Right: Search + Credits + Upgrade + Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-9 pl-9 pr-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Credits Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-lg">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">250</span>
            <span className="text-xs text-muted-foreground">credits</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center bg-muted/50 border border-border rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-foreground" />
            ) : (
              <Moon className="w-4 h-4 text-foreground" />
            )}
          </button>

          {/* Upgrade Button */}
          <button className="group relative px-4 py-1.5 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium text-sm text-primary-foreground overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/25 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 opacity-0 group-hover:opacity-20 transition-opacity" />
            <span className="relative">Upgrade</span>
          </button>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
            JD
          </div>
        </div>
      </div>

      {currentSubTabs.length > 0 && (
        <div className="border-t border-border px-6 py-3 bg-muted/30">
          <div className="flex items-center justify-between">
            {/* Left: Sub-tabs */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              {currentSubTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-primary/20 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right: View options */}
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
              </button>
              <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
                <button className="w-9 h-9 bg-primary/20 rounded-md flex items-center justify-center text-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
