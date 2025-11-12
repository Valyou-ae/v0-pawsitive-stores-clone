"use client"

import { useLibraryContext } from "@/context/library-context"
import { LibraryCard } from "./library-card"
import { LibraryEmptyState } from "./library-empty-state"

export function LibraryGrid() {
  const { filteredItems } = useLibraryContext()

  if (filteredItems.length === 0) {
    return <LibraryEmptyState />
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {filteredItems.map((item) => (
        <LibraryCard key={item.id} item={item} />
      ))}
    </div>
  )
}
