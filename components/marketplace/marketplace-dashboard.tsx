"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Plus, Grid3x3, List, Trash2, Eye, Heart, ShoppingCart, Sparkles, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import { useMarketplace } from "@/context/marketplace-context"
import { useIntegrations } from "@/context/integrations-context"
import { useLibrary } from "@/context/library-context"
import { useProjectContext } from "@/context/project-context"
import { useToast } from "@/hooks/use-toast"

export function MarketplaceDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { listings, deleteListing } = useMarketplace()
  const { isConnected } = useIntegrations()
  const { items } = useLibrary()
  const { getProject } = useProjectContext()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterPlatform, setFilterPlatform] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [projectItems, setProjectItems] = useState<any[]>([])

  useEffect(() => {
    const projectId = searchParams.get("projectId")

    if (projectId) {
      console.log("🏪 Marketplace loaded with projectId:", projectId)

      const project = getProject(projectId)
      console.log("🏪 Found project:", project)

      if (project) {
        const projectLibraryItems = items.filter((item) => item.projectId === projectId)
        setProjectItems(projectLibraryItems)

        console.log("✅ Found", projectLibraryItems.length, "items from project")

        toast({
          title: "Project Loaded",
          description: `${projectLibraryItems.length} item${projectLibraryItems.length !== 1 ? "s" : ""} available for listing`,
        })
      }
    }
  }, [searchParams, getProject, items, toast])

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPlatform = filterPlatform === "all" || listing.platform === filterPlatform
      const matchesStatus = filterStatus === "all" || listing.status === filterStatus
      return matchesSearch && matchesPlatform && matchesStatus
    })
  }, [listings, searchQuery, filterPlatform, filterStatus])

  const stats = useMemo(() => {
    return {
      totalDesigns: items.filter((i) => i.type === "design").length,
      totalMockups: items.filter((i) => i.type === "mockup").length,
      totalListings: listings.length,
      publishedListings: listings.filter((l) => l.status === "published").length,
    }
  }, [items, listings])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <PageHeader
        icon={<ShoppingCart className="w-6 h-6" />}
        title="Marketplace"
        description="Manage your product listings across platforms"
        gradient="from-purple-500 to-blue-500"
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Designs</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold">{stats.totalDesigns}</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Mockups</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold">{stats.totalMockups}</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Listings</span>
            <ShoppingCart className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold">{stats.totalListings}</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Published</span>
            <Eye className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold">{stats.publishedListings}</p>
        </div>
      </div>

      {projectItems.length > 0 && (
        <div className="mb-6 p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Ready to List</h3>
              <p className="text-sm text-slate-400">
                {projectItems.length} item{projectItems.length !== 1 ? "s" : ""} from your project
              </p>
            </div>
            <Button
              onClick={() => router.push("/marketplace/create")}
              className="bg-gradient-to-r from-purple-500 to-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Listing
            </Button>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {projectItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="relative aspect-square rounded-lg overflow-hidden border border-purple-500/30 group cursor-pointer"
                onClick={() => router.push("/marketplace/create")}
              >
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
            {projectItems.length > 6 && (
              <div className="aspect-square rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-sm text-slate-400">
                +{projectItems.length - 6} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search listings..."
              className="pl-10 bg-slate-900/50 border-white/10"
            />
          </div>
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-white"
          >
            <option value="all">All Platforms</option>
            <option value="etsy">Etsy</option>
            <option value="shopify">Shopify</option>
            <option value="printful">Printful</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-white/10" : ""}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-white/10" : ""}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => router.push("/marketplace/create")}
            className="bg-gradient-to-r from-purple-500 to-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Listing
          </Button>
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No listings yet</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            {items.length > 0
              ? "You have designs in your library. Create your first listing to start selling!"
              : "Generate some designs first, then create listings to sell your products."}
          </p>
          <div className="flex items-center justify-center gap-4">
            {items.length > 0 ? (
              <Button
                onClick={() => router.push("/marketplace/create")}
                className="bg-gradient-to-r from-purple-500 to-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" /> Create Listing
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => router.push("/generate")}
                  className="bg-gradient-to-r from-purple-500 to-blue-500"
                >
                  <Sparkles className="w-4 h-4 mr-2" /> Generate Designs
                </Button>
                <Button onClick={() => router.push("/library")} variant="outline">
                  View Library
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-3 gap-6" : "space-y-4"}>
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition group"
            >
              <div className="relative aspect-square">
                <img
                  src={listing.mockupUrl || listing.designUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23334155' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fill='%2394a3b8' fontFamily='sans-serif' fontSize='16'%3EListing%3C/text%3E%3C/svg%3E`
                  }}
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-semibold text-white border border-white/20 capitalize">
                  {listing.status}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1 truncate text-white">{listing.title}</h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-slate-400 capitalize">{listing.platform}</p>
                  <p className="text-lg font-bold text-white">${listing.price}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-4 border-b border-white/10">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {listing.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {listing.favorites}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShoppingCart className="w-3 h-3" /> {listing.sales}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      deleteListing(listing.id)
                      toast({
                        title: "Listing deleted",
                        description: "The listing has been removed",
                      })
                    }}
                    className="text-red-400 hover:text-red-300 border-red-400/30 hover:border-red-400/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
