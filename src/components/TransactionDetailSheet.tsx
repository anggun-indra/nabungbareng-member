import { useState } from "react"
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  FileText,
  ShieldCheck,
  MessageCircle,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react"
import BottomSheet from "./BottomSheet"
import { haptic } from "../utils/haptics"
import type { TransactionItem } from "../types"

interface TransactionDetailSheetProps {
  transaction: TransactionItem | null
  isOpen: boolean
  onClose: () => void
}

export default function TransactionDetailSheet({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailSheetProps) {
  const [copied, setCopied] = useState(false)

  if (!transaction) return null

  const isDeposit = transaction.jenis === "Setoran"
  const isPending =
    transaction.jenis === "Menunggu" || transaction.status === "Menunggu"
  const isExpense = transaction.jenis === "Pengeluaran"

  const handleCopyId = () => {
    haptic.light()
    navigator.clipboard.writeText(transaction.submissionId || transaction.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Transaksi"
      subtitle={transaction.submissionId || `TRX-${transaction.id}`}
      maxHeight="max-h-[88vh]"
    >
      <div className="space-y-4 pb-4">
        {/* Status Card Banner */}
        {isPending && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-amber-900 font-bold text-sm">
                Menunggu Verifikasi
              </p>
              <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">
                Bukti transfer Anda sedang dalam antrean verifikasi oleh
                bendahara kelas. Saldo akan bertambah setelah disetujui.
              </p>
            </div>
          </div>
        )}

        {isDeposit && !isPending && (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 text-teal-700 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-teal-900 font-bold text-sm">
                Setoran Terverifikasi
              </p>
              <p className="text-teal-700 text-xs mt-0.5 leading-relaxed">
                Setoran ini telah disetujui dan telah masuk ke saldo tabungan
                Anda serta kas kelas.
              </p>
            </div>
          </div>
        )}

        {isExpense && (
          <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-700 shadow-sm">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-900 font-bold text-sm">
                Pengeluaran Kas Kelas
              </p>
              <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                Potongan pengeluaran rata kas kelas untuk keperluan kegiatan
                belajar mengajar siswa.
              </p>
            </div>
          </div>
        )}

        {/* Nominal Hero Card */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl p-4 border border-slate-200 text-center">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            {isExpense ? "Nominal Potongan" : "Nominal Setoran"}
          </p>
          <p
            className={`text-3xl font-extrabold mt-1 tracking-tight ${
              isExpense
                ? "text-slate-800"
                : isPending
                  ? "text-amber-700"
                  : "text-teal-700"
            }`}
          >
            {isExpense ? "-" : "+"}Rp
            {Math.abs(transaction.nominal).toLocaleString("id-ID")}
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            {isExpense ? (
              <ArrowDownLeft className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ArrowUpRight className="w-3.5 h-3.5 text-teal-600" />
            )}
            <span>{transaction.label}</span>
          </div>
        </div>

        {/* Key Info List */}
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 text-xs">
            <span className="text-slate-500">ID Transaksi</span>
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1.5 font-mono font-bold text-blue-600 hover:text-blue-700 active:scale-95 transition-transform"
            >
              <span>{transaction.submissionId || `TRX-${transaction.id}`}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-teal-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between px-4 py-3 text-xs">
            <span className="text-slate-500">Tanggal</span>
            <span className="font-semibold text-slate-800">
              {transaction.tanggal}
            </span>
          </div>

          <div className="flex items-center justify-between px-4 py-3 text-xs">
            <span className="text-slate-500">Status</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full ${
                isPending
                  ? "bg-amber-50 text-amber-700"
                  : isDeposit
                    ? "bg-teal-50 text-teal-700"
                    : "bg-slate-100 text-slate-700"
              }`}
            >
              {transaction.status}
            </span>
          </div>

          {transaction.catatan && (
            <div className="px-4 py-3 text-xs">
              <span className="text-slate-500 block mb-1">Catatan</span>
              <p className="text-slate-800 font-medium">
                {transaction.catatan}
              </p>
            </div>
          )}
        </div>

        {/* Receipt Attachment Card */}
        {transaction.receiptUrl ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-slate-800 font-bold text-xs uppercase tracking-wider">
                Lampiran Bukti Transfer
              </p>
              {transaction.fileSize && (
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  {transaction.fileSize}
                </span>
              )}
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-56 flex items-center justify-center">
              <img
                src={transaction.receiptUrl}
                alt="Struk Transfer"
                className="w-full h-full object-contain"
              />
            </div>
            {transaction.sha256 && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono bg-slate-50 p-2 rounded-xl border border-slate-100 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="truncate">SHA256: {transaction.sha256}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 flex items-center gap-3 text-xs text-slate-600">
            <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-slate-800">
                Bukti Transfer Tersimpan
              </p>
              <p className="text-slate-500 text-[11px]">
                Tersimpan aman di Supabase Storage Private
              </p>
            </div>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
        )}

        {/* Help Action */}
        <button
          onClick={() => {
            haptic.light()
            alert(
              "Untuk konfirmasi kendala setoran, silakan hubungi bendahara kelas melalui WhatsApp/grup wali murid.",
            )
          }}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-98 transition-all min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4 text-blue-600" />
          <span>Ada kendala? Hubungi Bendahara</span>
        </button>
      </div>
    </BottomSheet>
  )
}
