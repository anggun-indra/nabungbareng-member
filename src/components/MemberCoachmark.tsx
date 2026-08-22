import React, { useState, useEffect, useCallback } from "react"
import {
  Home,
  Activity,
  Plus,
  BarChart3,
  User,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Lightbulb,
  Wallet,
  CheckCircle2,
} from "lucide-react"
import { haptic } from "../utils/haptics"

export const MEMBER_COACHMARK_STORAGE_KEY =
  "nabungbareng_member_coachmark_completed"

export interface MemberCoachmarkStep {
  id: string
  targetSelector: string
  badge: string
  title: string
  description: string
  tip?: string
  icon: React.ElementType
}

const MEMBER_STEPS: MemberCoachmarkStep[] = [
  {
    id: "beranda",
    targetSelector: '[data-coachmark="tab-beranda"]',
    badge: "Langkah 1 dari 5",
    title: "1. Beranda & Saldo Tabungan Anak",
    description:
      "Pantau saldo tabungan yang telah terkumpul, target iuran bulanan kelas, dan status kelancaran menabung (Lancar / Lunas) secara realtime.",
    tip: "Saldo akan bertambah otomatis begitu setoran Anda diverifikasi oleh bendahara.",
    icon: Home,
  },
  {
    id: "kirim",
    targetSelector: '[data-coachmark="member-kirim-fab"]',
    badge: "Langkah 2 dari 5",
    title: "2. Setor & Unggah Bukti Transfer",
    description:
      "Tekan tombol (+) ini untuk menyetor tabungan. Foto atau unggah slip transfer bank Anda, dan AI pintar kami otomatis membaca nominal & tanggalnya.",
    tip: "Anda dapat menyetor untuk 1 bulan atau beberapa bulan sekaligus!",
    icon: Plus,
  },
  {
    id: "aktivitas",
    targetSelector: '[data-coachmark="tab-aktivitas"]',
    badge: "Langkah 3 dari 5",
    title: "3. Mutasi & Status Verifikasi",
    description:
      "Lihat riwayat seluruh setoran Anda beserta statusnya (Disetujui atau Menunggu Verifikasi), serta mutasi pengeluaran kas kelas.",
    tip: "Gunakan filter periode bulan untuk mengecek mutasi tabungan sebelumnya.",
    icon: Activity,
  },
  {
    id: "laporan",
    targetSelector: '[data-coachmark="tab-laporan"]',
    badge: "Langkah 4 dari 5",
    title: "4. Laporan Kas Kelas Terbuka",
    description:
      "Cek transparansi kas kelas yang dikelola bendahara. Anda dapat melihat total dana terkumpul dan rincian belanja keperluan siswa.",
    tip: "Semua pembukuan kas kelas terbuka dan dapat diakses bersama.",
    icon: BarChart3,
  },
  {
    id: "akun",
    targetSelector: '[data-coachmark="tab-akun"]',
    badge: "Langkah 5 dari 5",
    title: "5. Profil, Ganti Kelas & Panduan",
    description:
      "Punya anak di kelas lain? Ganti grup tabungan dengan cepat atau gabung ke grup baru dengan Kode Undangan. Anda juga bisa membuka panduan ini lagi kapan saja.",
    tip: "Semua informasi akun dan instalasi aplikasi HP ada di tab ini.",
    icon: User,
  },
]

interface MemberCoachmarkProps {
  isOpen: boolean
  onClose: () => void
  onSelectTab?: (tab: "beranda" | "aktivitas" | "laporan" | "akun") => void
}

