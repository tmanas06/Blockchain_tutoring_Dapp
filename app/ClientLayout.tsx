"use client"

import type React from "react"

import { Inter } from "next/font/google"
import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Ensure theme is applied after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem themes={["light", "dark", "sky"]}>
      <div className={`${inter.className} min-h-screen bg-background transition-colors duration-300`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}

