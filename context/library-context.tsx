"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import { safeStringify, safeParse } from "@/lib/storage-utils"
import { useProjectContext } from "./project-context"

export type { LibraryItem }

interface LibraryItem {
  id: string
  type: "design" | "mockup"
  name: string
  url: string
  thumbnail?: string

  // Metadata
  projectId?: string
  style?: string
  prompt?: string
  tags: string[]
  categories: string[]
  isFavorite: boolean

  // Stats
  views: number
  downloads: number
  uses: number

  // Timestamps
  createdAt: Date
  updatedAt: Date
  lastViewedAt?: Date

  // Sharing
  shareId?: string
  shareEnabled: boolean

  // File info
  fileSize: number
  dimensions: { width: number; height: number }
}

interface Collection {
  id: string
  name: string
  description: string
  itemIds: string[]
  coverImage: string
  createdAt: Date
}

interface FilterState {
  type: ("design" | "mockup")[]
  styles: string[]
  dateRange: { start: Date; end: Date } | null
  tags: string[]
  favorites: boolean
  projectId?: string
  searchQuery: string
}

interface LibraryContextType {
  items: LibraryItem[]
  collections: Collection[]
  filters: FilterState
  view: "grid" | "list"
  sortBy: "date" | "name" | "views" | "downloads"
  sortOrder: "asc" | "desc"
  selectedIds: string[]

  // Item operations
  addItem: (item: Omit<LibraryItem, "id" | "createdAt" | "updatedAt">) => void
  updateItem: (id: string, updates: Partial<LibraryItem>) => void
  deleteItem: (id: string) => void

  // Bulk operations
  bulkDelete: (ids: string[]) => void
  bulkTag: (ids: string[], tags: string[]) => void
  bulkMove: (ids: string[], projectId: string) => void

  // Selection
  toggleSelection: (id: string) => void
  selectAll: () => void
  clearSelection: () => void

  // Filters
  setFilters: (filters: Partial<FilterState>) => void
  clearFilters: () => void

  // View & Sort
  setView: (view: "grid" | "list") => void
  setSortBy: (sortBy: "date" | "name" | "views" | "downloads") => void
  setSortOrder: (order: "asc" | "desc") => void

  // Collections
  createCollection: (name: string, description: string, itemIds: string[]) => void
  deleteCollection: (id: string) => void
  addToCollection: (collectionId: string, itemIds: string[]) => void

  // Stats
  incrementViews: (id: string) => void
  incrementDownloads: (id: string) => void

  // Filtered & sorted items
  filteredItems: LibraryItem[]
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined)

