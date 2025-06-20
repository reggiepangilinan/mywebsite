'use client'

import { useEffect, useRef, useState } from 'react'

export function useBlogScrollAnimation(priority = false) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const currentRef = ref.current

    // Check if we're on a small mobile device and should skip animations
    const isSmallMobile =
      typeof window !== 'undefined' && window.innerWidth <= 480

    if (isSmallMobile) {
      // On very small screens, just show content immediately
      setIsVisible(true)
      return
    }

    // Blog-specific settings optimized for content with images
    const threshold = priority ? 0.01 : 0.05 // Very aggressive for priority content
    const rootMargin = priority ? '100px' : '50px' // Trigger early

    // Backup timer specifically tuned for blog posts
    const backupTimer = setTimeout(
      () => {
        setIsVisible(true)
      },
      priority ? 400 : 600
    ) // Priority content shows faster

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(backupTimer)
          setIsVisible(true)
          // Once visible, stop observing
          if (currentRef) {
            observer.unobserve(currentRef)
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      clearTimeout(backupTimer)
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [priority])

  return { ref, isVisible }
}
