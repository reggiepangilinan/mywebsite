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

    // Check if this is an individual blog post page with images (not blog list)
    const isBlogPost =
      typeof window !== 'undefined' &&
      window.location.pathname.includes('/blog/') &&
      !window.location.pathname.includes('/blog/page/') &&
      window.location.pathname !== '/blog' && // Exclude blog list page
      window.location.pathname.split('/').length > 3 // Ensure it's a specific post like /blog/post-slug

    // Enhanced detection for images that might still be loading
    const hasImageElements =
      currentRef &&
      (currentRef.querySelector('img[src]') ||
        currentRef.querySelector('[class*="image"]') ||
        currentRef.querySelector('[class*="Image"]'))

    // Use more refined settings for blog posts with images - very gentle and natural
    const effectiveThreshold =
      isBlogPost && hasImageElements
        ? 0.1 // More relaxed threshold for natural trigger
        : typeof window !== 'undefined' && window.innerWidth <= 768
          ? 0.05
          : threshold
    const effectiveRootMargin =
      isBlogPost && hasImageElements
        ? '100px' // Larger margin for earlier, more natural trigger
        : typeof window !== 'undefined' && window.innerWidth <= 768
          ? '-50px'
          : rootMargin

    // Adaptive backup timer based on image loading
    const backupTimer =
      isBlogPost && hasImageElements
        ? setTimeout(() => {
            setIsVisible(true)
          }, 1200) // Slightly longer for image loading
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
