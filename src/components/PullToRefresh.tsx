import React, { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ArrowDown, Check } from "lucide-react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void
  children: React.ReactNode
  className?: string
  scrollRef: React.RefObject<HTMLDivElement | null>
}

export default function PullToRefresh({
  onRefresh,
  children,
  className = "",
  scrollRef,
}: PullToRefreshProps) {
  const [pullProgress, setPullProgress] = useState(0) // 0 to 1
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const startY = useRef(0)
  const isPulling = useRef(false)
  const pullHeight = useRef(0)
  const indicatorRef = useRef<HTMLDivElement>(null)

  const THRESHOLD = 65

  const updateIndicatorDOM = useCallback((height: number) => {
    if (indicatorRef.current) {
      indicatorRef.current.style.height = `${height}px`
      indicatorRef.current.style.opacity = `${Math.min(height / 30, 1)}`
    }
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      if (isRefreshing || isSuccess) return
      if (container.scrollTop <= 0) {
        startY.current = e.touches[0].clientY
        isPulling.current = true
        pullHeight.current = 0
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || isRefreshing || isSuccess) return

      // If user has scrolled down into content, cancel pull-to-refresh immediately
      if (container.scrollTop > 0) {
        isPulling.current = false
        pullHeight.current = 0
        updateIndicatorDOM(0)
        setPullProgress(0)
        return
      }

      const currentY = e.touches[0].clientY
      const diff = currentY - startY.current

      // Only handle downward pull when at the top of scroll
      if (diff > 0) {
        // Logarithmic damping for natural elastic spring feel
        const height = Math.min(diff * 0.4, 80)
        pullHeight.current = height
        updateIndicatorDOM(height)

        const progress = Math.min(height / THRESHOLD, 1)
        setPullProgress(progress)

        // Prevent default native bounce only when actively pulling down at the very top
        if (e.cancelable && diff > 10) {
          e.preventDefault()
        }
      } else {
        // If swiping up, cancel immediately so native scrolling is instant and buttery smooth
        isPulling.current = false
        pullHeight.current = 0
        updateIndicatorDOM(0)
        setPullProgress(0)
      }
    }

    const handleTouchEnd = async () => {
      if (!isPulling.current) return
      isPulling.current = false

      if (pullHeight.current >= THRESHOLD && !isRefreshing && !isSuccess) {
        setIsRefreshing(true)
        updateIndicatorDOM(46) // Snap to loading height

        try {
          await onRefresh()
          setIsSuccess(true)
          await new Promise((r) => setTimeout(r, 500))
        } finally {
          setIsRefreshing(false)
          setIsSuccess(false)
          pullHeight.current = 0
          updateIndicatorDOM(0)
          setPullProgress(0)
        }
      } else {
        pullHeight.current = 0
        updateIndicatorDOM(0)
        setPullProgress(0)
      }
    }

    // Attach non-passive move listener to allow preventDefault only during pull
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd, { passive: true })
    container.addEventListener("touchcancel", handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
      container.removeEventListener("touchcancel", handleTouchEnd)
    }
  }, [scrollRef, isRefreshing, isSuccess, onRefresh, updateIndicatorDOM])

  return (
    <div className={`relative flex flex-col flex-1 w-full ${className}`}>
      {/* Pull Indicator Pill sitting above content */}
      <div
        ref={indicatorRef}
        style={{ height: 0, opacity: 0 }}
        className="w-full overflow-hidden flex items-center justify-center transition-all duration-150 ease-out pointer-events-none flex-shrink-0"
      >
        <div className="flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-white/90 text-blue-600 shadow-sm border border-slate-200/80 backdrop-blur-md">
          {isSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-teal-700">Data Terbarui</span>
            </>
          ) : isRefreshing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              <span>Memperbarui data...</span>
            </>
          ) : (
            <>
              <ArrowDown
                className="w-3.5 h-3.5 text-blue-600 transition-transform duration-200"
                style={{
                  transform:
                    pullProgress >= 1 ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
              <span>
                {pullProgress >= 1
                  ? "Lepaskan untuk segarkan"
                  : "Tarik untuk segarkan"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col">{children}</div>
    </div>
  )
}
