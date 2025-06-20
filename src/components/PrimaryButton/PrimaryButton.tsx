import { ReactNode } from 'react'
import styles from './PrimaryButton.module.css'

interface PrimaryButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  download?: string
  target?: string
  rel?: string
  className?: string
  icon?: ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function PrimaryButton({
  children,
  href,
  onClick,
  download,
  target,
  rel,
  className = '',
  icon,
  type = 'button',
  disabled = false,
}: PrimaryButtonProps) {
  const baseClasses = `${styles.primaryButton} ${className}`

  // If href is provided, render as a link
  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        download={download}
        target={target}
        rel={rel}
      >
        {children}
        {icon && <span className={styles.icon}>{icon}</span>}
      </a>
    )
  }

  // Otherwise render as a button
  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {icon && <span className={styles.icon}>{icon}</span>}
    </button>
  )
}
