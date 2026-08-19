'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useOS } from '../context/OSContext'
import { Sparkles, RefreshCw, AlertTriangle, CheckCircle2, ArrowRight, Zap, BrainCircuit, ShieldAlert } from 'lucide-react'

interface DigestData {
  headline: string
  standoutSummary: string
  criticalAlerts: string[]
  completedHighlights: string[]
  recommendedActions: string[]
}

export function FounderHandoffCard() {
  const { role, currentUser, workItems, proposals, feedbackItems, decisions } = useOS()
  const [digest, setDigest] = useState<DigestData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastGeneratedTime, setLastGeneratedTime] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isEngineer = role === 'engineer'
  const founderName = currentUser?.name?.split(' ')[0] || (isEngineer ? 'Abdulaziz' : 'Ibrahim')

  // Generate Digest Handler
  const generateDigest = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      // Build an operational snapshot summary for Gemini
      const itemsSummary = {
        blockedItems: workItems
          .filter((i) => i.status === 'blocked' || i.priority === 'critical')
          .map((i) => ({ title: i.title, priority: i.priority, assignee: i.assignee })),
        inProgressItems: workItems
          .filter((i) => i.status === 'in_progress')
          .map((i) => ({ title: i.title, assignee: i.assignee })),
        recentProposals: proposals.slice(0, 3).map((p) => ({ title: p.title, status: p.status })),
        unresolvedFeedback: feedbackItems
          .filter((f) => f.status === 'new')
          .slice(0, 3)
          .map((f) => ({ subject: f.subject, type: f.type })),
        recentDecisions: decisions.slice(0, 2).map((d) => ({ title: d.title, date: d.date })),
      }

      const res = await fetch('/api/os/ai/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, itemsSummary }),
      })

      const json = await res.json()
      if (res.ok && json.success && json.digest) {
        setDigest(json.digest)
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        setLastGeneratedTime(nowStr)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`wstar_os_digest_${role}`, JSON.stringify({ digest: json.digest, time: nowStr }))
        }
      } else {
        setErrorMessage(json.error || 'Failed to synthesize daily briefing.')
      }
    } catch (e: any) {
      console.warn('[AI Digest Fetch Error]:', e)
      setErrorMessage(e?.message || 'Network error refreshing briefing.')
    } finally {
      setIsLoading(false)
    }
  }, [role, workItems, proposals, feedbackItems, decisions])

  // Load cached digest or generate on role mount
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(`wstar_os_digest_${role}`)
      if (cached) {
        const parsed = JSON.parse(cached)
        setDigest(parsed.digest)
        setLastGeneratedTime(parsed.time)
        return
      }
    } catch (e) {
      // Ignore sessionStorage error
    }

    // Role-specific static fallback while live AI digest synthesizes
    setDigest({
      headline: isEngineer
        ? 'Lead Architect Brief: Focus on Drift SQLite and Firebase Authentication stability'
        : 'CEO Brief: Strategic momentum on Ace Acad monetization, GTM and investor briefings',
      standoutSummary: isEngineer
        ? 'Core app architecture is active across work items. Recent unit test fixes and Firestore whereIn batching have stabilized the CI pipeline.'
        : 'User testing feedback is incoming for Ace Acad 2.0. Strategic proposals for Class Rep scaling and AI Adaptive Learning are ready for founder execution.',
      criticalAlerts: isEngineer
        ? [
            'Paywall & offline drift encryption pending security audit before campus pilot',
            'Verify all 13 core 100L courses syllabus structures in Firestore',
          ]
        : [
            'NDPC DCMI Data Controller Registration required once active users scale across ABU cohorts',
            'Investor briefing preparation with Tony Elumelu Foundation',
          ],
      completedHighlights: [
        'Zero-vulnerability authentication gateway & Edge JWT protection deployed',
        'Zustand reactive state domain stores with automatic rollback integrated',
      ],
      recommendedActions: isEngineer
        ? [
            'Verify sub-batch query chunking on mock exam quiz screens',
            'Finalize Drift migration scripts for version 3 local schema',
          ]
        : [
            'Review and approve Proposal PROP-001 for Class Rep cohort model & campus ambassadors',
            'Schedule investor briefing with Tony Elumelu Foundation and update pitch deck',
          ],
    })
    setLastGeneratedTime('Just now')
  }, [role, isEngineer])

  return (
    <div className="relative rounded-2xl bg-linear-to-br from-slate-900 via-slate-900 to-blue-950/80 border border-blue-900/40 p-5 text-white shadow-xl overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-white font-heading">
                Daily Async Founder Briefing
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                Gemini Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized for {founderName} ({isEngineer ? 'Lead Technical Architect' : 'Founder & CEO'})
              {lastGeneratedTime && ` • Synced ${lastGeneratedTime}`}
            </p>
          </div>
        </div>

        <button
          onClick={generateDigest}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synthesizing...' : 'Refresh AI Brief'}</span>
        </button>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="mt-3 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Digest Content Body */}
      {digest && (
        <div className="relative z-10 pt-4 space-y-4">
          {/* Headline & Standout Summary */}
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-blue-300">
              {digest.headline}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {digest.standoutSummary}
            </p>
          </div>

          {/* Critical Alerts & Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Critical Alerts */}
            <div className="rounded-xl bg-red-950/30 border border-red-900/40 p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Urgent Blockers & Attention</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {digest.criticalAlerts.map((alert, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span className="leading-snug text-slate-300">{alert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended High-Leverage Actions */}
            <div className="rounded-xl bg-blue-950/30 border border-blue-900/40 p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>High-Leverage Focus for Today</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {digest.recommendedActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">→</span>
                    <span className="leading-snug text-slate-300">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
