'use client'

import React, { useState } from 'react'
import { OSProvider } from '@/os/context/OSContext'
import { Sidebar } from '@/os/components/Sidebar'
import { TopHeader } from '@/os/components/TopHeader'
import { QuickCaptureModal } from '@/os/components/QuickCaptureModal'
import { CommandPalette } from '@/os/components/CommandPalette'
import { X } from 'lucide-react'

export default function OSLayout({ children }: { children: React.ReactNode }) {
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <OSProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans antialiased relative">
        {/* Desktop Sidebar (visible on lg screens and up) */}
        <div className="hidden lg:flex shrink-0">
          <Sidebar
            onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
        </div>

        {/* Mobile Slide-Out Drawer (visible on < lg screens when toggled) */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
              onClick={() => setIsMobileSidebarOpen(false)}
            />

            {/* Slide-out Sidebar Content */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-950 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
              <div className="absolute top-3 right-3 z-20">
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Sidebar
                onOpenQuickCapture={() => {
                  setIsMobileSidebarOpen(false)
                  setIsQuickCaptureOpen(true)
                }}
                onOpenCommandPalette={() => {
                  setIsMobileSidebarOpen(false)
                  setIsCommandPaletteOpen(true)
                }}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
          <TopHeader onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
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
