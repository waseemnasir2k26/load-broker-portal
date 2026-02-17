import { useState, useEffect, useRef } from 'react'

export function useAnimatedCounter(endValue, duration = 1000, startOnMount = true) {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const frameRef = useRef(null)
  const startTimeRef = useRef(null)

  const animate = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp
    }

    const elapsed = timestamp - startTimeRef.current
    const progress = Math.min(elapsed / duration, 1)

    const easeOutQuad = 1 - (1 - progress) * (1 - progress)
    const currentValue = Math.floor(easeOutQuad * endValue)

    setCount(currentValue)

    if (progress < 1) {
      frameRef.current = requestAnimationFrame(animate)
    } else {
      setCount(endValue)
      setIsAnimating(false)
    }
  }

  const startAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)
    startTimeRef.current = null
    frameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (startOnMount && endValue > 0) {
      startAnimation()
    }
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [endValue, startOnMount])

  return { count, isAnimating, startAnimation }
}

export default useAnimatedCounter
