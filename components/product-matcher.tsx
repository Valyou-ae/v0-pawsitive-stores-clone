"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Loader2, ExternalLink, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductMatch {
  id: string
  name: string
  provider: string
  category: string
  confidence: number
  price: string
  image: string
  url: string
}

const mockCatalog: ProductMatch[] = [
  {
    id: "1",
    name: "Classic Unisex T-Shirt",
    provider: "Printify",
    category: "Apparel",
    confidence: 95,
    price: "$12.99",
    image: "/plain-white-tshirt.png",
    url: "#",
  },
  {
    id: "2",
    name: "Premium Cotton Tee",
    provider: "Printful",
    category: "Apparel",
    confidence: 88,
    price: "$14.50",
    image: "/cotton-tee.jpg",
    url: "#",
  },
  {
    id: "3",
    name: "Heavyweight T-Shirt",
    provider: "CustomCat",
    category: "Apparel",
    confidence: 82,
    price: "$11.25",
    image: "/heavyweight-shirt.jpg",
    url: "#",
  },
  {
    id: "4",
    name: "Soft Style Tee",
    provider: "Gooten",
    category: "Apparel",
    confidence: 78,
    price: "$13.00",
    image: "/soft-tee.jpg",
    url: "#",
  },
]

export function ProductMatcher() {
  const { toast } = useToast()
  const [uploadedProduct, setUploadedProduct] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [matches, setMatches] = useState<ProductMatch[]>([])
  const [activeView, setActiveView] = useState<"upload" | "results" | "catalog">("upload")

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedProduct(url)
      analyzeProduct()
    }
  }

  const analyzeProduct = async () => {
    setAnalyzing(true)
    setActiveView("results")
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2500))
    setMatches(mockCatalog)
    setAnalyzing(false)
    toast({
      title: "Analysis complete!",
      description: "Found 4 matching products",
    })
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="results" disabled={!matches.length && !analyzing}>
            Results
          </TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Upload Product Screenshot</CardTitle>
              <CardDescription>
                Upload a product image and let AI find matching items from supplier catalogs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Upload Product Image</p>
                <p className="text-sm text-muted-foreground mb-6">We'll analyze it and find matching products</p>
                <Label htmlFor="product-upload">
                  <Button size="lg" asChild>
                    <span>Choose File</span>
                  </Button>
                </Label>
                <input
                  id="product-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProductUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Analysis Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {uploadedProduct && (
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Uploaded Image</Label>
                      <img
                        src={uploadedProduct || "/placeholder.svg"}
                        alt="Uploaded product"
                        className="w-full rounded-lg border"
                      />
                    </div>
                  )}

                  {analyzing ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm">Analyzing image...</span>
                      </div>
                      <Progress value={66} />
                    </div>
                  ) : matches.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Analysis Complete</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium">Apparel</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">T-Shirt</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Matches:</span>
                          <span className="font-medium">{matches.length} found</span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setActiveView("upload")}>
                    Analyze Different Product
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Matches Panel */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Matching Products</CardTitle>
                  <CardDescription>Sorted by confidence score</CardDescription>
                </CardHeader>
                <CardContent>
                  {matches.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Upload a product to see matches</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {matches.map((match) => (
                        <div
                          key={match.id}
                          className="flex gap-4 p-4 border rounded-lg hover:border-primary transition-colors"
                        >
                          <img
                            src={match.image || "/placeholder.svg"}
                            alt={match.name}
                            className="w-24 h-24 rounded object-cover"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{match.name}</h3>
                                <p className="text-sm text-muted-foreground">{match.provider}</p>
                              </div>
                              <Badge variant={match.confidence > 90 ? "default" : "secondary"} className="ml-2">
                                {match.confidence}% match
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-primary">{match.price}</span>
                              <Button size="sm" variant="outline">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="catalog">
          <Card>
            <CardHeader>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>Browse all available products from suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockCatalog.map((product) => (
                  <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.provider}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">{product.price}</span>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