const defaultFilters: FilterState = {
  type: [],
  styles: [],
  dateRange: null,
  tags: [],
  favorites: false,
  searchQuery: "",
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { allProjects } = useProjectContext()

  // Load from localStorage
  const [items, setItems] = useState<LibraryItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("genmock_library_items")
      return saved ? safeParse(saved) : []
    }
    return []
  })

  const [collections, setCollections] = useState<Collection[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("genmock_library_collections")
      return saved ? safeParse(saved) : []
    }
    return []
  })

  const [filters, setFiltersState] = useState<FilterState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("genmock_library_filters")
      return saved ? safeParse(saved) : defaultFilters
    }
    return defaultFilters
  })

  const [view, setView] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("genmock_library_view") as "grid" | "list") || "grid"
    }
    return "grid"
  })

  const [sortBy, setSortBy] = useState<"date" | "name" | "views" | "downloads">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("genmock_library_sortBy") as any) || "date"
    }
    return "date"
  })

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("genmock_library_sortOrder") as "asc" | "desc") || "desc"
    }
    return "desc"
  })

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    const syncWithProjects = () => {
      const existingIds = new Set(items.map((item) => item.id))
      const newItems: LibraryItem[] = []

      allProjects.forEach((project) => {
        // Add designs
        project.designs.forEach((design) => {
          if (!existingIds.has(design.id)) {
            newItems.push({
              id: design.id,
              type: "design",
              name: design.name,
              url: design.url,
              projectId: project.id,
              style: design.style,
              tags: [],
              categories: [],
              isFavorite: false,
              views: 0,
              downloads: 0,
              uses: 0,
              createdAt: design.createdAt,
              updatedAt: new Date(),
              shareEnabled: false,
              fileSize: 0,
              dimensions: { width: 1024, height: 1024 },
            })
          }
        })

        // Add mockups
        project.mockups.forEach((mockup) => {
          if (!existingIds.has(mockup.id)) {
            newItems.push({
              id: mockup.id,
              type: "mockup",
              name: `Mockup - ${mockup.productType}`,
              url: mockup.url,
              projectId: project.id,
              tags: [mockup.productType, mockup.color],
              categories: ["mockup"],
              isFavorite: false,
              views: 0,
              downloads: 0,
              uses: 0,
              createdAt: mockup.createdAt,
              updatedAt: new Date(),
              shareEnabled: false,
              fileSize: 0,
              dimensions: { width: 1024, height: 1024 },
            })
          }
        })
      })

      if (newItems.length > 0) {
        setItems((prev) => [...newItems, ...prev])
      }
    }

    syncWithProjects()
  }, [allProjects])

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("genmock_library_items", safeStringify(items))
    }
  }, [items])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("genmock_library_collections", safeStringify(collections))
    }
  }, [collections])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("genmock_library_filters", safeStringify(filters))
    }
  }, [filters])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("genmock_library_view", view)
    }
  }, [view])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("genmock_library_sortBy", sortBy)
    }
  }, [sortBy])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("genmock_library_sortOrder", sortOrder)
    }
  }, [sortOrder])

  const filteredItems = useMemo(() => {
    let result = [...items]

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.prompt?.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Type filter
    if (filters.type.length > 0) {
      result = result.filter((item) => filters.type.includes(item.type))
    }

    // Style filter
    if (filters.styles.length > 0) {
      result = result.filter((item) => item.style && filters.styles.includes(item.style))
    }

    // Favorites filter
    if (filters.favorites) {
      result = result.filter((item) => item.isFavorite)
    }

    // Project filter
    if (filters.projectId) {
      result = result.filter((item) => item.projectId === filters.projectId)
    }

    // Date range filter
    if (filters.dateRange) {
      result = result.filter(
        (item) => item.createdAt >= filters.dateRange!.start && item.createdAt <= filters.dateRange!.end,
      )
    }

    // Sort
    result.sort((a, b) => {
      let compareValue = 0

      switch (sortBy) {
        case "date":
          compareValue = a.createdAt.getTime() - b.createdAt.getTime()
          break
        case "name":
          compareValue = a.name.localeCompare(b.name)
          break
        case "views":
          compareValue = a.views - b.views
          break
        case "downloads":
          compareValue = a.downloads - b.downloads
          break
      }

      return sortOrder === "asc" ? compareValue : -compareValue
    })

    return result
  }, [items, filters, sortBy, sortOrder])

  // Item operations
  const addItem = useCallback((item: Omit<LibraryItem, "id" | "createdAt" | "updatedAt">) => {
    const newItem: LibraryItem = {
      ...item,
      id: `library_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setItems((prev) => [newItem, ...prev])
  }, [])

  const updateItem = useCallback((id: string, updates: Partial<LibraryItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item)))
  }, [])

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
  }, [])

  // Bulk operations
  const bulkDelete = useCallback((ids: string[]) => {
    setItems((prev) => prev.filter((item) => !ids.includes(item.id)))
    setSelectedIds([])
  }, [])

  const bulkTag = useCallback((ids: string[], tags: string[]) => {
    setItems((prev) =>
      prev.map((item) =>
        ids.includes(item.id) ? { ...item, tags: [...new Set([...item.tags, ...tags])], updatedAt: new Date() } : item,
      ),
    )
  }, [])

  const bulkMove = useCallback((ids: string[], projectId: string) => {
    setItems((prev) =>
      prev.map((item) => (ids.includes(item.id) ? { ...item, projectId, updatedAt: new Date() } : item)),
    )
  }, [])

  // Selection
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]))
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds(filteredItems.map((item) => item.id))
  }, [filteredItems])

  const clearSelection = useCallback(() => {
    setSelectedIds([])
  }, [])

  // Filters
  const setFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const clearFilters = useCallback(() => {
    setFiltersState(defaultFilters)
  }, [])

  // Collections
  const createCollection = useCallback(
    (name: string, description: string, itemIds: string[]) => {
      const newCollection: Collection = {
        id: `collection_${Date.now()}`,
        name,
        description,
        itemIds,
        coverImage: items.find((item) => itemIds.includes(item.id))?.url || "",
        createdAt: new Date(),
      }
      setCollections((prev) => [newCollection, ...prev])
    },
    [items],
  )

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => prev.filter((col) => col.id !== id))
  }, [])

  const addToCollection = useCallback((collectionId: string, itemIds: string[]) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId ? { ...col, itemIds: [...new Set([...col.itemIds, ...itemIds])] } : col,
      ),
    )
  }, [])

  // Stats
  const incrementViews = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, views: item.views + 1, lastViewedAt: new Date() } : item)),
    )
  }, [])

  const incrementDownloads = useCallback((id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, downloads: item.downloads + 1 } : item)))
  }, [])

  const value = useMemo<LibraryContextType>(
    () => ({
      items,
      collections,
      filters,
      view,
      sortBy,
      sortOrder,
      selectedIds,
      addItem,
      updateItem,
      deleteItem,
      bulkDelete,
      bulkTag,
      bulkMove,
      toggleSelection,
      selectAll,
      clearSelection,
      setFilters,
      clearFilters,
      setView,
      setSortBy,
      setSortOrder,
      createCollection,
      deleteCollection,
      addToCollection,
      incrementViews,
      incrementDownloads,
      filteredItems,
    }),
    [items, collections, filters, view, sortBy, sortOrder, selectedIds, filteredItems],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibraryContext() {
  const context = useContext(LibraryContext)
  if (context === undefined) {
    throw new Error("useLibraryContext must be used within a LibraryProvider")
  }
  return context
}

export const useLibrary = useLibraryContext
