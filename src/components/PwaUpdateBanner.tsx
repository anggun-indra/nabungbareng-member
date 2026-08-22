import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, RefreshCw, X, ArrowRight, CheckCircle2 } from "lucide-react"
import {
  subscribeToPwaUpdates,
  forcePwaUpdate,
  type UpdateCheckResult,
} from "../utils/pwaUpdater"
import { haptic } from "../utils/haptics"

export default function PwaUpdateBanner() {
  const [updateInfo, setUpdateInfo] = useState<UpdateCheckResult | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToPwaUpdates((info) => {
      if (info.hasUpdate) {
        setUpdateInfo(info)
        setIsDismissed(false)
      }
    })
    return () => unsubscribe()
  }, [])

  if (!updateInfo || !updateInfo.hasUpdate || isDismissed) {
    return null
  }

  const handleUpdate = async () => {
    haptic.success()
    setIsUpdating(true)
    await forcePwaUpdate()
  }

  const handleDismiss = () => {
    haptic.light()
    setIsDismissed(true)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bottom-20 left-3 right-3 z-50 max-w-md mx-auto"
      >
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F766E] text-white rounded-2xl p-4 shadow-2xl border border-teal-500/30 flex flex-col gap-3 backdrop-blur-lg">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">
                    Versi Baru Tersedia!
                  </h4>
                  <span className="bg-teal-400/20 text-teal-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-teal-300/30">
                    {updateInfo.serverVersion ||
                      "v" + updateInfo.currentVersion}
                  </span>
                </div>
                <p className="text-slate-300 text-xs mt-0.5 leading-snug truncate">
                  {updateInfo.releaseNotes ||
                    "Pembaruan aplikasi siap dipasang."}
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-white p-1 -mr-1 -mt-1 cursor-pointer transition-colors"
              title="Tutup banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-white/10">
            <button
              onClick={handleDismiss}
              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 active:scale-[0.98] transition-all min-h-[40px] flex items-center justify-center cursor-pointer"
            >
              Nanti Saja
            </button>
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-teal-600 active:scale-[0.98] transition-all shadow-md shadow-teal-900/40 min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isUpdating ? "animate-spin" : ""}`}
              />
              <span>
                {isUpdating ? "Memasang Update..." : "Update Sekarang"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
