'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { ProductCommandView } from '@/os/components/ProductCommandView'

export default function DynamicProductCommandPage() {
  const params = useParams()
  const rawId = params?.productId
  const productId = Array.isArray(rawId) ? rawId[0] : (rawId as string) || 'ace-acad'

  return <ProductCommandView productId={productId} />
}
