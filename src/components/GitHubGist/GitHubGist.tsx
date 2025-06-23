'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './GitHubGist.module.css'

// Import Prism CSS
import 'prismjs/themes/prism.css'

// Language mapping for display
const getLanguageDisplayName = (language: string | null): string => {
  if (!language) return 'text'

  const langMap: Record<string, string> = {
    JavaScript: 'javascript',
    TypeScript: 'typescript',
    Python: 'python',
    Java: 'java',
    'C#': 'csharp',
    'C++': 'cpp',
    PHP: 'php',
    Ruby: 'ruby',
    Go: 'go',
    Rust: 'rust',
    SQL: 'sql',
    Shell: 'bash',
    JSON: 'json',
    CSS: 'css',
    SCSS: 'scss',
    YAML: 'yaml',
    Markdown: 'markdown',
    Apex: 'java', // Map Apex to Java for Prism
  }

  return langMap[language] || language.toLowerCase()
}

// Syntax highlighting with Prism.js
const highlightCode = async (
  code: string,
  language: string
): Promise<string> => {
  if (typeof window === 'undefined') {
    return code // Return plain code on server side
  }

  try {
    // Dynamic import Prism
    const Prism = (await import('prismjs')).default

    const prismLang = getLanguageDisplayName(language)

    // Load specific language if needed
    if (prismLang && prismLang !== 'text' && !Prism.languages[prismLang]) {
      try {
        if (prismLang === 'javascript') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await import('prismjs/components/prism-javascript' as any)
        } else if (prismLang === 'typescript') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await import('prismjs/components/prism-javascript' as any)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await import('prismjs/components/prism-typescript' as any)
        } else if (prismLang === 'python') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await import('prismjs/components/prism-python' as any)
        } else if (prismLang === 'java') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await import('prismjs/components/prism-java' as any)
        } else if (prismLang === 'csharp') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await import('prismjs/components/prism-csharp' as any)
        } else if (prismLang === 'cpp') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await import('prismjs/components/prism-c' as any)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await import('prismjs/components/prism-cpp' as any)
        } else if (prismLang === 'css') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await import('prismjs/components/prism-css' as any)
        } else if (prismLang === 'json') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await import('prismjs/components/prism-json' as any)
        } else if (prismLang === 'bash') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await import('prismjs/components/prism-bash' as any)
        }
      } catch (error) {
        console.warn(`Failed to load Prism language: ${prismLang}`, error)
      }
    }

    // Highlight the code
    if (Prism.languages[prismLang]) {
      return Prism.highlight(code, Prism.languages[prismLang], prismLang)
    }

    return code // Return plain code if language not supported
  } catch (error) {
    console.error('Prism highlighting failed:', error)
    return code // Fallback to plain code
  }
}

interface GitHubGistProps {
  gistId: string
  file?: string
  className?: string
}

interface GistFile {
  filename: string
  type: string
  language: string
  raw_url: string
  size: number
  truncated: boolean
  content: string
}

interface GistData {
  id: string
  description: string
  created_at: string
  updated_at: string
  html_url: string
  files: Record<string, GistFile>
  owner: {
    login: string
    avatar_url: string
    html_url: string
  }
}

export default function GitHubGist({
  gistId,
  file,
  className,
}: GitHubGistProps) {
  const [gistData, setGistData] = useState<GistData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [highlightedFiles, setHighlightedFiles] = useState<
    Record<string, string>
  >({})
  const [copiedFiles, setCopiedFiles] = useState<Record<string, boolean>>({})

  const copyToClipboard = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedFiles((prev) => ({ ...prev, [filename]: true }))
      setTimeout(() => {
        setCopiedFiles((prev) => ({ ...prev, [filename]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }
  useEffect(() => {
    const fetchGist = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`https://api.github.com/gists/${gistId}`)

        if (!response.ok) {
          throw new Error(
            `GitHub API responded with status: ${response.status}`
          )
        }

        const data: GistData = await response.json()
        setGistData(data)

        // Highlight all files
        const highlighted: Record<string, string> = {}
        for (const [filename, fileData] of Object.entries(data.files)) {
          highlighted[filename] = await highlightCode(
            fileData.content,
            fileData.language
          )
        }
        setHighlightedFiles(highlighted)
      } catch (err) {
        console.error('Error fetching gist:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to load GitHub Gist'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchGist()
  }, [gistId])

  if (loading) {
    return (
      <div className={`${styles.gistContainer} ${className || ''}`}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading GitHub Gist...</p>
        </div>
      </div>
    )
  }

  if (error || !gistData) {
    return (
      <div
        className={`${styles.gistContainer} ${styles.error} ${className || ''}`}
      >
        <div className={styles.errorContent}>
          <h4>Failed to Load GitHub Gist</h4>
          <p>{error || 'Unknown error occurred'}</p>
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

  // Filter files based on the file parameter
  const filesToShow = file
    ? Object.entries(gistData.files).filter(([filename]) => filename === file)
    : Object.entries(gistData.files)

  if (filesToShow.length === 0) {
    return (
      <div
        className={`${styles.gistContainer} ${styles.error} ${className || ''}`}
      >
        <div className={styles.errorContent}>
          <h4>File Not Found</h4>
          <p>
            The specified file &quot;{file}&quot; was not found in this gist.
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
      <div className={styles.gistHeader}>
        <div className={styles.gistMeta}>
          <a
            href={gistData.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.gistTitle}
          >
            {gistData.description || `Gist ${gistData.id}`}
          </a>
          <div className={styles.gistOwner}>
            <a
              href={gistData.owner.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ownerLink}
            >
              <Image
                src={gistData.owner.avatar_url}
                alt={gistData.owner.login}
                className={styles.avatar}
                width={20}
                height={20}
                unoptimized
              />
              {gistData.owner.login}
            </a>
          </div>
        </div>
      </div>

      {filesToShow.map(([filename, fileData]) => {
        // Get highlighted code
        const highlightedCode = highlightedFiles[filename] || fileData.content

        return (
          <div key={filename} className={styles.gistFile}>
            <div className={styles.fileHeader}>
              <div className={styles.fileInfo}>
                <span className={styles.filename}>{filename}</span>
                <span className={styles.language}>
                  {fileData.language || 'Text'}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(fileData.content, filename)}
                className={styles.copyButton}
                title="Copy code to clipboard"
              >
                {copiedFiles[filename] ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5,15H4a2,2 0,0 1,-2-2V4A2,2 0,0 1,4,2H15a2,2 0,0 1,2,2V5"></path>
                  </svg>
                )}
                <span className={styles.copyText}>
                  {copiedFiles[filename] ? 'Copied!' : 'Copy'}
                </span>
              </button>
            </div>
            <div className={styles.fileContent}>
              <div className={styles.codeBlock}>
                <pre className={styles.codeContent}>
                  <code
                    className={`language-${getLanguageDisplayName(fileData.language)}`}
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                  />
                </pre>
              </div>
            </div>
          </div>
        )
      })}

      <div className={styles.gistFooter}>
        <a
          href={gistData.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewOnGitHub}
        >
          View on GitHub
        </a>
      </div>
    </div>
  )
}
