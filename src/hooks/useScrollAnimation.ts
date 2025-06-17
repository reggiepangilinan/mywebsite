'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(threshold = 0.1, rootMargin = '0px') {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const currentRef = ref.current
    
    // Check if we're on a small mobile device and should skip animations
    const isSmallMobile = typeof window !== 'undefined' && window.innerWidth <= 375
    
    if (isSmallMobile) {
      // On very small screens, just show content immediately
      setIsVisible(true)
      return
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once visible, stop observing to prevent re-triggering
          if (currentRef) {
            observer.unobserve(currentRef)
          }
        }
      },
      {
        threshold: typeof window !== 'undefined' && window.innerWidth <= 768 ? 0.05 : threshold,
        rootMargin: typeof window !== 'undefined' && window.innerWidth <= 768 ? '-50px' : rootMargin,
      }
    )

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin])

  return { ref, isVisible }
}
