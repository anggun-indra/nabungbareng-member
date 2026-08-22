import React, { useMemo, useState } from "react"
import {
  CheckCircle2,
  Clock,
  PlusCircle,
  Share2,
  Printer,
  Sparkles,
  Calendar,
  Check,
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  AlertCircle,
} from "lucide-react"
import type { GroupInfo, TransactionItem, AuthUser } from "../types"
import { haptic } from "../utils/haptics"

export interface KartuIuranViewProps {
  activeGroup: GroupInfo
  currentUser: AuthUser
  transactions: TransactionItem[]
  onPayMonth: (monthName: string) => void
  onSelectTransaction?: (tx: TransactionItem) => void
  initialViewMode?: "card" | "list"
  showPayButton?: boolean
}

interface MonthCardData {
  monthName: string // e.g. "Januari 2026"
  shortName: string // e.g. "Januari"
  year: number
  monthIndex: number // 0-11
  orderNumber: number // 1-12
  status: "lunas" | "menunggu" | "belum_bayar" | "belum_gabung"
  nominal: number
  tanggal?: string
  tx?: TransactionItem
}

const MONTH_NAMES_ID = [
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

export default function KartuIuranView({
  activeGroup,
  currentUser,
  transactions,
  onPayMonth,
  onSelectTransaction,
  initialViewMode = "card",
  showPayButton = true,
}: KartuIuranViewProps) {
  // 1. Group start year minimum boundary
  const groupStartMonthStr = activeGroup.startMonth || "2026-08"
  const groupStartYear = useMemo(() => {
    if (/^\d{4}-\d{2}$/.test(groupStartMonthStr)) {
      return parseInt(groupStartMonthStr.split("-")[0], 10)
    }
    return new Date().getFullYear()
  }, [groupStartMonthStr])

  const initialYear = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Math.max(groupStartYear, currentYear)
  }, [groupStartYear])

  const [selectedYear, setSelectedYear] = useState<number>(initialYear)
  const [viewMode, setViewMode] = useState<"card" | "list">(initialViewMode)
  const [copiedWA, setCopiedWA] = useState(false)

  // 2. Build Months for Selected Calendar Year (Omits months before group start)
  const monthsData = useMemo<MonthCardData[]>(() => {
    const list: MonthCardData[] = []

    // Create maps of paid & pending transactions
    const paidMap = new Map<string, { tx: TransactionItem; nominal: number }>()
    const pendingMap = new Map<string, { tx: TransactionItem; nominal: number }>()

    transactions.forEach((tx) => {
      const isVerified = tx.jenis === "Setoran" || tx.status === "Disetujui"
      const isPending = tx.status === "Menunggu"

      if (tx.periodAllocations && tx.periodAllocations.length > 0) {
        tx.periodAllocations.forEach((alloc) => {
          const key = alloc.period.trim().toLowerCase()
          if (isVerified && !paidMap.has(key)) {
            paidMap.set(key, { tx, nominal: Number(alloc.amount_idr) })
          } else if (isPending && !pendingMap.has(key)) {
            pendingMap.set(key, { tx, nominal: Number(alloc.amount_idr) })
          }
        })
      } else if (tx.periode) {
        const parts = tx.periode.split(",")
        parts.forEach((p) => {
          const key = p.trim().toLowerCase()
          if (isVerified && !paidMap.has(key)) {
            paidMap.set(key, { tx, nominal: tx.nominal })
          } else if (isPending && !pendingMap.has(key)) {
            pendingMap.set(key, { tx, nominal: tx.nominal })
          }
        })
      }
    })

    const effectiveStartMonthStr = activeGroup.effectiveStartMonth || groupStartMonthStr

    let displayOrder = 1
    MONTH_NAMES_ID.forEach((monthShort, mIdx) => {
      const fullName = `${monthShort} ${selectedYear}`
      const key = fullName.toLowerCase()
      const yyyymm = `${selectedYear}-${String(mIdx + 1).padStart(2, "0")}`

      // HIDE months before group inception completely!
      if (yyyymm < groupStartMonthStr) {
        return
      }

      const order = displayOrder++

      if (paidMap.has(key)) {
        const item = paidMap.get(key)!
        list.push({
          monthName: fullName,
          shortName: monthShort,
          year: selectedYear,
          monthIndex: mIdx,
          orderNumber: order,
          status: "lunas",
          nominal: item.nominal,
          tanggal: item.tx.tanggal,
          tx: item.tx,
        })
      } else if (pendingMap.has(key)) {
        const item = pendingMap.get(key)!
        list.push({
          monthName: fullName,
          shortName: monthShort,
          year: selectedYear,
          monthIndex: mIdx,
          orderNumber: order,
          status: "menunggu",
          nominal: item.nominal,
          tanggal: item.tx.tanggal,
          tx: item.tx,
        })
      } else if (yyyymm < effectiveStartMonthStr) {
        list.push({
          monthName: fullName,
          shortName: monthShort,
          year: selectedYear,
          monthIndex: mIdx,
          orderNumber: order,
          status: "belum_gabung",
          nominal: 0,
        })
      } else {
        list.push({
          monthName: fullName,
          shortName: monthShort,
          year: selectedYear,
          monthIndex: mIdx,
          orderNumber: order,
          status: "belum_bayar",
          nominal: activeGroup.targetBulanan,
        })
      }
    })

    return list
  }, [selectedYear, transactions, activeGroup.effectiveStartMonth, groupStartMonthStr, activeGroup.targetBulanan])

  // Summary Metrics for the Selected Year
  const lunasCount = useMemo(() => monthsData.filter((m) => m.status === "lunas").length, [monthsData])
  const pendingCount = useMemo(() => monthsData.filter((m) => m.status === "menunggu").length, [monthsData])
  const activeObligationMonths = useMemo(
    () => monthsData.filter((m) => m.status !== "belum_gabung"),
    [monthsData],
  )
  const progressPercent = activeObligationMonths.length > 0
    ? Math.round((lunasCount / activeObligationMonths.length) * 100)
    : 0
  const totalPaidIdr = lunasCount * activeGroup.targetBulanan

  // WhatsApp Message Generator
  const handleShareWhatsApp = () => {
    haptic.success()
    const memberName = activeGroup.siswaNama || currentUser.name
    const groupName = activeGroup.nama
    const institutionName = activeGroup.sekolah

    let text = `*KARTU IURAN DIGITAL*\n`
    text += `🏢 ${groupName}${institutionName ? ` · ${institutionName}` : ""}\n`
    text += `👤 Anggota: ${memberName}\n`
    text += `📅 Tahun: ${selectedYear}\n`
    text += `💰 Target: Rp${activeGroup.targetBulanan.toLocaleString("id-ID")}/bulan\n`
    text += `📊 Status: ${lunasCount}/${activeObligationMonths.length} Bulan Lunas (${progressPercent}%)\n\n`
    text += `*RINCIAN BULAN IURAN:*\n`

    monthsData.forEach((m) => {
      let icon = "⚪"
      let desc = "Belum Bayar"
      if (m.status === "lunas") {
        icon = "✅"
        desc = `LUNAS (${m.tanggal || "Terverifikasi"})`
      } else if (m.status === "menunggu") {
        icon = "⏳"
        desc = "Menunggu Verifikasi"
      } else if (m.status === "belum_gabung") {
        icon = "➖"
        desc = "Sebelum Bergabung"
      }
      text += `${icon} ${m.monthName}: ${desc}\n`
    })

    text += `\n_Laporan digital resmi NabungBareng (${window.location.origin})_`

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")

    setCopiedWA(true)
    setTimeout(() => setCopiedWA(false), 2500)
  }

  return (
    <div className="space-y-4 print:p-0">
      {/* ─── KOP KARTU IURAN DIGITAL ─── */}
      <div className="bg-gradient-to-br from-slate-900 via-[#1E293B] to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        {/* Background ambient glows */}
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-teal-500/10 -translate-y-12 translate-x-12 blur-2xl pointer-events-none" />
        <div className="absolute left-10 bottom-0 w-36 h-36 rounded-full bg-blue-500/10 translate-y-12 blur-xl pointer-events-none" />

        {/* Top Header Row with Group Logo */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3.5 min-w-0">
            {activeGroup.logoUrl ? (
              <img
                src={activeGroup.logoUrl}
                alt={activeGroup.nama}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-white/20 shadow-md flex-shrink-0 bg-white"
              />
            ) : (
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md border border-white/20">
                <Building2 className="w-7 h-7 text-white" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">
                Kartu Iuran Digital
              </p>
              <h2 className="text-base sm:text-lg font-black text-white truncate leading-tight mt-0.5">
                {activeGroup.nama}
              </h2>
              {activeGroup.sekolah && (
                <p className="text-xs text-slate-300 truncate mt-0.5 font-medium">
                  {activeGroup.sekolah}
                </p>
              )}
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-extrabold tracking-wider uppercase flex-shrink-0 shadow-2xs">
            Resmi
          </span>
        </div>

        {/* Member Identity Information Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 pb-3 text-xs relative z-10">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Nama Anggota
            </p>
            <p className="text-sm font-black text-white truncate mt-0.5">
              {activeGroup.siswaNama || currentUser.name}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Target Iuran
            </p>
            <p className="text-sm font-black text-teal-300 truncate mt-0.5 font-mono">
              Rp{activeGroup.targetBulanan.toLocaleString("id-ID")}
              <span className="text-[10px] font-normal text-slate-400">/bln</span>
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Total Terbayar ({selectedYear})
            </p>
            <p className="text-sm font-black text-emerald-400 truncate mt-0.5 font-mono">
              Rp{totalPaidIdr.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Year Progress Bar */}
        <div className="pt-3 border-t border-white/10 space-y-1.5 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Kelancaran Iuran Tahun {selectedYear}
            </span>
            <span className="text-teal-300 font-mono">
              {lunasCount} dari {activeObligationMonths.length} Bulan ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(progressPercent, 4))}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─── YEAR PAGING & VIEW CONTROLS ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Year Pager */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-1.5 shadow-2xs">
          <button
            type="button"
            disabled={selectedYear <= groupStartYear}
            onClick={() => {
              haptic.selection()
              setSelectedYear((y) => y - 1)
            }}
            className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-700 active:scale-95 transition-all cursor-pointer"
            title="Tahun Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span className="font-extrabold text-sm text-[#0F172A]">
              Tahun {selectedYear}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              haptic.selection()
              setSelectedYear((y) => y + 1)
            }}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 active:scale-95 transition-all cursor-pointer"
            title="Tahun Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Action Bar: View Switcher, WhatsApp & Print */}
        <div className="flex items-center gap-2">
          {/* Card / List View Switcher Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                haptic.selection()
                setViewMode("card")
              }}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "card"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Tampilan Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                haptic.selection()
                setViewMode("list")
              }}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Tampilan Tabel / List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex-1 sm:flex-initial py-2.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer min-h-[42px]"
          >
            {copiedWA ? (
              <>
                <Check className="w-4 h-4" />
                <span>Membuka WA...</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Bagikan WA</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              haptic.light()
              window.print()
            }}
            className="py-2.5 px-3.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer min-h-[42px]"
            title="Cetak atau Simpan PDF"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
        </div>
      </div>

      {/* ─── MONTHS CONTAINER (CARD OR LIST) ─── */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-xs text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span>
              Periode Iuran ({monthsData.length} Bulan di {selectedYear})
            </span>
          </h3>
          <span className="text-[11px] text-slate-400 font-semibold">
            {lunasCount} Lunas · {pendingCount} Menunggu
          </span>
        </div>

        {monthsData.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2 shadow-2xs">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-700">
              Belum Ada Periode Iuran di Tahun {selectedYear}
            </p>
            <p className="text-[11px] text-slate-400">
              Grup ini mulai iuran pada periode {groupStartMonthStr}.
            </p>
          </div>
        ) : viewMode === "card" ? (
          /* ─── CARD GRID VIEW ─── */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {monthsData.map((item) => (
              <MonthCard
                key={item.monthName}
                item={item}
                onPayMonth={onPayMonth}
                onSelectTransaction={onSelectTransaction}
                showPayButton={showPayButton}
              />
            ))}
          </div>
        ) : (
          /* ─── TABLE / LIST VIEW ─── */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="px-4 py-3 text-center w-12">#</th>
                    <th className="px-4 py-3">Bulan Iuran</th>
                    <th className="px-4 py-3 text-right">Nominal</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Tgl Bayar</th>
                    <th className="px-4 py-3 text-center">Aksi / Bukti</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthsData.map((item) => {
                    const isLunas = item.status === "lunas"
                    const isMenunggu = item.status === "menunggu"
                    const isBelumGabung = item.status === "belum_gabung"
                    const isBelumBayar = item.status === "belum_bayar"

                    return (
                      <tr
                        key={item.monthName}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-4 py-3 text-center font-mono font-bold text-slate-400">
                          {String(item.orderNumber).padStart(2, "0")}
                        </td>
                        <td className="px-4 py-3 font-bold text-[#0F172A]">
                          {item.shortName} {item.year}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-700">
                          {item.nominal > 0
                            ? `Rp${item.nominal.toLocaleString("id-ID")}`
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isLunas ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-2xs">
                              ★ LUNAS
                            </span>
                          ) : isMenunggu ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-800 border border-amber-300/80 shadow-2xs">
                              <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                              Verifikasi
                            </span>
                          ) : isBelumGabung ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-slate-100 text-slate-500">
                              Sebelum Gabung
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              Belum Iuran
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-500 font-mono text-[11px]">
                          {item.tanggal || "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isLunas && item.tx && onSelectTransaction ? (
                            <button
                              type="button"
                              onClick={() => onSelectTransaction(item.tx!)}
                              className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-[11px] cursor-pointer transition-colors"
                            >
                              Lihat Bukti
                            </button>
                          ) : isMenunggu && item.tx && onSelectTransaction ? (
                            <button
                              type="button"
                              onClick={() => onSelectTransaction(item.tx!)}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] cursor-pointer transition-colors"
                            >
                              Cek Antrean
                            </button>
                          ) : isBelumBayar && showPayButton ? (
                            <button
                              type="button"
                              onClick={() => onPayMonth(item.monthName)}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 transition-all"
                            >
                              <PlusCircle className="w-3 h-3" />
                              <span>Setor</span>
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px]">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Individual Month Card with Stamp Effect & Action
 */
function MonthCard({
  item,
  onPayMonth,
  onSelectTransaction,
  showPayButton = true,
}: {
  item: MonthCardData
  onPayMonth: (m: string) => void
  onSelectTransaction?: (tx: TransactionItem) => void
  showPayButton?: boolean
}) {
  const isLunas = item.status === "lunas"
  const isMenunggu = item.status === "menunggu"
  const isBelumGabung = item.status === "belum_gabung"
  const isBelumBayar = item.status === "belum_bayar"

  return (
    <div
      className={`rounded-2xl p-3.5 border transition-all relative flex flex-col justify-between min-h-[124px] ${
        isLunas
          ? "bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-emerald-50/80 border-emerald-200/90 shadow-2xs"
          : isMenunggu
            ? "bg-gradient-to-br from-amber-50/90 via-yellow-50/40 to-amber-50/80 border-amber-200/90 shadow-2xs"
            : isBelumGabung
              ? "bg-slate-50/60 border-slate-200/60 opacity-60"
              : "bg-white border-slate-200 hover:border-blue-300 shadow-2xs"
      }`}
    >
      {/* Month Label & Order Badge */}
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-mono font-bold text-slate-400">
          #{String(item.orderNumber).padStart(2, "0")}
        </span>
        <span className="text-xs font-black text-[#0F172A] truncate">
          {item.shortName}
        </span>
      </div>

      {/* Middle Body: Stamp / Status badge */}
      <div className="py-2 text-center">
        {isLunas ? (
          <div className="inline-flex flex-col items-center">
            {/* Authentic Rubber Stamp Effect */}
            <div className="px-2.5 py-0.5 rounded-lg border-2 border-emerald-600 text-emerald-700 font-black text-[11px] tracking-wider uppercase bg-emerald-100/50 rotate-[-2deg] shadow-2xs">
              ★ LUNAS ★
            </div>
            <p className="text-[10.5px] font-bold text-emerald-900 font-mono mt-1.5">
              Rp{item.nominal.toLocaleString("id-ID")}
            </p>
          </div>
        ) : isMenunggu ? (
          <div className="inline-flex flex-col items-center">
            <div className="px-2 py-0.5 rounded-lg border border-amber-500 text-amber-800 font-bold text-[10px] tracking-wide uppercase bg-amber-100/70 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
              <span>Verifikasi</span>
            </div>
            <p className="text-[10px] font-bold text-amber-800 font-mono mt-1.5">
              Rp{item.nominal.toLocaleString("id-ID")}
            </p>
          </div>
        ) : isBelumGabung ? (
          <div className="inline-flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-semibold italic">
              Sebelum Gabung
            </span>
          </div>
        ) : (
          <div className="inline-flex flex-col items-center">
            <span className="text-[10.5px] font-extrabold text-slate-400 tracking-wide uppercase">
              Belum Iuran
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">
              Rp{item.nominal.toLocaleString("id-ID")}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Footer Action / Date */}
      <div className="pt-1.5 border-t border-slate-200/50 flex items-center justify-between text-[10px]">
        {isLunas ? (
          <>
            <span className="text-slate-500 truncate">{item.tanggal || "Lunas"}</span>
            {item.tx && onSelectTransaction && (
              <button
                type="button"
                onClick={() => {
                  haptic.light()
                  onSelectTransaction(item.tx!)
                }}
                className="text-teal-700 font-bold hover:underline cursor-pointer ml-1 flex-shrink-0"
              >
                Bukti &rarr;
              </button>
            )}
          </>
        ) : isMenunggu ? (
          <>
            <span className="text-amber-700 truncate font-medium">Dalam Antrean</span>
            {item.tx && onSelectTransaction && (
              <button
                type="button"
                onClick={() => {
                  haptic.light()
                  onSelectTransaction(item.tx!)
                }}
                className="text-amber-800 font-bold hover:underline cursor-pointer ml-1 flex-shrink-0"
              >
                Lihat &rarr;
              </button>
            )}
          </>
        ) : isBelumBayar ? (
          showPayButton ? (
            <button
              type="button"
              onClick={() => {
                haptic.selection()
                onPayMonth(item.monthName)
              }}
              className="w-full py-1 px-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[10.5px] flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Setor Iuran</span>
            </button>
          ) : (
            <span className="text-rose-600 font-bold text-center w-full text-[10px]">
              Belum Bayar
            </span>
          )
        ) : (
          <span className="text-slate-400 text-center w-full italic text-[9.5px]">
            Sebelum Gabung
          </span>
        )}
      </div>
    </div>
  )
}
