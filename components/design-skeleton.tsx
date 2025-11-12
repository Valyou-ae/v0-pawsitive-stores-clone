export function DesignSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            {/* Image placeholder */}
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl relative overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Text placeholder */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* Generation message */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-full">
          <div className="relative">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping absolute" />
            <div className="w-2 h-2 bg-cyan-500 rounded-full" />
          </div>
          <span className="text-sm font-medium text-gray-700">Creating your designs with AI magic...</span>
        </div>
      </div>
    </div>
  )
}
