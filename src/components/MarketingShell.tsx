'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // The OS and the password-gated Newsroom Studio are full-bleed app surfaces:
  // they bring their own chrome and must not inherit the marketing nav/footer.
  const isAppSurface = pathname?.startsWith('/os') || pathname?.startsWith('/publications/admin')

  if (isAppSurface) {
    return <>{children}</>
  }

  return (
    <div className="marketing-shell min-h-screen bg-[#111628] text-white flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
