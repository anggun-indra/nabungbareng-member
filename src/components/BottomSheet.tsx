import React, { useEffect } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { haptic } from "../utils/haptics"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  subtitle?: string
  maxHeight?: string
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  maxHeight = "max-h-[92vh]",
}: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 400) {
      haptic.light()
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              haptic.light()
              onClose()
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          {/* Sheet Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 300,
              mass: 0.8,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            className={`relative w-full max-w-lg bg-white rounded-t-[28px] shadow-2xl flex flex-col ${maxHeight} z-10 overscroll-contain`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Drag Bar */}
            <div className="pt-3 pb-2 px-6 flex flex-col items-center flex-shrink-0 cursor-grab active:cursor-grabbing border-b border-slate-100">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-3" />
              {(title || subtitle) && (
                <div className="w-full flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    {title && (
                      <h2 className="text-[#0F172A] font-bold text-base md:text-lg leading-tight truncate">
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p className="text-slate-500 text-xs mt-0.5 truncate">
                        {subtitle}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      haptic.light()
                      onClose()
                    }}
                    aria-label="Tutup"
                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center -mr-2 min-w-[32px] min-h-[32px]"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 scrollbar-hide pb-safe">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
