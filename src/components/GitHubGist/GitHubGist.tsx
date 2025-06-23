'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './GitHubGist.module.css'

interface GitHubGistProps {
  gistId: string
  file?: string
  className?: string
}

export default function GitHubGist({
  gistId,
  file,
  className,
}: GitHubGistProps) {
  const gistRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadGist = () => {
      if (!gistRef.current) return

      try {
        // Clear any existing content
        gistRef.current.innerHTML = ''

        // Create script element for GitHub Gist
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true

        // Build Gist URL
        let gistUrl = `https://gist.github.com/${gistId}.js`
        if (file) {
          gistUrl += `?file=${encodeURIComponent(file)}`
        }
        script.src = gistUrl

        // Handle successful loading
        script.onload = () => {
          setLoading(false)
          setError(null)
        }

        // Handle loading errors
        script.onerror = () => {
          setLoading(false)
          setError('Failed to load GitHub Gist')
        }

        // Append script to container
        gistRef.current.appendChild(script)

        // Cleanup function
        return () => {
          if (gistRef.current) {
            gistRef.current.innerHTML = ''
          }
        }
      } catch (err) {
        setLoading(false)
        setError('Error loading GitHub Gist')
        console.error('GitHub Gist loading error:', err)
      }
    }

    loadGist()
  }, [gistId, file])

  if (error) {
    return (
      <div
        className={`${styles.gistContainer} ${styles.error} ${className || ''}`}
      >
        <div className={styles.errorContent}>
          <h4>Failed to Load GitHub Gist</h4>
          <p>{error}</p>
          <p className={styles.gistInfo}>
            Gist ID: <code>{gistId}</code>
            {file && (
              <>
                <br />
                File: <code>{file}</code>
              </>
            )}
          </p>
          <a
            href={`https://gist.github.com/${gistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewOnGitHub}
          >
            View on GitHub →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.gistContainer} ${className || ''}`}>
      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading GitHub Gist...</p>
        </div>
      )}
      <div ref={gistRef} className={styles.gistContent} />
    </div>
  )
}
