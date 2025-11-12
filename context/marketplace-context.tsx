"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { safeStringify, safeParse } from "@/lib/storage-utils"
import type { IntegrationType } from "./integrations-context"

export interface Listing {
  id: string
  title: string
  description: string
  tags: string[]
  price: number
  platform: IntegrationType
  status: "draft" | "published" | "scheduled"
  designUrl: string
  mockupUrl?: string
  createdAt: Date
  publishedAt?: Date
  views: number
  favorites: number
  sales: number
}

interface MarketplaceContextType {
  listings: Listing[]
  addListing: (listing: Omit<Listing, "id" | "createdAt" | "views" | "favorites" | "sales">) => void
  updateListing: (id: string, updates: Partial<Listing>) => void
  deleteListing: (id: string) => void
  publishListing: (id: string) => void
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined)

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([])

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("genmock_listings")
    if (stored) {
      const parsed = safeParse(stored)
      setListings(parsed || [])
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (listings.length > 0) {
      localStorage.setItem("genmock_listings", safeStringify(listings))
    }
  }, [listings])

  const addListing = (listing: Omit<Listing, "id" | "createdAt" | "views" | "favorites" | "sales">) => {
    const newListing: Listing = {
      ...listing,
      id: `listing-${Date.now()}`,
      createdAt: new Date(),
      views: 0,
      favorites: 0,
      sales: 0,
    }
    setListings((prev) => [newListing, ...prev])
  }

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id))
  }

  const publishListing = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "published" as const, publishedAt: new Date() } : l)),
    )
  }

  return (
    <MarketplaceContext.Provider
      value={{
        listings,
        addListing,
        updateListing,
        deleteListing,
        publishListing,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  )
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext)
  if (!context) {
    throw new Error("useMarketplace must be used within MarketplaceProvider")
  }
  return context
}
