import React, { useState, useRef, useMemo, useEffect } from "react"
import {
  UploadCloud,
  FileCheck,
  AlertCircle,
  X,
  Layers,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Camera,
  ArrowRight,
  Check,
  Clock,
} from "lucide-react"
import BottomSheet from "./BottomSheet"
import { compressImage, type CompressionResult } from "../utils/imageCompressor"
import { haptic } from "../utils/haptics"
import confetti from "canvas-confetti"
import { uploadAndSubmitPayment } from "../services/api"
import { auth } from "../lib/firebase"
import type { Submission, TransactionItem } from "../types"

export interface KirimBuktiSheetProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (sub: Submission) => void
  groupId?: string
  userId?: string
  groupName?: string
  targetBulanan?: number
  startMonth?: string
  groupStartMonth?: string
  preselectedMonth?: string | null
  existingTransactions?: TransactionItem[]
}

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
]

function generateMonthSequence(startMonthStr?: string): string[] {
  const now = new Date()
  let startYear = now.getFullYear()
  let startMonth = now.getMonth()

  if (startMonthStr && /^\d{4}-\d{2}$/.test(startMonthStr)) {
    const [y, m] = startMonthStr.split("-").map(Number)
    startYear = y
    startMonth = m - 1
  }

  const currentYear = now.getFullYear()
  const endYear = currentYear + 1
  const endMonth = now.getMonth()

  const list: string[] = []
  let y = startYear
  let m = startMonth

  while (y < endYear || (y === endYear && m <= endMonth)) {
    list.push(`${MONTH_NAMES[m]} ${y}`)
    m++
    if (m > 11) {
      m = 0
      y++
    }
  }
  return list
}

