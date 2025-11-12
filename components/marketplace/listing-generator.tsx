"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLibrary } from "@/context/library-context"
import { useIntegrations, type IntegrationType } from "@/context/integrations-context"
import { useMarketplace } from "@/context/marketplace-context"
import { PLATFORM_PROMPTS } from "@/lib/marketplace-prompts"
import { toast } from "sonner"

export function ListingGenerator() {
  const router = useRouter()
  const { items } = useLibrary()
  const { isConnected } = useIntegrations()
  const { addListing } = useMarketplace()

  const [step, setStep] = useState(1)
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<IntegrationType | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedListing, setGeneratedListing] = useState<any>(null)

  const platforms: { type: IntegrationType; name: string; enabled: boolean }[] = [
    { type: "etsy", name: "Etsy", enabled: true },
    { type: "shopify", name: "Shopify", enabled: true },
    { type: "printful", name: "Printful", enabled: true },
    { type: "redbubble", name: "Redbubble", enabled: false },
    { type: "amazon", name: "Amazon", enabled: false },
  ]

  const handleGenerateListing = async () => {
    if (!selectedDesign || !selectedPlatform) return

    setIsGenerating(true)

    try {
      const design = items.find((i) => i.id === selectedDesign)
      if (!design) throw new Error("Design not found")

      const systemPrompt = PLATFORM_PROMPTS[selectedPlatform] || PLATFORM_PROMPTS.etsy

      const response = await fetch("/api/generate-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designUrl: design.url,
          platform: selectedPlatform,
          systemPrompt,
        }),
      })

      if (!response.ok) throw new Error("Generation failed")

      const data = await response.json()
      setGeneratedListing({
        title: data.title,
        description: data.description,
        tags: data.tags,
        price: data.suggestedPrice || 29.99,
        platform: selectedPlatform,
        status: "draft" as const,
        designUrl: design.url,
        mockupUrl: design.type === "mockup" ? design.url : undefined,
      })

      setStep(4)
    } catch (error) {
      console.error("Generation error:", error)
      toast.error("Failed to generate listing")
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = () => {
    if (!generatedListing) return

    addListing(generatedListing)
    toast.success(`Listing ${isConnected(selectedPlatform!) ? "published" : "saved as draft"}!`)
    router.push("/marketplace")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                s <= step ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              {s < step ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 4 && <div className={`w-20 h-1 ${s < step ? "bg-purple-500" : "bg-slate-800"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Design */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Select Design from Library</h2>
          <p className="text-slate-400 text-sm">Choose a design or mockup from your library to create a listing</p>

          {items.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl">
              <p className="text-slate-400 mb-4">No items in your library yet</p>
              <Button onClick={() => router.push("/generate")} variant="outline">
                Generate Designs First
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedDesign(item.id)}
                  className={`group relative p-4 rounded-xl border-2 transition-all ${
                    selectedDesign === item.id
                      ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                      : "border-white/10 hover:border-white/20 bg-slate-900/50"
                  }`}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23334155' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fill='%2394a3b8' fontFamily='sans-serif' fontSize='14'%3EImage%3C/text%3E%3C/svg%3E`
                      }}
                    />
                    {selectedDesign === item.id && (
                      <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-slate-300">{item.type}</span>
                    {item.style && (
                      <span className="px-2 py-0.5 bg-purple-500/20 rounded text-xs text-purple-300">{item.style}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          <Button
            onClick={() => setStep(2)}
            disabled={!selectedDesign}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Next <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step 2: Select Platform */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Select Platform</h2>
          <div className="grid grid-cols-2 gap-4">
            {platforms.map((platform) => (
              <button
                key={platform.type}
                onClick={() => platform.enabled && setSelectedPlatform(platform.type)}
                disabled={!platform.enabled}
                className={`p-6 rounded-xl border-2 transition ${
                  selectedPlatform === platform.type
                    ? "border-purple-500 bg-purple-500/10"
                    : platform.enabled
                      ? "border-white/10 hover:border-white/20"
                      : "border-white/5 opacity-50 cursor-not-allowed"
                }`}
              >
                <h3 className="text-lg font-bold">{platform.name}</h3>
                {!platform.enabled && <p className="text-xs text-slate-400 mt-1">Coming Soon</p>}
                {platform.enabled && isConnected(platform.type) && (
                  <p className="text-xs text-green-400 mt-1">Connected</p>
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!selectedPlatform}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500"
            >
              Next <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Generate Listing */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Generate Listing</h2>
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-slate-300 mb-4">
              AI will generate an optimized listing for {selectedPlatform} using your design.
            </p>
            <Button
              onClick={handleGenerateListing}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 w-4 h-4" /> Generate Listing
                </>
              )}
            </Button>
          </div>
          <Button onClick={() => setStep(2)} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
        </div>
      )}

      {/* Step 4: Review & Publish */}
      {step === 4 && generatedListing && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Review & Publish</h2>
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-sm text-slate-400">Title</label>
              <Input
                value={generatedListing.title}
                onChange={(e) => setGeneratedListing({ ...generatedListing, title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Description</label>
              <Textarea
                value={generatedListing.description}
                onChange={(e) => setGeneratedListing({ ...generatedListing, description: e.target.value })}
                rows={6}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Tags</label>
              <Input
                value={generatedListing.tags.join(", ")}
                onChange={(e) =>
                  setGeneratedListing({
                    ...generatedListing,
                    tags: e.target.value.split(",").map((t: string) => t.trim()),
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Price ($)</label>
              <Input
                type="number"
                value={generatedListing.price}
                onChange={(e) => setGeneratedListing({ ...generatedListing, price: Number.parseFloat(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setStep(3)} variant="outline" className="flex-1">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <Button onClick={handlePublish} className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500">
              <Check className="mr-2 w-4 h-4" /> Publish Listing
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
