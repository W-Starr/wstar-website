'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import styles from './studio.module.css'
import type { StudioSession } from './types'

interface LockScreenProps {
  onUnlocked: (session: StudioSession) => void
}

/**
 * The gate for the Newsroom Studio. Either founder password unlocks it;
 * the server decides which one matched and returns the identity.
 */
export default function LockScreen({ onUnlocked }: LockScreenProps) {
  const [password, setPassword] = useState('')
  const [reveal, setReveal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!password || submitting) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/publications/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Unable to unlock the studio.')
        setPassword('')
        setSubmitting(false)
        return
      }

      onUnlocked(data.session as StudioSession)
    } catch {
      setError('Connection error. Check your network and try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.lockWrap}>
      <div className={styles.lockCard}>
        <div className={styles.lockBadge}>
          <ShieldCheck size={26} color="#FFFFFF" />
        </div>

        <p className={styles.lockEyebrow}>WSTAR Newsroom</p>
        <h1 className={styles.lockTitle}>Publishing Studio</h1>
        <p className={styles.lockSubtitle}>
          Restricted to WSTAR founders. Enter your founder password to post and manage
          publications on the public newsroom.
        </p>

        <form className={styles.lockForm} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.alert} role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.passwordField}>
            <Lock size={16} />
            <input
              type={reveal ? 'text' : 'password'}
              className={styles.passwordInput}
              placeholder="Founder password"
              aria-label="Founder password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className={styles.revealBtn}
              onClick={() => setReveal((value) => !value)}
              aria-label={reveal ? 'Hide password' : 'Show password'}
            >
              {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type="submit" className={styles.primaryBtn} disabled={!password || submitting}>
            <span>{submitting ? 'Verifying…' : 'Unlock Studio'}</span>
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>

        <p className={styles.lockFootnote}>
          Access attempts are rate limited and logged.
          <br />
          <Link href="/publications">← Back to the public newsroom</Link>
        </p>
      </div>
    </div>
  )
}
