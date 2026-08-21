'use client'

import React, { useState, useEffect } from 'react'
import { useOS } from '../context/OSContext'
import { ProductArea, ProductId } from '../types'
import { X, Layers, User, Target, Plus, Check } from 'lucide-react'

interface NewProductAreaModalProps {
  isOpen: boolean
  onClose: () => void
  defaultProductId?: string
  onCreated?: (area: ProductArea) => void
}

export function NewProductAreaModal({
  isOpen,
  onClose,
  defaultProductId = 'ace-acad',
  onCreated,
}: NewProductAreaModalProps) {
  const { products, addProductArea } = useOS()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [productId, setProductId] = useState<string>(defaultProductId)
  const [owner, setOwner] = useState('Abdulaziz')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setProductId(defaultProductId)
      setName('')
      setDescription('')
      setOwner('Abdulaziz')
    }
  }, [isOpen, defaultProductId])

  if (!isOpen) return null

  // Ensure standard product options
  const productOptions =
    products.length > 0
      ? products
      : [
          { id: 'ace-acad', name: 'Ace Acad' },
          { id: 'plantiq', name: 'PlantIQ' },
          { id: 'wstar-core', name: 'WSTAR Core' },
        ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      const created = addProductArea({
        name: name.trim(),
        description: description.trim(),
        productId: productId as ProductId,
        owner: owner.trim() || 'Abdulaziz',
        iconName: 'Layers',
        maturity: 0,
      })

      onCreated?.(created)
      onClose()
    } catch (err) {
      console.error('Failed to create product area:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Create New Product Area
              </h2>
              <p className="text-xs text-slate-400">
                Architectural domain or functional subsystem
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Product Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-blue-500" />
              <span>Target Product *</span>
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
              required
            >
              {productOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>

          {/* Area Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Area Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Gamification & Streaks, Quiz Engine, Search & Filter"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Architectural Scope & Purpose
            </label>
            <textarea
              rows={3}
              placeholder="What software capabilities, database tables, or features live under this area?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Lead Owner */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Lead Owner</span>
            </label>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Abdulaziz">Abdulaziz</option>
              <option value="Ibrahim">Ibrahim</option>
              <option value="Abdulaziz & Ibrahim">Abdulaziz & Ibrahim</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Creating...' : 'Create Area'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
