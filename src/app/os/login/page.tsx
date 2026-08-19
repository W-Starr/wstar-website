'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromUrl = searchParams.get('from') || '/os'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/os/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Authentication failed. Please verify credentials.')
        setLoading(false)
        return
      }

      // Successful login
      router.push(fromUrl)
      router.refresh()
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection error during authentication.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 py-8 px-6 sm:px-8 shadow-2xl rounded-2xl space-y-6">
      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Corporate Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              required
              placeholder="e.g. ibrahim@wstartech.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Master Security Key
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              required
              placeholder="Enter master security key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In to Operating System'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Security Notice */}
      <div className="pt-2 border-t border-slate-800/80 text-center">
        <p className="text-[11px] text-slate-500">
          Access is restricted strictly to authorized founders under CAMA 2020 governance.
        </p>
      </div>
    </div>
  )
}

export default function OSLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased relative selection:bg-blue-600 selection:text-white">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#196CA4] border border-[#25A6DD]/30 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform font-heading">
              W
            </div>
            <span className="font-bold text-xl text-white tracking-tight font-heading">
              WSTAR <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">OS</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold font-heading text-white tracking-tight pt-2">
            Founder & Operations Authentication
          </h2>
          <p className="text-xs text-slate-400">
            Secure internal command center for WSTAR Technologies
          </p>
        </div>

        {/* Auth Card wrapped in Suspense */}
        <Suspense fallback={
          <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl text-center text-xs text-slate-500">
            Loading authentication portal...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
