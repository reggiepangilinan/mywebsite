'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(threshold = 0.1, rootMargin = '0px') {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const currentRef = ref.current

    // Check if we're on a small mobile device and should skip animations
    const isSmallMobile =
      typeof window !== 'undefined' && window.innerWidth <= 375

    if (isSmallMobile) {
      // On very small screens, just show content immediately
      setIsVisible(true)
      return
    }

    // Check if this is a blog post page with images
    const isBlogPost =
      typeof window !== 'undefined' &&
      window.location.pathname.includes('/blog/') &&
      !window.location.pathname.includes('/blog/page/')

    const hasImages =
      currentRef &&
      (currentRef.querySelector('img') ||
        currentRef.querySelector('[class*="image"]'))

    // Use more refined settings for blog posts with images - very gentle and natural
    const effectiveThreshold =
      isBlogPost && hasImages
        ? 0.1 // More relaxed threshold for natural trigger
        : typeof window !== 'undefined' && window.innerWidth <= 768
          ? 0.05
          : threshold
    const effectiveRootMargin =
      isBlogPost && hasImages
        ? '100px' // Larger margin for earlier, more natural trigger
        : typeof window !== 'undefined' && window.innerWidth <= 768
          ? '-50px'
          : rootMargin

    // Shorter backup timer for quicker fallback
    const backupTimer =
      isBlogPost && hasImages
        ? setTimeout(() => {
            setIsVisible(true)
          }, 1000) // Reduced to 1s for quicker fallback
        : null

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (backupTimer) clearTimeout(backupTimer)
          setIsVisible(true)
          // Once visible, stop observing to prevent re-triggering
          if (currentRef) {
            observer.unobserve(currentRef)
          }
        }
      },
      {
        threshold: effectiveThreshold,
        rootMargin: effectiveRootMargin,
      }
    )

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (backupTimer) clearTimeout(backupTimer)
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin])

  return { ref, isVisible }
}
