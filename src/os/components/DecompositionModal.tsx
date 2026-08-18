'use client'

import React, { useState } from 'react'
import { WorkItem } from '../types'
import { useOS } from '../context/OSContext'
import { X, Sparkles, CheckSquare, Plus } from 'lucide-react'

interface DecompositionModalProps {
  item: WorkItem | null
  isOpen: boolean
  onClose: () => void
}

export function DecompositionModal({
  item,
  isOpen,
  onClose,
}: DecompositionModalProps) {
  const { decomposeWorkItem } = useOS()
  const [subtasks, setSubtasks] = useState<string[]>([])
  const [newSubtask, setNewSubtask] = useState('')

  React.useEffect(() => {
    if (item) {
      // Heuristic default subtasks if none exist
      if (item.title.toLowerCase().includes('gpa')) {
        setSubtasks([
          'Define 5.0 Nigerian GPA scale grade points (A=5, B=4, C=3, D=2, E=1, F=0)',
          'Build interactive course credit unit and expected grade selector UI',
          'Implement real-time SGPA and cumulative CGPA calculation formula',
          'Add interactive degree classification target scenario projection',
          'Write comprehensive unit tests for edge cases (carryovers, zero credits)',
        ])
      } else if (item.title.toLowerCase().includes('timetable')) {
        setSubtasks([
          'Create weekly grid calendar widget (Monday to Sunday, 7am - 8pm)',
          'Implement lecture time slot blocking and persistence in SharedPreferences',
          'Build auto-scheduler suggesting optimal study windows based on free slots',
          'Integrate ABU academic calendar events (exams, matriculation)',
        ])
      } else if (item.title.toLowerCase().includes('ingest') || item.title.toLowerCase().includes('course')) {
        setSubtasks([
          'Extract raw text and syllabus from course handout PDF using extract_pdf.py',
          'Structure JSON format according to JSON_CREATION_MANUAL.md specification',
          'Review generated quiz question banks with subject matter expert',
          'Execute Firestore upload script with Firebase Admin SDK',
          'Verify PDF page-start and page-end jumps in mobile study session reader',
        ])
      } else {
        setSubtasks([
          `Design and technical architecture specification for ${item.title}`,
          'Implement core backend / Firestore schema and service methods',
          'Build UI presentation and bind reactive state controllers',
          'Conduct QA verification and edge-case testing',
        ])
      }
    }
  }, [item])

  if (!isOpen || !item) return null

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return
    setSubtasks([...subtasks, newSubtask.trim()])
    setNewSubtask('')
  }

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    decomposeWorkItem(item.id, subtasks)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Task Decomposition Assistant
              </h2>
              <p className="text-[11px] text-slate-400">
                Break larger initiatives into manageable, high-velocity subtasks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Parent Work Item
            </div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              [{item.itemNumber}] {item.title}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Suggested Decomposition Plan ({subtasks.length} subtasks)
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {subtasks.map((st, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 group"
                >
                  <div className="flex items-center gap-2.5 flex-1 pr-2">
                    <CheckSquare className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>{st}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveSubtask(idx)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Subtask */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSubtask()
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Decomposition teaches modular execution
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs"
            >
              Apply Decomposition ({subtasks.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
