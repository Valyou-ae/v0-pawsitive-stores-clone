"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import { cleanupOldData, getStorageSize, safeStringify, safeParse } from "@/lib/storage-utils"

// Type definitions
interface Design {
  id: string
  name: string
  url: string
  style: string
  createdAt: Date
}

interface Mockup {
  id: string
  designId: string
  productType: string
  color: string
  url: string
  createdAt: Date
}

interface Listing {
  id: string
  platform: string
  title: string
  price: number
  status: "draft" | "active" | "sold"
  createdAt: Date
}

interface Project {
  id: string
  name: string
  designs: Design[]
  mockups: Mockup[]
  listings: Listing[]
  status: "draft" | "active" | "completed"
  createdAt: Date
  updatedAt: Date
}

interface ProjectContextType {
  currentProject: Project | null
  allProjects: Project[]
  createProject: (design: Design) => Project
  getProject: (id: string) => Project | undefined
  addDesignsToProject: (projectId: string, designs: Design[]) => void
  addMockupsToProject: (projectId: string, mockups: Mockup[]) => void
  addListingToProject: (projectId: string, listing: Listing) => void
  setCurrentProject: (project: Project | null) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [allProjects, setAllProjects] = useState<Project[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("genmock_projects")
      return saved ? safeParse(saved) : []
    }
    return []
  })

  // Persist to localStorage whenever projects change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storageSize = getStorageSize()
      console.log(`[v0] Current storage size: ${(storageSize / 1000000).toFixed(2)}MB`)

      // Cleanup if over 5MB
      cleanupOldData(5000000)

      localStorage.setItem("genmock_projects", safeStringify(allProjects))
    }
  }, [allProjects])

  const createProject = useCallback((design: Design): Project => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: `Project ${Date.now()}`,
      designs: [design],
      mockups: [],
      listings: [],
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setAllProjects((prev) => [...prev, newProject])
    setCurrentProject(newProject)
    return newProject
  }, [])

  const getProject = useCallback(
    (id: string): Project | undefined => {
      return allProjects.find((p) => p.id === id)
    },
    [allProjects],
  )

  const addDesignsToProject = useCallback((projectId: string, designs: Design[]) => {
    setAllProjects((prev) => {
      const projectExists = prev.find((p) => p.id === projectId)
      if (!projectExists) {
        console.warn(`[v0] Project ${projectId} not found`)
        return prev
      }

      return prev.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            designs: [...project.designs, ...designs],
            updatedAt: new Date(),
          }
        }
        return project
      })
    })
  }, [])

  const addMockupsToProject = useCallback((projectId: string, mockups: Mockup[]) => {
    setAllProjects((prev) => {
      const projectExists = prev.find((p) => p.id === projectId)
      if (!projectExists) {
        console.warn(`[v0] Project ${projectId} not found`)
        return prev
      }

      return prev.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            mockups: [...project.mockups, ...mockups],
            updatedAt: new Date(),
          }
        }
        return project
      })
    })
  }, [])

  const addListingToProject = useCallback((projectId: string, listing: Listing) => {
    setAllProjects((prev) => {
      const projectExists = prev.find((p) => p.id === projectId)
      if (!projectExists) {
        console.warn(`[v0] Project ${projectId} not found`)
        return prev
      }

      return prev.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            listings: [...project.listings, listing],
            updatedAt: new Date(),
          }
        }
        return project
      })
    })
  }, [])

  const value = useMemo<ProjectContextType>(
    () => ({
      currentProject,
      allProjects,
      createProject,
      getProject,
      addDesignsToProject,
      addMockupsToProject,
      addListingToProject,
      setCurrentProject,
    }),
    [
      currentProject,
      allProjects,
      createProject,
      getProject,
      addDesignsToProject,
      addMockupsToProject,
      addListingToProject,
    ],
  )

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProjectContext() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjectContext must be used within a ProjectProvider")
  }
  return context
}
