"use client"

import type React from "react"

import { useEffect } from "react"
import { ProjectProvider } from "@/context/project-context"
import { LibraryProvider } from "@/context/library-context"
import { IntegrationsProvider } from "@/context/integrations-context"
import { MarketplaceProvider } from "@/context/marketplace-context"
import { ThemeProvider } from "@/context/theme-context"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { ErrorBoundary } from "@/components/error-boundary"

function UnhandledRejectionHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("[v0] Unhandled promise rejection:", event.reason)
      event.preventDefault()
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    return () => window.removeEventListener("unhandledrejection", handleUnhandledRejection)
  }, [])

  return null
}

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <LibraryProvider>
          <IntegrationsProvider>
            <MarketplaceProvider>
              <ErrorBoundary>
                <UnhandledRejectionHandler />
                <div className="min-h-screen bg-background">
                  <AppSidebar />
                  <div className="md:ml-20 ml-0">
                    <AppHeader />
                    <main className="p-4 md:p-6">{children}</main>
                  </div>
                </div>
              </ErrorBoundary>
            </MarketplaceProvider>
          </IntegrationsProvider>
        </LibraryProvider>
      </ProjectProvider>
    </ThemeProvider>
  )
}

export default ClientLayout
