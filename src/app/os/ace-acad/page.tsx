'use client'

import React from 'react'
import { ProductCommandView } from '@/os/components/ProductCommandView'

export default function AceAcadCommandPage() {
  return (
    <ProductCommandView
      productId="ace-acad"
      defaultFallbackName="Ace Acad"
      defaultFallbackTagline="Architecture, syllabus ingestion pipeline, discovered codebase debt, and module health."
    />
  )
}
