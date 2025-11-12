"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Download, Camera, Check, Filter, Grid, List, CheckCircle, ShoppingBag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateMockupImages } from "@/lib/gemini-service"
import { useProjectContext } from "@/context/project-context"
import { useRouter, useSearchParams } from "next/navigation"

const productTypes = ["T-Shirt", "Hoodie", "Mug", "Poster", "Phone Case", "Tote Bag", "Sticker", "Pillow"]

const brandColors = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
  { name: "Gray", hex: "#9CA3AF" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#10B981" },
  { name: "Yellow", hex: "#F59E0B" },
]

const ethnicities = ["Any", "Caucasian", "African", "Asian", "Hispanic", "Middle Eastern", "Mixed"]

interface UploadedFile {
  id: string
  name: string
  url: string
  file: File
}

interface GeneratedMockup {
  id: string
  designName: string
  product: string
  color: string
  colorHex: string
  url: string
  number: number
}

export function MockupGenerator() {
  const { toast } = useToast()
  const { createProject, addMockupsToProject, getProject } = useProjectContext()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [product, setProduct] = useState("T-Shirt")
  const [gender, setGender] = useState("any")
  const [ethnicity, setEthnicity] = useState("Any")
  const [minAge, setMinAge] = useState(25)
  const [maxAge, setMaxAge] = useState(35)
  const [sceneDescription, setSceneDescription] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>(["White", "Black"])
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mockups, setMockups] = useState<GeneratedMockup[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [preloadedDesigns, setPreloadedDesigns] = useState<any[]>([])
  const hasLoadedProject = useRef(false)

  useEffect(() => {
    const projectId = searchParams.get("projectId")

    if (projectId && !hasLoadedProject.current) {
      console.log("📦 Mockups module loaded with projectId:", projectId)

      const project = getProject(projectId)
      console.log("📦 Found project:", project)

      if (project?.designs && project.designs.length > 0) {
        setPreloadedDesigns(project.designs)
        setCurrentProjectId(projectId)

        const files: UploadedFile[] = project.designs.map((design) => ({
          id: design.id,
          name: design.name,
          url: design.url,
          file: new File([], design.name),
        }))
        setUploadedFiles(files)
        hasLoadedProject.current = true

        console.log("✅ Pre-loaded", project.designs.length, "designs")

        toast({
          title: "Designs Loaded",
          description: `${project.designs.length} design${project.designs.length > 1 ? "s" : ""} ready for mockups`,
        })
      } else {
        console.log("⚠️ No designs found in project")
      }
    }
  }, [searchParams, getProject, toast])

  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [showSuccessNotification])

  useEffect(() => {
    if (mockups.length > 0 && !showSuccessNotification) {
      setShowSuccessNotification(true)
    }
  }, [mockups.length, showSuccessNotification])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = useCallback((files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
  }, [])

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id))
  }

  const toggleColor = (colorName: string) => {
    if (selectedColors.includes(colorName)) {
      setSelectedColors(selectedColors.filter((c) => c !== colorName))
    } else {
      setSelectedColors([...selectedColors, colorName])
    }
  }

  const totalMockups = uploadedFiles.length * selectedColors.length * 4

  const handleGenerate = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No designs uploaded",
        description: "Please upload at least one design file",
        variant: "destructive",
      })
      return
    }

    if (selectedColors.length === 0) {
      toast({
        title: "No colors selected",
        description: "Please select at least one color",
        variant: "destructive",
      })
      return
    }

    setGenerating(true)
    setProgress(0)
    setMockups([])
    setShowSuccessNotification(false)

    let mockupNumber = 1
    const allGeneratedMockups: GeneratedMockup[] = []

    try {
      for (const file of uploadedFiles) {
        let designFile: File

        if (file.file.size === 0) {
          console.log("[v0] Converting pre-loaded design URL to File:", file.url)
          const response = await fetch(file.url)
          const blob = await response.blob()

          const mimeType = blob.type || "image/png"
          const extension = mimeType.split("/")[1] || "png"

          designFile = new File([blob], file.name || `design.${extension}`, { type: mimeType })
          console.log("[v0] Converted to File with MIME type:", mimeType)
        } else {
          designFile = file.file
        }

        const generator = generateMockupImages(designFile, {
          product,
          style: "Studio",
          colors: selectedColors,
          gender: gender !== "any" ? gender : undefined,
          ethnicity: ethnicity !== "Any" ? ethnicity : undefined,
          age: `${minAge}-${maxAge}`,
          scene: sceneDescription || undefined,
        })

        for await (const { imageUrl, color, colorHex } of generator) {
          const designNameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
          const mockup: GeneratedMockup = {
            id: Math.random().toString(36).substr(2, 9),
            designName: designNameWithoutExt,
            product,
            color,
            colorHex,
            url: imageUrl,
            number: mockupNumber++,
          }

          allGeneratedMockups.push(mockup)
          setMockups((prev) => [mockup, ...prev])
          setProgress((mockupNumber / totalMockups) * 100)
        }
      }

      if (currentProjectId && allGeneratedMockups.length > 0) {
        const mockupObjects = allGeneratedMockups.map((mockup) => ({
          id: mockup.id,
          designId: uploadedFiles[0]?.id || "unknown",
          productType: mockup.product,
          color: mockup.color,
          url: mockup.url,
          createdAt: new Date(),
        }))

        addMockupsToProject(currentProjectId, mockupObjects)
        console.log("✅ Saved", mockupObjects.length, "mockups to project:", currentProjectId)
      }

      toast({
        title: "Mockups generated!",
        description: `Created ${totalMockups} unique mockup variations`,
      })
    } catch (error) {
      console.error("[v0] Error generating mockups:", error)
      toast({
        title: "Generation failed",
        description: "Could not generate mockups. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadAll = () => {
    toast({
      title: "Preparing download",
      description: `Packaging ${mockups.length} mockups into .zip file`,
    })
  }

  return (
    <div className="grid grid-cols-[33%_67%] gap-6 h-[calc(100vh-120px)]">
      <div className="overflow-y-auto pr-2">
        <div className="sticky top-0 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
          {/* Upload Designs Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400 uppercase tracking-wider">Upload Designs</label>
              {uploadedFiles.length > 0 && (
                <span className="text-xs text-slate-500">{uploadedFiles.length} uploaded</span>
              )}
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive ? "border-cyan-500 bg-cyan-500/10" : "border-white/20 hover:border-white/30"
              }`}
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
              <p className="text-sm font-medium text-white mb-1">Drop designs here</p>
              <p className="text-xs text-slate-500 mb-3">PNG, JPG up to 10MB</p>
              <label htmlFor="file-upload">
                <span className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-white cursor-pointer transition-all">
                  Browse Files
                </span>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {preloadedDesigns.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-300">Loaded from Project</p>
                  <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-semibold text-purple-300">
                    {preloadedDesigns.length} design{preloadedDesigns.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {preloadedDesigns.map((design, index) => (
                    <div
                      key={design.id || index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-slate-800 border border-purple-500/30"
                    >
                      <img
                        src={design.url || "/placeholder.svg"}
                        alt={design.name || `Design ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23334155' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fill='%2394a3b8' fontFamily='sans-serif' fontSize='12'%3EImage%3C/text%3E%3C/svg%3E`
                        }}
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-xs font-medium text-white truncate">
                          {design.name || `Design ${index + 1}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadedFiles.length > 0 && preloadedDesigns.length === 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Uploaded Designs</span>
                  <button onClick={() => setUploadedFiles([])} className="text-xs text-cyan-400 hover:text-cyan-300">
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {uploadedFiles.map((file, i) => (
                    <div
                      key={file.id}
                      className="relative aspect-square rounded-lg overflow-hidden bg-slate-800 border border-white/10 group"
                    >
                      <img
                        src={file.url || "/placeholder.svg"}
                        className="w-full h-full object-cover"
                        alt={file.name}
                        onError={(e) => {
                          e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23334155' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fill='%2394a3b8' fontFamily='sans-serif' fontSize='12'%3EImage%3C/text%3E%3C/svg%3E`
                        }}
                      />
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-xs font-semibold text-white">
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Product Type */}
          <div className="space-y-3">
            <label className="text-xs text-slate-400 uppercase tracking-wider">Product Type</label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950/50 border border-white/10 focus:border-cyan-500/50 rounded-lg text-sm text-white outline-none transition-all"
            >
              {productTypes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400 uppercase tracking-wider">Product Colors</label>
              <span className="text-xs text-slate-500">{selectedColors.length} selected</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {brandColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className={`
                    relative aspect-square rounded-lg border-2 transition-all
                    ${
                      selectedColors.includes(color.name)
                        ? "border-cyan-500 ring-2 ring-cyan-500/30 scale-105"
                        : "border-white/10 hover:border-white/20"
                    }
                  `}
                  style={{ backgroundColor: color.hex }}
                >
                  {selectedColors.includes(color.name) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check
                        className={`w-5 h-5 ${color.name === "White" ? "text-gray-900" : "text-white"} stroke-[3]`}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="space-y-3">
            <label className="text-xs text-slate-400 uppercase tracking-wider">Model Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "male", label: "Male", icon: "👨" },
                { value: "female", label: "Female", icon: "👩" },
                { value: "any", label: "Any", icon: "👤" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGender(option.value)}
                  className={`
                    p-3 rounded-xl border-2 transition-all text-center
                    ${
                      gender === option.value
                        ? "border-cyan-500 bg-cyan-500/10"
                        : "border-white/10 hover:border-white/20"
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-sm font-medium text-white">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Ethnicity */}
          <div className="space-y-3">
            <label className="text-xs text-slate-400 uppercase tracking-wider">Ethnicity</label>
            <select
              value={ethnicity}
              onChange={(e) => setEthnicity(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950/50 border border-white/10 focus:border-cyan-500/50 rounded-lg text-sm text-white outline-none transition-all"
            >
              {ethnicities.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="space-y-3">
            <label className="text-xs text-slate-400 uppercase tracking-wider">Age Range</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="18"
                max="75"
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                placeholder="25"
                className="flex-1 px-3 py-2.5 bg-slate-950/50 border border-white/10 focus:border-cyan-500/50 rounded-lg text-sm text-white outline-none transition-all"
              />
              <span className="text-slate-500">to</span>
              <input
                type="number"
                min="18"
                max="75"
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                placeholder="35"
                className="flex-1 px-3 py-2.5 bg-slate-950/50 border border-white/10 focus:border-cyan-500/50 rounded-lg text-sm text-white outline-none transition-all"
              />
            </div>
            <p className="text-xs text-slate-500">Ages 18-75</p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Scene Description */}
          <div className="space-y-3">
            <label className="text-xs text-slate-400 uppercase tracking-wider">Scene Description (Optional)</label>
            <Textarea
              placeholder="e.g., 'casual outdoor setting with natural lighting'"
              value={sceneDescription}
              onChange={(e) => setSceneDescription(e.target.value)}
              rows={3}
              className="bg-slate-950/50 border-white/10 focus:border-cyan-500/50 text-white placeholder:text-slate-600 resize-none"
            />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <button
            onClick={handleGenerate}
            disabled={uploadedFiles.length === 0 || generating}
            className="w-full relative group overflow-hidden rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-500 opacity-100 group-hover:opacity-90 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 blur-2xl opacity-60 group-hover:opacity-80 transition-opacity" />

            <div className="relative py-4 flex items-center justify-center gap-3">
              <Camera className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="font-bold text-lg text-white">
                {generating ? `Generating...` : `Generate ${totalMockups} Mockups`}
              </span>
              {!generating && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                  {totalMockups * 0.5} credits
                </span>
              )}
            </div>
          </button>

          {/* Calculation */}
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-400">
              {uploadedFiles.length} design × {selectedColors.length} colors × 4 angles = {totalMockups} mockups
            </p>
            <p className="text-xs text-slate-500">⌘ + Enter to generate</p>
          </div>

          {/* Progress */}
          {generating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </div>

      <div className="overflow-y-auto">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          {mockups.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/30">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white">Generated Mockups</h3>
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-300 font-semibold">
                  {mockups.length} mockups
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-all flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                  <button className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center">
                    <Grid className="w-4 h-4 text-white" />
                  </button>
                  <button className="w-9 h-9 rounded-md flex items-center justify-center text-slate-400">
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleDownloadAll}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download All
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {mockups.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                  <Camera className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">No mockups yet</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  Upload designs and configure settings to generate photorealistic product mockups
                </p>

                <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {[
                    { type: "T-Shirt Mockup", emoji: "👕" },
                    { type: "Mug Mockup", emoji: "☕" },
                    { type: "Poster Mockup", emoji: "🖼️" },
                  ].map((ex) => (
                    <div
                      key={ex.type}
                      className="p-6 bg-slate-900/50 backdrop-blur-xl border-2 border-dashed border-white/10 hover:border-cyan-500/50 rounded-2xl transition-all group"
                    >
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{ex.emoji}</div>
                      <p className="text-sm font-semibold text-white">{ex.type}</p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-500 mt-8">✨ High-quality AI-generated mockups in seconds</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {mockups.map((mockup) => (
                  <div
                    key={mockup.id}
                    className="group relative rounded-xl overflow-hidden border border-white/10 bg-slate-800"
                  >
                    <img
                      src={mockup.url || "/placeholder.svg"}
                      alt={`${mockup.product} mockup`}
                      className="w-full aspect-square object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23334155' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fill='%2394a3b8' fontFamily='sans-serif' fontSize='16'%3EMockup%3C/text%3E%3C/svg%3E`
                      }}
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                      <Button size="sm" variant="secondary" className="w-full">
                        Full View
                      </Button>
                      <Button size="sm" variant="secondary" className="w-full">
                        Download
                      </Button>
                    </div>
                    <div className="p-3 border-t border-white/10 space-y-1">
                      <p className="text-sm font-medium text-white line-clamp-1">{mockup.designName}</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded border border-white shadow-sm"
                          style={{ backgroundColor: mockup.colorHex }}
                        />
                        <span className="text-xs text-slate-400">{mockup.color}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showSuccessNotification && mockups.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-500">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-5 shadow-2xl backdrop-blur-xl max-w-sm">
            <button
              onClick={() => setShowSuccessNotification(false)}
              className="absolute top-2 right-2 w-6 h-6 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Mockups Ready!</p>
                <p className="text-xs text-slate-400">{mockups.length} mockups generated</p>
              </div>
            </div>

            <button
              onClick={() => {
                console.log("🏪 Navigating to marketplace with project:", currentProjectId)

                let projectId = currentProjectId
                if (!projectId) {
                  const designData = {
                    id: mockups[0].id,
                    name: mockups[0].designName,
                    url: mockups[0].url,
                    style: "Generated",
                    createdAt: new Date(),
                  }
                  const project = createProject(designData)
                  projectId = project.id

                  const mockupObjects = mockups.map((m) => ({
                    id: m.id,
                    designId: m.id,
                    productType: m.product,
                    color: m.color,
                    url: m.url,
                    createdAt: new Date(),
                  }))
                  addMockupsToProject(projectId, mockupObjects)
                }

                toast({
                  title: "Opening Marketplace",
                  description: "Create listings for your mockups",
                })

                router.push(`/marketplace?projectId=${projectId}`)
              }}
              className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Create Marketplace Listing
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
