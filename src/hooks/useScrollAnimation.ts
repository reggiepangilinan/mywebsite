'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(threshold = 0.1, rootMargin = '0px') {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const currentRef = ref.current
    
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
        threshold,
        rootMargin,
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
