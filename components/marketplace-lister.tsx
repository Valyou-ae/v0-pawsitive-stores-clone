"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Copy, CheckCircle2, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const platforms = [
  { id: "etsy", name: "Etsy", color: "bg-orange-500" },
  { id: "amazon", name: "Amazon", color: "bg-yellow-500" },
  { id: "ebay", name: "eBay", color: "bg-blue-500" },
  { id: "shopify", name: "Shopify", color: "bg-green-500" },
]

interface Listing {
  title: string
  description: string
  tags: string[]
  price: string
}

export function MarketplaceLister() {
  const { toast } = useToast()
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["etsy"])
  const [productName, setProductName] = useState("")
  const [category, setCategory] = useState("")
  const [keywords, setKeywords] = useState("")
  const [generating, setGenerating] = useState(false)
  const [listings, setListings] = useState<Record<string, Listing>>({})

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    )
  }

  const handleGenerate = async () => {
    if (!productName || selectedPlatforms.length === 0) {
      toast({
        title: "Missing information",
        description: "Please enter product details and select at least one platform",
        variant: "destructive",
      })
      return
    }

    setGenerating(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newListings: Record<string, Listing> = {}
    selectedPlatforms.forEach((platform) => {
      newListings[platform] = {
        title: `Premium ${productName} - ${platform === "etsy" ? "Handmade Quality" : "Best Seller"}`,
        description: `Amazing ${productName} perfect for ${category}. ${
          platform === "amazon"
            ? "Fast shipping with Prime."
            : platform === "etsy"
              ? "Handcrafted with care."
              : "Great quality guaranteed."
        } Keywords: ${keywords}`,
        tags: keywords.split(",").map((k) => k.trim()),
        price: "$29.99",
      }
    })

    setListings(newListings)
    setGenerating(false)
    toast({
      title: "Listings generated!",
      description: `Created ${selectedPlatforms.length} platform-specific listing(s)`,
    })
  }

  const copyListing = (platform: string) => {
    const listing = listings[platform]
    const text = `Title: ${listing.title}\n\nDescription: ${listing.description}\n\nTags: ${listing.tags.join(", ")}\n\nPrice: ${listing.price}`
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${platform} listing copied`,
    })
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Enter details to generate optimized listings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  placeholder="e.g., Vintage Cat T-Shirt"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Apparel, Home Decor"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Textarea
                  id="keywords"
                  placeholder="cat, vintage, retro, funny..."
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>Target Platforms</Label>
                {platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={() => togglePlatform(platform.id)}
                    />
                    <Label htmlFor={platform.id} className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                      {platform.name}
                    </Label>
                  </div>
                ))}
              </div>

              <Button onClick={handleGenerate} disabled={generating} className="w-full" size="lg">
                {generating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Listings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Generated Listings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Generated Listings</CardTitle>
              <CardDescription>SEO-optimized for each platform</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(listings).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Enter product details and generate listings to see results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedPlatforms.map((platformId) => {
                    const platform = platforms.find((p) => p.id === platformId)
                    const listing = listings[platformId]
                    if (!listing || !platform) return null

                    return (
                      <div key={platformId} className="border rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${platform.color}`} />
                            <h3 className="text-lg font-semibold">{platform.name}</h3>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => copyListing(platformId)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Title</Label>
                            <p className="font-medium mt-1">{listing.title}</p>
                          </div>

                          <div>
                            <Label className="text-xs text-muted-foreground">Description</Label>
                            <p className="text-sm mt-1 leading-relaxed">{listing.description}</p>
                          </div>

                          <div>
                            <Label className="text-xs text-muted-foreground">Tags</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {listing.tags.map((tag, i) => (
                                <Badge key={i} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div>
                              <Label className="text-xs text-muted-foreground">Price</Label>
                              <p className="text-lg font-bold text-primary">{listing.price}</p>
                            </div>
                            <div className="flex items-center gap-2 text-success text-sm">
                              <CheckCircle2 className="w-4 h-4" />
                              SEO Optimized
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
