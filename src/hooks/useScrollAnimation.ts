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

    // Use more aggressive settings for blog posts with images
    const effectiveThreshold =
      isBlogPost && hasImages
        ? 0.01
        : typeof window !== 'undefined' && window.innerWidth <= 768
          ? 0.05
          : threshold
    const effectiveRootMargin =
      isBlogPost && hasImages
        ? '100px'
        : typeof window !== 'undefined' && window.innerWidth <= 768
          ? '-50px'
          : rootMargin

    // Add backup timer for blog posts with images
    const backupTimer =
      isBlogPost && hasImages
        ? setTimeout(() => {
            setIsVisible(true)
          }, 800)
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
