/**
 * Structured Logger for WSTAR OS
 * Provides ISO-timestamped contextual logs for operations, syncs, and AI requests.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogPayload {
  level: LogLevel
  message: string
  context?: string
  data?: Record<string, unknown>
  error?: Error | unknown
  timestamp: string
}

function formatLog(payload: LogPayload): string {
  const meta = payload.data ? ` | ${JSON.stringify(payload.data)}` : ''
  const err = payload.error
    ? ` | ERROR: ${payload.error instanceof Error ? payload.error.stack : String(payload.error)}`
    : ''
  return `[${payload.timestamp}] [${payload.level.toUpperCase()}] [${payload.context || 'WSTAR-OS'}]: ${payload.message}${meta}${err}`
}

export const logger = {
  debug: (message: string, context?: string, data?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        formatLog({ level: 'debug', message, context, data, timestamp: new Date().toISOString() })
      )
    }
  },

  info: (message: string, context?: string, data?: Record<string, unknown>) => {
    console.info(
      formatLog({ level: 'info', message, context, data, timestamp: new Date().toISOString() })
    )
  },

  warn: (message: string, context?: string, data?: Record<string, unknown>) => {
    console.warn(
      formatLog({ level: 'warn', message, context, data, timestamp: new Date().toISOString() })
    )
  },

  error: (
    message: string,
    context?: string,
    error?: Error | unknown,
    data?: Record<string, unknown>
  ) => {
    console.error(
      formatLog({
        level: 'error',
        message,
        context,
        data,
        error,
        timestamp: new Date().toISOString(),
      })
    )
  },
}
