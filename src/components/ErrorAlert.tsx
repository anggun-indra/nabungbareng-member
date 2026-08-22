import React, { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, Copy, Check } from "lucide-react"
import { haptic } from "../utils/haptics"

interface ErrorAlertProps {
  message: string
  title?: string
  className?: string
  variant?: "light" | "dark"
}

export default function ErrorAlert({
  message,
  title,
  className = "",
  variant = "light",
}: ErrorAlertProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(message)
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = message
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
      }
      setCopied(true)
      haptic.success()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn("Copy failed:", err)
    }
  }

  const isDark = variant === "dark"

  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`w-full p-3.5 rounded-2xl flex items-start justify-between gap-3 text-left transition-all ${
        isDark
          ? "bg-red-500/15 border border-red-500/30 text-red-200"
          : "bg-red-50 border border-red-200 text-red-800"
      } ${className}`}
    >
      <div className="flex items-start gap-2.5 min-w-0 flex-1">
        <AlertCircle
          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
            isDark ? "text-red-400" : "text-red-600"
          }`}
        />
        <div className="min-w-0 flex-1">
          {title && (
            <p
              className={`font-bold text-xs leading-tight mb-0.5 ${
                isDark ? "text-red-100" : "text-red-900"
              }`}
            >
              {title}
            </p>
          )}
          <p className="text-xs leading-relaxed break-words font-medium select-all">
            {message}
          </p>
        </div>
      </div>

      {/* Copy Button */}
      <button
        type="button"
        onClick={handleCopy}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex-shrink-0 transition-all active:scale-95 cursor-pointer select-none ${
          copied
            ? "bg-emerald-600 text-white shadow-xs"
            : isDark
              ? "bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30"
              : "bg-white hover:bg-red-100/60 text-red-700 border border-red-200 shadow-2xs"
        }`}
        title="Salin pesan error"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 text-white" />
            <span>Tersalin</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" />
            <span>Salin</span>
          </>
        )}
      </button>
    </motion.div>
  )
}
