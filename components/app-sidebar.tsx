"use client"

import { GenmockLogo } from "./genmock-logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Sparkles,
  Wand2,
  Smartphone,
  Store,
  BarChart3,
  Users,
  Palette,
  FolderOpen,
  Plug,
  Settings,
  HelpCircle,
} from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname()

  const modules = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/generate", icon: Sparkles, label: "Generate" },
    { href: "/edit-design", icon: Wand2, label: "Edit Design" },
    { href: "/mockups", icon: Smartphone, label: "Mockups" },
    { href: "/marketplace", icon: Store, label: "Marketplace" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/team", icon: Users, label: "Team" },
    { href: "/brand-kit", icon: Palette, label: "Brand Kit" },
    { href: "/library", icon: FolderOpen, label: "Library" },
    { href: "/integrations", icon: Plug, label: "Integrations" },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-background border-r border-border flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <Link href="/dashboard" className="mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/50">
          <GenmockLogo className="w-8 h-8" />
        </div>
      </Link>

      {/* Module Icons */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-3">
        {modules.map((module) => {
          const isActive = pathname === module.href
          const IconComponent = module.icon
          return (
            <div key={module.href} className="relative group">
              <Link
                href={module.href}
                className={`
                  w-full h-14 rounded-xl flex items-center justify-center transition-all duration-200 relative
                  ${
                    isActive
                      ? "bg-gradient-to-br from-primary/20 to-secondary/20 shadow-lg shadow-primary/30"
                      : "hover:bg-muted/50"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-r-full" />
                )}
                <IconComponent className={`w-6 h-6 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              </Link>

              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-card border border-border rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl">
                <span className="text-sm text-foreground font-medium">{module.label}</span>
              </div>
            </div>
          )
        })}
      </nav>

      {/* Bottom icons: Settings, Help, User */}
      <div className="space-y-2">
        {/* Settings icon */}
        <div className="relative group">
          <button className="w-14 h-14 rounded-xl flex items-center justify-center hover:bg-muted/50 transition-all duration-200">
            <Settings className="w-6 h-6 text-muted-foreground" />
          </button>
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-card border border-border rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl">
            <span className="text-sm text-foreground font-medium">Settings</span>
          </div>
        </div>

        {/* Help icon */}
        <div className="relative group">
          <button className="w-14 h-14 rounded-xl flex items-center justify-center hover:bg-muted/50 transition-all duration-200">
            <HelpCircle className="w-6 h-6 text-muted-foreground" />
          </button>
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-card border border-border rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl">
            <span className="text-sm text-foreground font-medium">Help</span>
          </div>
        </div>

        {/* User initials in gradient circle */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
          JD
        </div>
      </div>
    </aside>
  )
}
