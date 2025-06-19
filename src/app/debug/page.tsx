/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import {
  getLogsFromLocalStorage,
  clearLogsFromLocalStorage,
} from '@/lib/production-logger'

export default function DebugPage() {
  const [logs, setLogs] = useState<Record<string, any>>({})

  const loadLogs = () => {
    const logKeys = [
      'richtext-content',
      'richtext-assets',
      'richtext-embedded-asset',
      'richtext-image',
      'richtext-image-success',
      'richtext-image-error',
      'richtext-error',
    ]

    const allLogs: Record<string, any> = {}
    for (const key of logKeys) {
      allLogs[key] = getLogsFromLocalStorage(key)
    }
    setLogs(allLogs)
  }

  const clearAllLogs = () => {
    const logKeys = [
      'richtext-content',
      'richtext-assets',
      'richtext-embedded-asset',
      'richtext-image',
      'richtext-image-success',
      'richtext-image-error',
      'richtext-error',
    ]

    for (const key of logKeys) {
      clearLogsFromLocalStorage(key)
    }
    setLogs({})
  }

  useEffect(() => {
    loadLogs()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>RichText Debug Logs</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={loadLogs} style={{ marginRight: '10px' }}>
          Refresh Logs
        </button>
        <button onClick={clearAllLogs}>Clear All Logs</button>
      </div>

      {Object.entries(logs).map(([key, logEntries]: [string, any]) => (
        <div key={key} style={{ marginBottom: '30px' }}>
          <h2>
            {key} ({Array.isArray(logEntries) ? logEntries.length : 0} entries)
          </h2>
          <div
            style={{
              background: '#f5f5f5',
              padding: '10px',
              borderRadius: '5px',
              maxHeight: '300px',
              overflow: 'auto',
            }}
          >
            <pre>{JSON.stringify(logEntries, null, 2)}</pre>
          </div>
        </div>
      ))}
    </div>
  )
}
