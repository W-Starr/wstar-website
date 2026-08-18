'use client'

import React, { useState } from 'react'
import { OSProvider } from '@/os/context/OSContext'
import { Sidebar } from '@/os/components/Sidebar'
import { TopHeader } from '@/os/components/TopHeader'
import { QuickCaptureModal } from '@/os/components/QuickCaptureModal'
import { CommandPalette } from '@/os/components/CommandPalette'

export default function OSLayout({ children }: { children: React.ReactNode }) {
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  return (
    <OSProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans antialiased">
        {/* Sidebar */}
        <Sidebar
          onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <TopHeader />
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Universal Modals */}
        <QuickCaptureModal
          isOpen={isQuickCaptureOpen}
          onClose={() => setIsQuickCaptureOpen(false)}
        />

        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onOpenQuickCapture={() => {
            setIsCommandPaletteOpen(false)
            setIsQuickCaptureOpen(true)
          }}
        />
      </div>
    </OSProvider>
  )
}
