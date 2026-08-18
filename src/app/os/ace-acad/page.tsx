'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useOS } from '@/os/context/OSContext'
import { WorkItem } from '@/os/types'
import { WorkItemDetailModal } from '@/os/components/WorkItemDetailModal'
import { DecompositionModal } from '@/os/components/DecompositionModal'
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Database,
  FileCode2,
  Layers,
  FileText,
  ShieldAlert,
  ArrowUpRight,
  Route,
  Activity,
  ArrowRight,
  UploadCloud,
  FileCode,
} from 'lucide-react'

export default function AceAcadCommandPage() {
  const { productAreas, workItems, proposals } = useOS()
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [decompositionItem, setDecompositionItem] = useState<WorkItem | null>(null)

  const aceBugs = workItems.filter(
    (w) => w.productId === 'ace-acad' && w.type === 'bug'
  )
  const aceDebt = workItems.filter(
    (w) => w.productId === 'ace-acad' && w.type === 'tech_debt'
  )

  // 13 Launch Courses Discovered
  const coreCourses = [
    { code: 'MATH 101', title: 'Elementary Mathematics I (Algebra & Trigonometry)', level: '100L', sem: '1st', status: 'Ingested & Verified' },
    { code: 'MATH 102', title: 'Elementary Mathematics II (Calculus & Vectors)', level: '100L', sem: '2nd', status: 'Ingested & Verified' },
    { code: 'CHEM 101', title: 'General Chemistry I (Physical & Inorganic)', level: '100L', sem: '1st', status: 'Ingested & Verified' },
    { code: 'CHEM 111', title: 'Basic Practical Chemistry I', level: '100L', sem: '1st', status: 'Ingested & Verified' },
    { code: 'CHEM 121', title: 'Organic Chemistry I', level: '100L', sem: '1st', status: 'Extracted / Pending Ingestion' },
    { code: 'CHEM 122', title: 'Organic Chemistry II', level: '100L', sem: '2nd', status: 'Extracted / Pending Ingestion' },
    { code: 'PHYS 101', title: 'General Physics I (Mechanics & Thermal)', level: '100L', sem: '1st', status: 'Extracted / Pending Ingestion' },
    { code: 'PHYS 102', title: 'General Physics II (Electricity & Magnetism)', level: '100L', sem: '2nd', status: 'Extracted / Pending Ingestion' },
    { code: 'GENS 101', title: 'Use of English & Communication Skills', level: '100L', sem: '1st', status: 'Ingested & Verified' },
    { code: 'GENS 103', title: 'Nigerian Peoples & Culture', level: '100L', sem: '1st', status: 'Extracted / Pending Ingestion' },
    { code: 'BIO 101', title: 'General Biology I (Cell Biology & Genetics)', level: '100L', sem: '1st', status: 'Extracted / Pending Ingestion' },
    { code: 'COSC 101', title: 'Introduction to Computer Science', level: '100L', sem: '1st', status: 'Extracted / Pending Ingestion' },
    { code: 'STAT 101', title: 'Elementary Statistics for Sciences', level: '100L', sem: '1st', status: 'Extracted / Pending Ingestion' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span>Product Command Center</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Ace Acad (ABU Zaria 100L Pilot)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Architecture, syllabus ingestion pipeline, discovered codebase debt, and module health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            Flutter Engine • v1.0.0+3
          </span>
        </div>
      </div>

      {/* Product Architecture Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Target Cohort</span>
            <span className="font-mono text-blue-600">ABU Zaria</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            100-Level Freshmen
          </div>
          <p className="text-xs text-slate-500">
            12 Faculties, 60+ Departments, 13 core science/general curriculum courses.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Pedagogical Loop</span>
            <span className="font-mono text-emerald-600">3-Step</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            Read → Quiz → Progress
          </div>
          <p className="text-xs text-slate-500">
            Bounded pdfrx reading sessions with real-time pass-mark progression.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Offline Engine</span>
            <span className="font-mono text-purple-600">Drift SQLite</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            Sandboxed Local Storage
          </div>
          <p className="text-xs text-slate-500">
            Full study session & quiz loop operational in low-bandwidth campus hostels.
          </p>
        </div>
      </div>

      {/* Product Areas Health & Maturity */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>PRODUCT AREAS & MATURITY BREAKDOWN</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productAreas.map((area) => (
            <div
              key={area.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {area.name}
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">
                  {area.maturity}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                {area.description}
              </p>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    area.maturity >= 85
                      ? 'bg-emerald-500'
                      : area.maturity >= 70
                      ? 'bg-blue-500'
                      : area.maturity >= 40
                      ? 'bg-purple-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${area.maturity}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400">
                Lead: <strong>{area.owner}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strategic Proposals & Expansion Horizons Banner */}
      <section className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <FileCode className="w-4 h-4" />
              <span>Next Horizon Architecture Proposals</span>
            </div>
            <h3 className="text-base font-bold font-heading">
              3 Strategic Proposals Ready for Expansion
            </h3>
            <p className="text-xs text-slate-300">
              Class Rep Cohort UGC model, Tier 2 Hybrid AI Ingestion ($0.02/course), and 3-Zone Staging Quarantine.
            </p>
          </div>

          <Link
            href="/os/proposals"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <span>Open Proposals Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
          {proposals.map((p) => (
            <Link
              key={p.id}
              href="/os/proposals"
              className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 space-y-1.5 transition-colors group"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono font-bold text-purple-400">{p.proposalNumber}</span>
                <span className="text-[10px] text-slate-400">{p.category}</span>
              </div>
              <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                {p.title}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {p.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Discovered 13 Foundational Launch Courses */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>13 CORE 100L FOUNDATIONAL COURSES REGISTRY</span>
          </h3>
          <span className="text-xs text-slate-400">
            Source: scripts/all_new_courses.json & extract_pdf.py
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3 pl-4">Course Code</th>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">Level & Semester</th>
                  <th className="p-3 pr-4">Ingestion & Readiness Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {coreCourses.map((c) => (
                  <tr
                    key={c.code}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <td className="p-3 pl-4 font-mono font-bold text-slate-900 dark:text-white">
                      {c.code}
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                      {c.title}
                    </td>
                    <td className="p-3 text-slate-500">
                      {c.level} • {c.sem} Semester
                    </td>
                    <td className="p-3 pr-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          c.status.includes('Verified')
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {c.status.includes('Verified') ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5" />
                        )}
                        <span>{c.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Discovered Code Quality, Debt & Bugs Inspector */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bugs on Ace Acad */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>ACTIVE ACE ACAD BUGS ({aceBugs.length})</span>
          </h3>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-2xs overflow-hidden">
            {aceBugs.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedItem(b)}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    {b.itemNumber}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    {b.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {b.title}
                </h4>
                {b.codeReference && (
                  <div className="text-[11px] font-mono text-slate-400 truncate">
                    {b.codeReference}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Technical Debt Discovered */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>DISCOVERED TECHNICAL DEBT ({aceDebt.length})</span>
          </h3>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-2xs overflow-hidden">
            {aceDebt.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedItem(d)}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    {d.itemNumber}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    {d.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {d.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <WorkItemDetailModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        onOpenDecomposition={(item) => {
          setSelectedItem(null)
          setDecompositionItem(item)
        }}
      />

      <DecompositionModal
        item={decompositionItem}
        isOpen={Boolean(decompositionItem)}
        onClose={() => setDecompositionItem(null)}
      />
    </div>
  )
}
