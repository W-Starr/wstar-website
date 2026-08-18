'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isOS = pathname?.startsWith('/os')

  if (isOS) {
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
