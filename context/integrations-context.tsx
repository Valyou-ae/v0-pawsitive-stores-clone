"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { safeStringify, safeParse } from "@/lib/storage-utils"

export type IntegrationType = "etsy" | "shopify" | "printful" | "redbubble" | "amazon" | "stripe"

export interface Integration {
  id: string
  type: IntegrationType
  name: string
  status: "connected" | "disconnected" | "error"
  isMock: boolean // true for simulated connections
  connectedAt: Date | null
  lastSynced: Date | null
  settings?: Record<string, any>
}

interface IntegrationsContextType {
  integrations: Integration[]
  connectIntegration: (type: IntegrationType) => void
  disconnectIntegration: (id: string) => void
  isConnected: (type: IntegrationType) => boolean
  getIntegration: (type: IntegrationType) => Integration | undefined
}

const IntegrationsContext = createContext<IntegrationsContextType | undefined>(undefined)

export function IntegrationsProvider({ children }: { children: ReactNode }) {
  const [integrations, setIntegrations] = useState<Integration[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("genmock_integrations")
    if (stored) {
      const parsed = safeParse(stored)
      setIntegrations(parsed || [])
    }
  }, [])

  // Save to localStorage whenever integrations change
  useEffect(() => {
    if (integrations.length > 0) {
      localStorage.setItem("genmock_integrations", safeStringify(integrations))
    }
  }, [integrations])

  const connectIntegration = (type: IntegrationType) => {
    const names = {
      etsy: "Etsy",
      shopify: "Shopify",
      printful: "Printful",
      redbubble: "Redbubble",
      amazon: "Amazon",
      stripe: "Stripe",
    }

    const newIntegration: Integration = {
      id: `${type}-${Date.now()}`,
      type,
      name: names[type],
      status: "connected",
      isMock: true, // All connections are mocked for now
      connectedAt: new Date(),
      lastSynced: new Date(),
      settings: {},
    }

    setIntegrations((prev) => [...prev.filter((i) => i.type !== type), newIntegration])
  }

  const disconnectIntegration = (id: string) => {
    setIntegrations((prev) => prev.filter((i) => i.id !== id))
  }

  const isConnected = (type: IntegrationType) => {
    return integrations.some((i) => i.type === type && i.status === "connected")
  }

  const getIntegration = (type: IntegrationType) => {
    return integrations.find((i) => i.type === type && i.status === "connected")
  }

  return (
    <IntegrationsContext.Provider
      value={{
        integrations,
        connectIntegration,
        disconnectIntegration,
        isConnected,
        getIntegration,
      }}
    >
      {children}
    </IntegrationsContext.Provider>
  )
}

export function useIntegrations() {
  const context = useContext(IntegrationsContext)
  if (!context) {
    throw new Error("useIntegrations must be used within IntegrationsProvider")
  }
  return context
}
