import { useEffect, useState } from "react"
import { animate, useMotionValue } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  className?: string
}

export default function AnimatedCounter({
  value,
  duration = 0.8,
  prefix = "Rp",
  className = "",
}: AnimatedCounterProps) {
  const motionVal = useMotionValue(0)
  const [displayVal, setDisplayVal] = useState(0)

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration,
      ease: [0.16, 1, 0.3, 1], // iOS style smooth ease-out
      onUpdate: (latest) => {
        setDisplayVal(Math.round(latest))
      },
    })
    return () => controls.stop()
  }, [value, duration, motionVal])

  return (
    <span className={className}>
      {prefix}
      {displayVal.toLocaleString("id-ID")}
    </span>
  )
}
