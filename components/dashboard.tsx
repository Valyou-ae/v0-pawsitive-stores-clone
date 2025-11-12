"use client"
import { useRouter } from "next/navigation"
import {
  DollarSign,
  ShoppingCart,
  Sparkles,
  Package,
  TrendingUp,
  Camera,
  ShoppingBag,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  Activity,
  AlertTriangle,
  Edit,
  BarChart,
} from "lucide-react"

interface DashboardProps {
  setActiveModule: (
    module:
      | "dashboard"
      | "generate"
      | "edit"
      | "mockups"
      | "marketplace"
      | "analytics"
      | "team"
      | "brand-kit"
      | "library"
      | "integrations",
  ) => void
}

export function Dashboard({ setActiveModule }: DashboardProps) {
  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* TOP ROW: Quick Stats */}
      <div className="grid grid-cols-4 gap-6">
        {/* Revenue Today */}
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-success/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success/20 to-transparent rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wider">Revenue Today</h3>
              <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">$2,347</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm text-success font-semibold">+12.5%</span>
              <span className="text-sm text-muted-foreground">vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Sales Today */}
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-secondary/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wider">Sales Today</h3>
              <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-secondary" />
              </div>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">43</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary font-semibold">+8.2%</span>
              <span className="text-sm text-muted-foreground">vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Designs Created */}
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wider">Designs This Week</h3>
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">24</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">12 mockups created</span>
            </div>
          </div>
        </div>

        {/* Active Listings */}
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-accent/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wider">Active Listings</h3>
              <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-accent" />
              </div>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">187</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Across 3 platforms</span>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: Workflow Pipeline */}
      <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
          Your Creative Workflow
        </h2>

        <div className="grid grid-cols-4 gap-6">
          {/* Stage 1: Designs */}
          <button
            onClick={() => {
              console.log("[v0] 🎨 Navigating to Generate")
              router.push("/generate")
            }}
            className="relative group w-full text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-xl" />
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
            <div className="relative bg-background/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Designs</h3>
              <div className="text-3xl font-bold text-primary mb-2">24</div>
              <p className="text-xs text-muted-foreground">Generated this month</p>
            </div>
          </button>

          {/* Stage 2: Mockups */}
          <button
            onClick={() => {
              console.log("[v0] 📱 Navigating to Mockups")
              router.push("/mockups")
            }}
            className="relative group w-full text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent rounded-2xl blur-xl" />
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
            <div className="relative bg-background/50 border border-border rounded-2xl p-6 hover:border-accent/50 transition-all cursor-pointer">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-5 h-5 text-accent" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
                  <Camera className="w-6 h-6 text-accent-foreground" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Mockups</h3>
              <div className="text-3xl font-bold text-accent mb-2">96</div>
              <p className="text-xs text-muted-foreground">From 24 designs</p>
            </div>
          </button>

          {/* Stage 3: Listings */}
          <button
            onClick={() => {
              console.log("[v0] 🏪 Navigating to Marketplace")
              router.push("/marketplace")
            }}
            className="relative group w-full text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent rounded-2xl blur-xl" />
            <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
            <div className="relative bg-background/50 border border-border rounded-2xl p-6 hover:border-secondary/50 transition-all cursor-pointer">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl flex items-center justify-center shadow-lg shadow-secondary/30">
                  <ShoppingBag className="w-6 h-6 text-secondary-foreground" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted group-hover:text-secondary transition-colors" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Listings</h3>
              <div className="text-3xl font-bold text-secondary mb-2">187</div>
              <p className="text-xs text-muted-foreground">Live on marketplaces</p>
            </div>
          </button>

          {/* Stage 4: Revenue */}
          <button
            onClick={() => {
              console.log("[v0] 💰 Navigating to Analytics")
              router.push("/analytics")
            }}
            className="relative group w-full text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-transparent rounded-2xl blur-xl" />
            <div className="absolute inset-0 bg-success/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
            <div className="relative bg-background/50 border border-border rounded-2xl p-6 hover:border-success/50 transition-all">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-5 h-5 text-success" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-xl flex items-center justify-center shadow-lg shadow-success/30">
                  <DollarSign className="w-6 h-6 text-success-foreground" />
                </div>
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Revenue</h3>
              <div className="text-3xl font-bold text-success mb-2">$15.2K</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
          </button>
        </div>
      </div>

      {/* BOTTOM ROW: Two Columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* LEFT: Trending Now */}
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Trending Now
            </h3>
            <button className="text-sm text-accent hover:text-accent/80 transition-colors">View All</button>
          </div>

          <div className="space-y-4">
            {[
              { trend: "Cottagecore aesthetic", change: "+245%", color: "text-accent" },
              { trend: "Retro 70s fonts", change: "+189%", color: "text-accent" },
              { trend: "Earth tones palette", change: "+156%", color: "text-accent" },
              { trend: "Hand-drawn illustrations", change: "+134%", color: "text-accent" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-background/50 rounded-xl hover:bg-card transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent/80 rounded-full" />
                  <span className="text-sm font-medium text-foreground">{item.trend}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${item.color}`}>{item.change}</span>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 hover:border-accent/50 rounded-xl text-sm font-semibold text-accent transition-all">
            Unlock Full Trend Intelligence →
          </button>
        </div>

        {/* RIGHT: Recent Activity */}
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              Recent Activity
            </h3>
            <button className="text-sm text-accent hover:text-accent/80 transition-colors">View All</button>
          </div>

          <div className="space-y-3">
            {[
              {
                action: "New order",
                detail: "Summer T-Shirt #12345",
                platform: "Etsy",
                time: "2m ago",
                icon: ShoppingCart,
                color: "success",
              },
              {
                action: "Design generated",
                detail: '"Vintage Coffee" approved',
                platform: "AI",
                time: "15m ago",
                icon: Sparkles,
                color: "primary",
              },
              {
                action: "Mockup created",
                detail: "12 variations for Holiday Mug",
                platform: "AI",
                time: "32m ago",
                icon: Camera,
                color: "accent",
              },
              {
                action: "Low stock alert",
                detail: "Summer Tee (3 left)",
                platform: "Inventory",
                time: "1h ago",
                icon: AlertTriangle,
                color: "destructive",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 hover:bg-background/50 rounded-lg transition-all cursor-pointer group"
              >
                <div
                  className={`w-8 h-8 bg-${item.color}/20 rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <item.icon className={`w-4 h-4 text-${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">{item.action}</span>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                      {item.platform}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="bg-gradient-to-r from-card/80 to-card/40 backdrop-blur-xl border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="grid grid-cols-5 gap-3">
          <button
            onClick={() => setActiveModule("generate")}
            className="group p-4 bg-background/50 hover:bg-card border border-border hover:border-border/50 rounded-xl transition-all"
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="text-xs font-medium text-foreground text-center">Generate Design</div>
          </button>

          <button
            onClick={() => setActiveModule("mockups")}
            className="group p-4 bg-background/50 hover:bg-card border border-border hover:border-border/50 rounded-xl transition-all"
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-accent" />
            </div>
            <div className="text-xs font-medium text-foreground text-center">Create Mockup</div>
          </button>

          <button
            onClick={() => setActiveModule("edit")}
            className="group p-4 bg-background/50 hover:bg-card border border-border hover:border-border/50 rounded-xl transition-all"
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Edit className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-xs font-medium text-foreground text-center">Edit Design</div>
          </button>

          <button
            onClick={() => setActiveModule("marketplace")}
            className="group p-4 bg-background/50 hover:bg-card border border-border hover:border-border/50 rounded-xl transition-all"
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-success/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6 text-success" />
            </div>
            <div className="text-xs font-medium text-foreground text-center">New Listing</div>
          </button>

          <button
            onClick={() => setActiveModule("analytics")}
            className="group p-4 bg-background/50 hover:bg-card border border-border hover:border-border/50 rounded-xl transition-all"
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart className="w-6 h-6 text-accent" />
            </div>
            <div className="text-xs font-medium text-foreground text-center">View Analytics</div>
          </button>
        </div>
      </div>
    </div>
  )
}
