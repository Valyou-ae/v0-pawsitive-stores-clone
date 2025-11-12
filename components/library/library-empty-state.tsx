"use client"

import { FolderOpen, Sparkles, Camera } from "lucide-react"
import { useRouter } from "next/navigation"

export function LibraryEmptyState() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-xl shadow-purple-500/30">
          <FolderOpen className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">No items found</h3>
        <p className="text-slate-400 mb-8">Start creating designs and mockups to see them here</p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => router.push("/generate")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 rounded-xl text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Generate Design
          </button>
          <button
            onClick={() => router.push("/mockups")}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold text-white transition-all"
          >
            <Camera className="w-4 h-4" />
            Create Mockup
          </button>
        </div>
      </div>
    </div>
  )
}
