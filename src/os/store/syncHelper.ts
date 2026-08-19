/**
 * WSTAR OS Universal Optimistic Mutation Dispatcher
 * Dispatches mutations to /api/os/sync and handles error notifications.
 */

export interface SyncResponse {
  success: boolean
  mode?: 'sanity_live' | 'local_fallback'
  error?: string
  doc?: any
}

export async function dispatchMutation(
  action: 'create' | 'patch' | 'delete',
  docType: string,
  id: string,
  data?: any
): Promise<SyncResponse> {
  try {
    const res = await fetch('/api/os/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, docType, id, data }),
    })

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}))
      throw new Error(errorJson.error || `HTTP ${res.status} Mutation Failed`)
    }

    return await res.json()
  } catch (error: any) {
    console.warn(`[WSTAR OS Sync Error] Mutation ${action} on ${docType} (${id}) failed:`, error)
    return {
      success: false,
      error: error.message || 'Mutation failed',
    }
  }
}