export default function KirimBuktiSheet({
  isOpen,
  onClose,
  onSuccess,
  groupId,
  userId,
  groupName = "Grup Tabungan",
  targetBulanan = 25000,
  startMonth,
  groupStartMonth,
  preselectedMonth,
  existingTransactions = [],
}: KirimBuktiSheetProps) {
  const [compressionResult, setCompressionResult] =
    useState<CompressionResult | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  // Track paid and pending months to resolve unpaid/backdate months
  const paidOrPendingMonths = useMemo(() => {
    const set = new Set<string>()
    if (existingTransactions) {
      existingTransactions.forEach((t) => {
        if (
          t.jenis === "Setoran" ||
          t.status === "Disetujui" ||
          t.status === "Menunggu"
        ) {
          if (t.periodAllocations && t.periodAllocations.length > 0) {
            t.periodAllocations.forEach((a) =>
              set.add(a.period.trim().toLowerCase()),
            )
          } else if (t.periode) {
            t.periode.split(",").forEach((p) => set.add(p.trim().toLowerCase()))
          }
        }
      })
    }
    return set
  }, [existingTransactions])

  // Member's active month sequence starting from their effective join month
  const allMonths = useMemo(
    () => generateMonthSequence(startMonth || groupStartMonth),
    [startMonth, groupStartMonth],
  )

  // Full group sequence starting from group inception for optional custom selection
  const fullGroupMonths = useMemo(
    () => generateMonthSequence(groupStartMonth || startMonth),
    [groupStartMonth, startMonth],
  )

  const unpaidMonths = useMemo(() => {
    const unpaid = allMonths.filter(
      (m) => !paidOrPendingMonths.has(m.toLowerCase()),
    )
    return unpaid.length > 0
      ? unpaid
      : [allMonths[allMonths.length - 1] || "Agustus 2026"]
  }, [allMonths, paidOrPendingMonths])

  // Payment mode: '1month' | '2month' | '3month' | 'custom_months' | 'free'
  const [paymentMode, setPaymentMode] =
    useState<"1month" | "2month" | "3month" | "custom_months" | "free">(
      "1month",
    )
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [showCustomMonthPicker, setShowCustomMonthPicker] = useState(false)

  const [nominal, setNominal] = useState<string>(targetBulanan.toString())
  const [tanggal, setTanggal] = useState(
    () => new Date().toISOString().split("T")[0],
  )
  const [catatan, setCatatan] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Initialize selected months on open or unpaid months change
  useEffect(() => {
    if (isOpen) {
      if (preselectedMonth) {
        setSelectedMonths([preselectedMonth])
        setPaymentMode("custom_months")
        setNominal(targetBulanan.toString())
      } else {
        const initial = unpaidMonths.slice(0, 1)
        setSelectedMonths(initial)
        setPaymentMode("1month")
        setNominal(targetBulanan.toString())
      }
      setTanggal(new Date().toISOString().split("T")[0])
      setErrors({})
      setSubmitError(null)
    }
  }, [isOpen, unpaidMonths, targetBulanan, preselectedMonth])

  const handleSelect1Month = () => {
    setPaymentMode("1month")
    const months = unpaidMonths.slice(0, 1)
    setSelectedMonths(months)
    setNominal((targetBulanan * 1).toString())
    setShowCustomMonthPicker(false)
    haptic.light()
  }

  const handleSelect2Month = () => {
    setPaymentMode("2month")
    const months = unpaidMonths.slice(0, 2)
    setSelectedMonths(months)
    setNominal((targetBulanan * 2).toString())
    setShowCustomMonthPicker(false)
    haptic.light()
  }

  const handleSelect3Month = () => {
    setPaymentMode("3month")
    const months = unpaidMonths.slice(0, 3)
    setSelectedMonths(months)
    setNominal((targetBulanan * 3).toString())
    setShowCustomMonthPicker(false)
    haptic.light()
  }

  const handleSelectFree = () => {
    setPaymentMode("free")
    setSelectedMonths(unpaidMonths.slice(0, 1))
    setShowCustomMonthPicker(false)
    haptic.light()
  }

  const toggleCustomMonth = (m: string) => {
    setPaymentMode("custom_months")
    setSelectedMonths((prev) => {
      let next: string[]
      if (prev.includes(m)) {
        next = prev.filter((item) => item !== m)
        if (next.length === 0) next = [m] // Keep at least one
      } else {
        next = [...prev, m]
      }
      setNominal((targetBulanan * next.length).toString())
      return next
    })
    haptic.light()
  }

  const handleProcessFile = async (f: File) => {
    if (!f.type.startsWith("image/")) {
      haptic.error()
      setErrors((prev) => ({
        ...prev,
        file: "Mohon unggah file gambar (JPG, PNG, WebP). PDF tidak didukung.",
      }))
      return
    }

    setErrors((prev) => {
      const next = { ...prev }
      delete next.file
      return next
    })

    setIsCompressing(true)
    setIsScanning(true)
    setScanComplete(false)
    haptic.light()

    try {
      const result = await compressImage(f, {
        maxDimension: 1920,
        fallbackDimension: 1600,
        initialQuality: 0.82,
        fallbackQuality: 0.65,
        targetSizeKb: 600,
        maxSizeKb: 750,
      })

      setCompressionResult(result)

      if (!result.isUnderLimit) {
        setErrors((prev) => ({
          ...prev,
          file: "Ukuran gambar melebihi batas 750 KB setelah dikompres. Mohon ambil foto lebih dekat.",
        }))
      }

      setTimeout(() => {
        setIsScanning(false)
        setScanComplete(true)
        haptic.success()
      }, 500)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal memproses gambar."
      haptic.error()
      setErrors((prev) => ({
        ...prev,
        file: message,
      }))
    } finally {
      setIsCompressing(false)
    }
  }

  const handleNominalChange = (valStr: string) => {
    const numericOnly = valStr.replace(/\D/g, "")
    setNominal(numericOnly)
    setPaymentMode("free")

    setErrors((prev) => {
      const next = { ...prev }
      delete next.nominal
      return next
    })
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!compressionResult) {
      errs.file = "Bukti transfer wajib diunggah"
    } else if (!compressionResult.isUnderLimit) {
      errs.file = "Ukuran gambar melebihi batas 750 KB"
    }

    const num = Number(nominal)
    if (!nominal || isNaN(num) || num < 1000) {
      errs.nominal = "Nominal minimal Rp1.000"
    }
    if (!tanggal) {
      errs.tanggal = "Tanggal transfer wajib diisi"
    }
    if (selectedMonths.length === 0) {
      errs.periode = "Minimal pilih 1 bulan alokasi iuran"
    }
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      haptic.error()
    }
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validate() || !compressionResult) return

    const effectiveUserId = userId || auth.currentUser?.uid
    if (!groupId || !effectiveUserId) {
      setSubmitError(
        "Grup atau akun Anda belum terdeteksi. Silakan pilih grup terlebih dahulu.",
      )
      return
    }

    setIsSubmitting(true)

    try {
      const nominalClean = Number(nominal)

      // Calculate allocation per month
      let periodAllocations: Array<{ period: string; amount_idr: number }> = []
      let periodLabel = selectedMonths.join(", ")

      if (paymentMode === "free" || selectedMonths.length <= 1) {
        const singleMonth =
          selectedMonths[0] || unpaidMonths[0] || "Agustus 2026"
        periodLabel = singleMonth
        periodAllocations = [{ period: singleMonth, amount_idr: nominalClean }]
      } else {
        const sharePerMonth = Math.round(nominalClean / selectedMonths.length)
        periodAllocations = selectedMonths.map((m, idx) => {
          // ensure total adds up exactly to nominalClean on last item
          const isLast = idx === selectedMonths.length - 1
          const amt = isLast
            ? nominalClean - sharePerMonth * (selectedMonths.length - 1)
            : sharePerMonth
          return { period: m, amount_idr: amt }
        })
      }

      const submission = await uploadAndSubmitPayment({
        groupId,
        userId: effectiveUserId,
        file: compressionResult.file,
        amountIdr: nominalClean,
        transferDate: tanggal,
        periodLabel,
        periodAllocations,
        catatan: catatan.trim() || undefined,
        sha256: compressionResult.sha256,
      })

      haptic.success()
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.85 },
        colors: ["#2563EB", "#0F766E", "#F59E0B"],
      })

      onSuccess(submission)
      onClose()

      // Reset state
      setCompressionResult(null)
      setScanComplete(false)
      setCatatan("")
      setSubmitError(null)
    } catch (err: unknown) {
      console.error("Submit payment proof failed:", err)
      haptic.error()
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal mengirim bukti transfer. Silakan coba lagi."
      setSubmitError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const numNominal = Number(nominal) || 0

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Kirim Bukti Setoran"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pb-6">
          {submitError && (
            <div className="bg-red-50 text-red-700 p-3.5 rounded-2xl border border-red-200 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Group & Target Context Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-3.5 border border-blue-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {groupName}
              </p>
              <p className="text-xs font-bold text-[#0F172A] mt-0.5">
                Target Iuran: Rp{targetBulanan.toLocaleString("id-ID")}/bulan
              </p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold px-2.5 py-1 bg-white text-blue-700 rounded-full border border-blue-200/60 shadow-xs">
                {unpaidMonths.length > 0
                  ? `${unpaidMonths.length} Bulan Berjalan`
                  : "Semua Lunas"}
              </span>
              {startMonth && groupStartMonth && startMonth > groupStartMonth && allMonths[0] && (
                <span className="text-[9.5px] font-semibold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-full border border-teal-200">
                  Mulai aktif {allMonths[0]}
                </span>
              )}
            </div>
          </div>

          {/* Upload Box */}
          <div>
            <label className="block text-[#0F172A] font-bold text-xs uppercase tracking-wider mb-1.5">
              Foto Bukti Transfer <span className="text-red-500">*</span>
            </label>

            {!compressionResult ? (
              <div className="space-y-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-200 bg-blue-50/40 hover:bg-blue-50/70 active:scale-[0.99] rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-[#2563EB] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">
                      Pilih dari Galeri
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      JPG, PNG, WebP (Kompresi otomatis super cepat)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-200/80 min-h-[42px]"
                >
                  <Camera className="w-4 h-4 text-slate-600" />
                  <span>Ambil Foto Langsung dengan Kamera</span>
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-300">
                    <img
                      src={compressionResult.previewUrl}
                      alt="Preview bukti transfer"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setIsZoomOpen(true)}
                    />
                    {isScanning && (
                      <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-blue-400 animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#0F172A] truncate">
                        {compressionResult.file.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setCompressionResult(null)
                          setScanComplete(false)
                        }}
                        className="text-slate-400 hover:text-red-500 p-1 -mr-1 cursor-pointer"
                        title="Hapus gambar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded-md">
                        {(compressionResult.compressionRatio * 100).toFixed(0)}%
                        Lebih Hemat
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        {compressionResult.formattedOriginalSize} &rarr;{" "}
                        <strong className="text-slate-800">
                          {compressionResult.formattedCompressedSize}
                        </strong>
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <span>
                        {compressionResult.width} &times;{" "}
                        {compressionResult.height} px (JPEG)
                      </span>
                      <span>&middot;</span>
                      <span className="text-teal-700 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-teal-600 inline" />{" "}
                        Teks Tajam
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="font-mono truncate">
                      SHA256: {compressionResult.sha256.slice(0, 16)}...
                      {compressionResult.sha256.slice(-8)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsZoomOpen(true)}
                    className="text-blue-600 font-bold hover:underline flex-shrink-0 ml-2"
                  >
                    Perbesar
                  </button>
                </div>
              </div>
            )}

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleProcessFile(f)
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleProcessFile(f)
              }}
            />

            {errors.file && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.file}
              </p>
            )}
          </div>

          {/* Mode Pilihan Pembayaran & Quick Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[#0F172A] font-bold text-xs uppercase tracking-wider">
                Pilih Periode / Jumlah Bulan{" "}
                <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowCustomMonthPicker(!showCustomMonthPicker)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
              >
                {showCustomMonthPicker
                  ? "Sembunyikan Pilihan"
                  : "Pilih Bulan Manual"}
              </button>
            </div>

            {/* Quick Chips Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5">
              <button
                type="button"
                onClick={handleSelect1Month}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex flex-col items-center justify-center min-h-[44px] ${
                  paymentMode === "1month"
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60"
                }`}
              >
                <span>1 Bulan</span>
                <span
                  className={`text-[10px] ${
                    paymentMode === "1month"
                      ? "text-blue-100"
                      : "text-slate-500"
                  }`}
                >
                  Rp{(targetBulanan / 1000).toLocaleString("id-ID")}rb
                </span>
              </button>

              <button
                type="button"
                onClick={handleSelect2Month}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex flex-col items-center justify-center min-h-[44px] ${
                  paymentMode === "2month"
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60"
                }`}
              >
                <span>2 Bulan</span>
                <span
                  className={`text-[10px] ${
                    paymentMode === "2month"
                      ? "text-blue-100"
                      : "text-slate-500"
                  }`}
                >
                  Rp{((targetBulanan * 2) / 1000).toLocaleString("id-ID")}rb
                </span>
              </button>

              <button
                type="button"
                onClick={handleSelect3Month}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex flex-col items-center justify-center min-h-[44px] ${
                  paymentMode === "3month"
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60"
                }`}
              >
                <span>3 Bulan</span>
                <span
                  className={`text-[10px] ${
                    paymentMode === "3month"
                      ? "text-blue-100"
                      : "text-slate-500"
                  }`}
                >
                  Rp{((targetBulanan * 3) / 1000).toLocaleString("id-ID")}rb
                </span>
              </button>

              <button
                type="button"
                onClick={handleSelectFree}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex flex-col items-center justify-center min-h-[44px] ${
                  paymentMode === "free"
                    ? "bg-teal-700 text-white shadow-md shadow-teal-900/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60"
                }`}
              >
                <span>Tabungan Bebas</span>
                <span
                  className={`text-[10px] ${
                    paymentMode === "free" ? "text-teal-100" : "text-slate-500"
                  }`}
                >
                  1 Transaksi Utuh
                </span>
              </button>
            </div>

            {/* Custom Month Picker Checklist */}
            {showCustomMonthPicker && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-3 space-y-2">
                <p className="text-[11px] font-bold text-slate-600">
                  Pilih Bulan yang Ingin Dilunasi:
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto">
                  {fullGroupMonths.map((m) => {
                    const isPaid = paidOrPendingMonths.has(m.toLowerCase())
                    const isSelected = selectedMonths.includes(m)
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleCustomMonth(m)}
                        className={`px-2.5 py-2 rounded-xl text-xs text-left font-semibold flex items-center justify-between border transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : isPaid
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 opacity-75"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate">{m}</span>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 flex-shrink-0" />
                        ) : isPaid ? (
                          <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-full font-bold">
                            Lunas
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-400">
                            Belum
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Allocation Live Preview Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-3.5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  Rencana Alokasi Pembayaran
                </span>
                <span className="text-xs font-bold text-teal-300">
                  {selectedMonths.length} Bulan
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                {selectedMonths.map((m, idx) => {
                  const share =
                    selectedMonths.length > 0
                      ? Math.round(numNominal / selectedMonths.length)
                      : numNominal
                  const isBackdate =
                    unpaidMonths.indexOf(m) < unpaidMonths.length - 1
                  return (
                    <div
                      key={m}
                      className="flex items-center justify-between text-xs py-1 px-2.5 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-blue-500/30 text-blue-300 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-200">
                          {m}
                        </span>
                        {isBackdate && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-medium">
                            Backdate
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-white font-mono">
                        Rp{share.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Transfer Terdaftar</span>
                <span className="text-sm font-black text-teal-400 font-mono">
                  Rp{numNominal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Nominal Input */}
          <div>
            <label
              htmlFor="nominalInput"
              className="block text-[#0F172A] font-bold text-xs uppercase tracking-wider mb-1.5"
            >
              Nominal Transfer (Rp) <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-base">
                Rp
              </span>
              <input
                id="nominalInput"
                type="tel"
                inputMode="numeric"
                placeholder="0"
                value={nominal ? Number(nominal).toLocaleString("id-ID") : ""}
                onChange={(e) => handleNominalChange(e.target.value)}
                className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl text-[#0F172A] text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-[52px] ${
                  errors.nominal
                    ? "border-red-400 bg-red-50/20"
                    : "border-slate-300"
                }`}
              />
            </div>
            {errors.nominal && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.nominal}
              </p>
            )}
          </div>

          {/* Tanggal Transfer */}
          <div>
            <label className="block text-[#0F172A] font-bold text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Tanggal Transfer
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-xs font-semibold text-[#0F172A] bg-white focus:outline-none focus:border-blue-500 min-h-[48px]"
            />
            {errors.tanggal && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.tanggal}
              </p>
            )}
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-[#0F172A] font-bold text-xs uppercase tracking-wider mb-1.5">
              Catatan{" "}
              <span className="text-slate-400 font-normal lowercase">
                (opsional)
              </span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Transfer a.n. Orang Tua Siswa"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-xs text-[#0F172A] bg-white focus:outline-none focus:border-blue-500 min-h-[48px]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className="w-full bg-[#2563EB] hover:bg-blue-600 active:scale-[0.98] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all min-h-[54px] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" /> Mengirim
                  Bukti...
                </span>
              ) : (
                <>
                  <span>Kirim Setoran ke Bendahara</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </BottomSheet>

      {/* Fullscreen Zoom / Inspection Modal */}
      {isZoomOpen && compressionResult && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 select-none">
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div>
              <p className="font-bold text-sm">Pratinjau Bukti Terkompres</p>
              <p className="text-xs text-slate-400">
                {compressionResult.formattedCompressedSize} &middot;{" "}
                {compressionResult.width} &times; {compressionResult.height} px
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-auto py-4">
            <img
              src={compressionResult.previewUrl}
              alt="Full preview bukti transfer"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
          </div>

          <div className="pt-3 border-t border-white/10 text-center">
            <p className="text-xs text-teal-300 font-semibold flex items-center justify-center gap-1.5">
              <FileCheck className="w-4 h-4" />
              Gambar dioptimasi untuk ketajaman OCR & verifikasi bendahara
            </p>
          </div>
        </div>
      )}
    </>
  )
}