export default function MemberCoachmark({
  isOpen,
  onClose,
  onSelectTab,
}: MemberCoachmarkProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  const step = MEMBER_STEPS[currentStepIndex]
  const StepIcon = step.icon

  // Measure target element position on screen
  const updatePosition = useCallback(() => {
    if (!isOpen) return
    const el = document.querySelector(step.targetSelector)
    if (el) {
      const rect = el.getBoundingClientRect()
      setTargetRect(rect)
    } else {
      setTargetRect(null)
    }
  }, [isOpen, step.targetSelector])

  useEffect(() => {
    if (!isOpen) return
    updatePosition()

    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)

    const timeout = setTimeout(updatePosition, 100)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
      clearTimeout(timeout)
    }
  }, [isOpen, currentStepIndex, updatePosition])

  if (!isOpen) return null

  const handleNext = () => {
    haptic.light()
    if (currentStepIndex < MEMBER_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1
      setCurrentStepIndex(nextIdx)
      const nextStep = MEMBER_STEPS[nextIdx]
      if (
        onSelectTab &&
        (nextStep.id === "beranda" ||
          nextStep.id === "aktivitas" ||
          nextStep.id === "laporan" ||
          nextStep.id === "akun")
      ) {
        onSelectTab(nextStep.id)
      }
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    haptic.light()
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1
      setCurrentStepIndex(prevIdx)
      const prevStep = MEMBER_STEPS[prevIdx]
      if (
        onSelectTab &&
        (prevStep.id === "beranda" ||
          prevStep.id === "aktivitas" ||
          prevStep.id === "laporan" ||
          prevStep.id === "akun")
      ) {
        onSelectTab(prevStep.id)
      }
    }
  }

  const handleComplete = () => {
    haptic.success()
    try {
      localStorage.setItem(MEMBER_COACHMARK_STORAGE_KEY, "true")
    } catch (e) {
      console.warn("Notice saving member coachmark state:", e)
    }
    onClose()
  }

  const isTargetVisible =
    !!targetRect && targetRect.width > 0 && targetRect.height > 0

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-150">
      {/* Crystal Clear Clickable Backdrop (Dismiss on tap outside, NO BLUR) */}
      <div className="fixed inset-0 z-40" onClick={handleComplete} />

      {/* Crystal Clear Cutout Spotlight Mask (NO BLUR - 100% Sharp Page Content) */}
      {isTargetVisible && targetRect ? (
        <svg className="fixed inset-0 w-full h-full pointer-events-none z-40">
          <defs>
            <mask id="member-coachmark-spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={Math.max(0, targetRect.left - 6)}
                y={Math.max(0, targetRect.top - 6)}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx={step.id === "kirim" ? "32" : "16"}
                ry={step.id === "kirim" ? "32" : "16"}
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(15, 23, 42, 0.32)"
            mask="url(#member-coachmark-spotlight-mask)"
            className="transition-all duration-300"
          />
        </svg>
      ) : (
        <div className="fixed inset-0 bg-slate-900/25 transition-opacity duration-300 z-40 pointer-events-none" />
      )}

      {/* Target Element Highlight Glowing Ring */}
      {isTargetVisible && targetRect && (
        <div
          className={`fixed pointer-events-none transition-all duration-300 ease-out z-40 ring-4 ring-[#2563EB] shadow-[0_0_25px_rgba(37,99,235,0.6)] ${
            step.id === "kirim" ? "rounded-full" : "rounded-2xl"
          }`}
          style={{
            top: `${Math.max(0, targetRect.top - 4)}px`,
            left: `${Math.max(0, targetRect.left - 4)}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`,
            backgroundColor: "transparent",
          }}
        />
      )}

      {/* Floating Card: Positioned comfortably on Mobile */}
      <div className="fixed bottom-24 left-3 right-3 max-w-sm mx-auto z-50 pointer-events-auto">
        <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 text-[#0F172A] relative space-y-3.5 animate-in zoom-in-95 duration-200">
          {/* Header & Step Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center justify-center flex-shrink-0 shadow-inner">
                <StepIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {step.badge}
                </span>
                <h4 className="font-extrabold text-sm sm:text-[15px] text-[#0F172A] leading-tight mt-1 truncate">
                  {step.title}
                </h4>
              </div>
            </div>

            <button
              onClick={handleComplete}
              title="Tutup Panduan"
              className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {step.description}
          </p>

          {/* Tip Box */}
          {step.tip && (
            <div className="p-2.5 bg-amber-50/90 border border-amber-200/80 rounded-2xl flex items-start gap-2 text-xs text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-snug font-medium">
                <strong className="font-bold">Tips:</strong> {step.tip}
              </p>
            </div>
          )}

          {/* Step Dots Indicator & Navigation Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {MEMBER_STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    haptic.selection()
                    setCurrentStepIndex(idx)
                    if (
                      onSelectTab &&
                      (s.id === "beranda" ||
                        s.id === "aktivitas" ||
                        s.id === "laporan" ||
                        s.id === "akun")
                    ) {
                      onSelectTab(s.id)
                    }
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? "w-5 bg-[#2563EB]"
                      : idx < currentStepIndex
                        ? "w-2 bg-blue-200"
                        : "w-2 bg-slate-200"
                  }`}
                  title={`Langkah ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {currentStepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title="Sebelumnya"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleComplete}
                className="px-2.5 py-1.5 text-slate-400 hover:text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
              >
                Lewati
              </button>

              <button
                onClick={handleNext}
                className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>
                  {currentStepIndex === MEMBER_STEPS.length - 1
                    ? "Saya Mengerti!"
                    : "Lanjut"}
                </span>
                {currentStepIndex === MEMBER_STEPS.length - 1 ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
