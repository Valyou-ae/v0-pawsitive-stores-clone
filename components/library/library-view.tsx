"use client"
import { PageHeader } from "@/components/page-header"
import { LibraryHeader } from "./library-header"
import { LibrarySidebar } from "./library-sidebar"
import { LibraryGrid } from "./library-grid"
import { LibraryList } from "./library-list"
import { LibraryBulkActions } from "./library-bulk-actions"
import { useLibraryContext } from "@/context/library-context"
import { FolderOpen } from "lucide-react"

export function LibraryView() {
  const { view, filteredItems, selectedIds } = useLibraryContext()

  return (
    <>
      <PageHeader
        icon={<FolderOpen className="w-6 h-6 text-white" />}
        title="Library"
        description="Access and manage all your designs and mockups"
        gradient="from-purple-500 to-blue-500"
      />

      <div className="p-6 space-y-6">
        {/* Header with search and controls */}
        <LibraryHeader />

        {/* Main content area */}
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar with filters */}
          <LibrarySidebar />

          {/* Content area */}
          <div className="col-span-3 space-y-4">
            {/* Stats bar */}
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>
                Showing {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
              </span>
              {selectedIds.length > 0 && (
                <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 font-semibold">
                  {selectedIds.length} selected
                </span>
              )}
            </div>

            {/* Grid or List view */}
            {view === "grid" ? <LibraryGrid /> : <LibraryList />}
          </div>
        </div>

        {/* Bulk actions toolbar */}
        {selectedIds.length > 0 && <LibraryBulkActions />}
      </div>
    </>
  )
}
