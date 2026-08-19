'use client'

import React, { useState, useEffect } from 'react'
import { FolderGit2, Sparkles, AlertCircle, CheckCircle2, Lock, ExternalLink } from 'lucide-react'

interface GooglePickerButtonProps {
  onFilePicked: (file: {
    id: string
    name: string
    mimeType: string
    url: string
    content?: string
    author?: string
  }) => void
  buttonText?: string
  className?: string
}

declare global {
  interface Window {
    gapi: any
    google: any
  }
}

export function GooglePickerButton({
  onFilePicked,
  buttonText = 'Browse Google Drive',
  className = '',
}: GooglePickerButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGapiLoaded, setIsGapiLoaded] = useState(false)
  const [isGsiLoaded, setIsGsiLoaded] = useState(false)
  const [tokenClient, setTokenClient] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showConfigModal, setShowConfigModal] = useState(false)

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const appId = process.env.NEXT_PUBLIC_GOOGLE_APP_ID

  // Load Google Scripts dynamically
  useEffect(() => {
    // 1. Google API Script
    const gapiScript = document.createElement('script')
    gapiScript.src = 'https://apis.google.com/js/api.js'
    gapiScript.async = true
    gapiScript.defer = true
    gapiScript.onload = () => {
      window.gapi.load('picker', () => {
        setIsGapiLoaded(true)
      })
    }
    document.body.appendChild(gapiScript)

    // 2. Google Identity Services Script
    const gsiScript = document.createElement('script')
    gsiScript.src = 'https://accounts.google.com/gsi/client'
    gsiScript.async = true
    gsiScript.defer = true
    gsiScript.onload = () => {
      setIsGsiLoaded(true)
      if (clientId && window.google?.accounts?.oauth2) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly',
          callback: '', // defined at runtime
        })
        setTokenClient(client)
      }
    }
    document.body.appendChild(gsiScript)

    return () => {
      // Clean up scripts if unmounted
      if (gapiScript.parentNode) gapiScript.parentNode.removeChild(gapiScript)
      if (gsiScript.parentNode) gsiScript.parentNode.removeChild(gsiScript)
    }
  }, [clientId])

  const createPicker = (accessToken: string) => {
    if (!apiKey || !window.google?.picker) {
      setErrorMessage('Google Picker API is initializing or API Key is missing.')
      setIsLoading(false)
      return
    }

    try {
      const view = new window.google.picker.DocsView()
        .setIncludeFolders(true)
        .setSelectFolderEnabled(false)

      const builder = new window.google.picker.PickerBuilder()
        .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setAppId(appId || '')
        .setOAuthToken(accessToken)
        .addView(view)
        .addView(new window.google.picker.DocsView(window.google.picker.ViewId.DOCUMENTS))
        .addView(new window.google.picker.DocsView(window.google.picker.ViewId.PDFS))
        .addView(new window.google.picker.DocsView(window.google.picker.ViewId.SPREADSHEETS))
        .setDeveloperKey(apiKey)
        .setCallback(async (data: any) => {
          if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
            const doc = data[window.google.picker.Response.DOCUMENTS][0]
            const fileId = doc[window.google.picker.Document.ID]
            const name = doc[window.google.picker.Document.NAME]
            const mimeType = doc[window.google.picker.Document.MIME_TYPE]
            const url = doc[window.google.picker.Document.URL]

            setIsLoading(true)

            // Call server to fetch raw exported text content via Drive API
            try {
              const res = await fetch('/api/os/sources/gdrive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileId, accessToken }),
              })

              const resData = await res.json()
              const content = resData.success ? resData.content : undefined

              onFilePicked({
                id: fileId,
                name,
                mimeType,
                url,
                content,
                author: resData.metadata?.author,
              })
            } catch (fetchErr) {
              console.warn('Failed to fetch doc text content from Drive API:', fetchErr)
              onFilePicked({
                id: fileId,
                name,
                mimeType,
                url,
              })
            } finally {
              setIsLoading(false)
            }
          } else if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.CANCEL) {
            setIsLoading(false)
          }
        })

      const picker = builder.build()
      picker.setVisible(true)
    } catch (err: any) {
      console.error('Picker creation failed:', err)
      setErrorMessage(err.message || 'Failed to open Google Picker')
      setIsLoading(false)
    }
  }

  const handleOpenPicker = () => {
    // If credentials are not yet configured, show setup helper
    if (!clientId || !apiKey) {
      setShowConfigModal(true)
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    if (tokenClient) {
      tokenClient.callback = async (response: any) => {
        if (response.error !== undefined) {
          setIsLoading(false)
          setErrorMessage(`Google authorization error: ${response.error}`)
          return
        }
        createPicker(response.access_token)
      }
      tokenClient.requestAccessToken({ prompt: '' })
    } else if (window.google?.accounts?.oauth2) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly',
        callback: (response: any) => {
          if (response.error !== undefined) {
            setIsLoading(false)
            setErrorMessage(`Google authorization error: ${response.error}`)
            return
          }
          createPicker(response.access_token)
        },
      })
      setTokenClient(client)
      client.requestAccessToken({ prompt: '' })
    } else {
      setIsLoading(false)
      setErrorMessage('Google Identity Services SDK is still loading. Please try again.')
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpenPicker}
        disabled={isLoading}
        className={
          className ||
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer'
        }
      >
        <FolderGit2 className="w-4 h-4 text-blue-500 shrink-0" />
        <span>{isLoading ? 'Opening Drive...' : buttonText}</span>
      </button>

      {/* Config Guide Modal when keys are missing */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <FolderGit2 className="w-5 h-5" />
              <span>Connect Real Google Drive</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              To browse and import live documents directly from your corporate Google Drive into WSTAR OS, add your Google Cloud credentials to <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-500 font-mono text-[11px]">.env.local</code>.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono text-slate-800 dark:text-slate-200">
              <div className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">
                Required Environment Keys
              </div>
              <div className="text-blue-600 dark:text-blue-400">
                NEXT_PUBLIC_GOOGLE_CLIENT_ID=&quot;your-client-id.apps.googleusercontent.com&quot;
              </div>
              <div className="text-emerald-600 dark:text-emerald-400">
                NEXT_PUBLIC_GOOGLE_API_KEY=&quot;your-google-api-key&quot;
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Quick Setup Summary:</div>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>Create a project in <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Google Cloud Console ↗</a></li>
                <li>Enable <strong>Google Drive API</strong> and <strong>Google Picker API</strong></li>
                <li>Create an <strong>OAuth 2.0 Client ID</strong> (Web Application) with Javascript Origin <code className="font-mono text-[11px]">http://localhost:3000</code></li>
                <li>Create an <strong>API Key</strong></li>
              </ol>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 mt-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </>
  )
}
