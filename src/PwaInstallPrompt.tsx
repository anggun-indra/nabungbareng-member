import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Download,
  X,
  Share,
  PlusSquare,
  Smartphone,
  CheckCircle2,
} from "lucide-react"
import NabungBarengLogo from "./components/NabungBarengLogo"

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

const DISMISS_KEY = "pwa_dismissed_until"
const FIFTEEN_MINS_MS = 15 * 60 * 1000

// Global holder for deferred prompt so any component (e.g. Account tab button) can trigger it
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null
const promptListeners = new Set<(
  prompt: BeforeInstallPromptEvent | null,
) => void>()

export function getGlobalInstallPrompt() {
  return globalDeferredPrompt
}

export function subscribeToInstallPrompt(
  listener: (prompt: BeforeInstallPromptEvent | null) => void,
) {
  promptListeners.add(listener)
  return () => {
    promptListeners.delete(listener)
  }
}

export function triggerGlobalInstall(onIOS?: () => void) {
  const isIOSDevice =
    /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) &&
    !(window as unknown as { MSStream?: unknown }).MSStream

  if (isIOSDevice) {
    if (onIOS) onIOS()
    return
  }

  const promptEvent = globalDeferredPrompt
  if (promptEvent) {
    promptEvent.prompt().then(() => {
      promptEvent.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          globalDeferredPrompt = null
          promptListeners.forEach((fn) => fn(null))
        }
      })
    })
  } else {
    alert(
      'Untuk memasang aplikasi: Buka menu browser (ikon titik tiga atau bagikan) lalu pilih "Tambahkan ke Layar Utama" / "Install Aplikasi".',
    )
  }
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // 1. Check if running in standalone mode (already running inside installed PWA)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true

    setIsStandalone(standalone)
    if (standalone) {
      return
    }

    // 2. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream

    if (isIosDevice) {
      setIsIOS(true)
      const dismissedUntil = localStorage.getItem(DISMISS_KEY)
      if (!dismissedUntil || Date.now() >= Number(dismissedUntil)) {
        const timer = setTimeout(() => {
          setShowPrompt(true)
        }, 1500)
        return () => clearTimeout(timer)
      }
      return
    }

    // 3. Listen for beforeinstallprompt event (Android / Chromium / Desktop / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      globalDeferredPrompt = promptEvent
      promptListeners.forEach((fn) => fn(promptEvent))

      const dismissedUntil = localStorage.getItem(DISMISS_KEY)
      if (!dismissedUntil || Date.now() >= Number(dismissedUntil)) {
        setShowPrompt(true)
      }
    }

    // 4. Listen for appinstalled event
    const handleAppInstalled = () => {
      setShowPrompt(false)
      setDeferredPrompt(null)
      globalDeferredPrompt = null
      promptListeners.forEach((fn) => fn(null))
      setIsStandalone(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // Fallback: If not standalone and prompt hasn't fired in 2s (e.g. desktop/mobile browsers without native event)
    const fallbackTimer = setTimeout(() => {
      const dismissedUntil = localStorage.getItem(DISMISS_KEY)
      if (!dismissedUntil || Date.now() >= Number(dismissedUntil)) {
        if (!standalone && !showPrompt) {
          setShowPrompt(true)
        }
      }
    }, 2000)

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      )
      window.removeEventListener("appinstalled", handleAppInstalled)
      clearTimeout(fallbackTimer)
    }
  }, [])

  // Handle "Nanti" (Snooze for 15 minutes)
  const handleDismiss = () => {
    const nextPromptTime = Date.now() + FIFTEEN_MINS_MS
    localStorage.setItem(DISMISS_KEY, nextPromptTime.toString())
    setShowPrompt(false)
    setShowIOSModal(false)
  }

  // Handle "Pasang Sekarang"
  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true)
      return
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const choice = await deferredPrompt.userChoice
        if (choice.outcome === "accepted") {
          setShowPrompt(false)
          setDeferredPrompt(null)
          globalDeferredPrompt = null
        } else {
          handleDismiss()
        }
      } catch (err) {
        console.error("Install prompt error:", err)
      }
    } else {
      // Direct instruction if browser hasn't fired beforeinstallprompt
      setShowIOSModal(true)
    }
  }

  if (isStandalone || !showPrompt) return null

  return (
    <>
      {/* Floating Bottom Card */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="fixed bottom-20 left-3 right-3 z-50 max-w-md mx-auto"
        >
          <div className="bg-[#0F172A] text-white rounded-3xl p-4 shadow-2xl border border-blue-500/30 flex flex-col gap-3.5 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <NabungBarengLogo
                size={44}
                className="flex-shrink-0 drop-shadow-md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-white truncate">
                    Pasang NabungBareng
                  </h4>
                  <span className="bg-teal-500/20 text-teal-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-teal-400/30">
                    PWA
                  </span>
                </div>
                <p className="text-slate-300 text-xs mt-0.5 leading-snug">
                  Akses instan dari layar utama, loading super cepat &amp; hemat
                  kuota.
                </p>
              </div>
              <button
                onClick={handleDismiss}
                aria-label="Tutup"
                className="text-slate-400 hover:text-white p-1 -mr-1 -mt-1 cursor-pointer rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-white/10">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 active:scale-[0.98] transition-all min-h-[42px] flex items-center justify-center cursor-pointer"
              >
                Nanti
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-600 active:scale-[0.98] transition-all shadow-md shadow-blue-500/30 min-h-[42px] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Pasang Sekarang</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Step-by-Step Instructions Modal (iOS / Generic Browser) */}
      {showIOSModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm p-5 text-[#0F172A] shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <NabungBarengLogo
                  size={36}
                  className="flex-shrink-0 drop-shadow-xs"
                />
                <div>
                  <h3 className="font-bold text-sm">Pasang ke Layar Utama</h3>
                  <p className="text-slate-400 text-xs">
                    Akses mudah seperti aplikasi biasa
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-[#2563EB] font-bold flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                  1
                </div>
                <div>
                  Ketuk tombol <strong>Menu / Bagikan</strong>{" "}
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-200 rounded text-[11px] font-bold">
                    <Share className="w-3 h-3 inline" /> Share / Titik 3
                  </span>{" "}
                  pada peramban browser Anda.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-[#2563EB] font-bold flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                  2
                </div>
                <div>
                  Pilih opsi{" "}
                  <strong className="text-[#2563EB]">
                    "Tambahkan ke Layar Utama" (Add to Home Screen)
                  </strong>{" "}
                  atau <strong>"Install App"</strong>.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowIOSModal(false)
                handleDismiss()
              }}
              className="w-full bg-[#2563EB] hover:bg-blue-600 text-white py-3.5 rounded-2xl font-bold text-xs shadow-md shadow-blue-500/25 min-h-[46px] cursor-pointer"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  )
}
