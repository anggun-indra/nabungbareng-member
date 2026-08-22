import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  KeyRound,
  Loader2,
  AlertCircle,
  CheckCircle2,
  School,
} from "lucide-react"
import BottomSheet from "./BottomSheet"
import ErrorAlert from "./ErrorAlert"
import { acceptGroupInvitation } from "../services/api"
import { haptic } from "../utils/haptics"

interface JoinGroupSheetProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (joinedGroup: {
    groupId: string
    groupName: string
    schoolName?: string
    studentName?: string
    monthlyTarget: number
  }) => void
}

export default function JoinGroupSheet({
  isOpen,
  onClose,
  onSuccess,
}: JoinGroupSheetProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successInfo, setSuccessInfo] = useState<{
    groupName: string
    schoolName?: string
  } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6)
    setCode(val)
    if (errorMessage) setErrorMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) {
      setErrorMessage("Masukkan 6 digit kode undangan lengkap.")
      haptic.error()
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    haptic.medium()

    try {
      const res = await acceptGroupInvitation(code)
      haptic.success()
      setSuccessInfo({
        groupName: res.groupName,
        schoolName: res.schoolName,
      })

      setTimeout(() => {
        onSuccess({
          groupId: res.groupId,
          groupName: res.groupName,
          schoolName: res.schoolName,
          studentName: res.studentName,
          monthlyTarget: res.monthlyTarget,
        })
        handleClose()
      }, 1200)
    } catch (err: unknown) {
      const msg = (err as Error)?.message || "Gagal menggunakan kode undangan."
      setErrorMessage(msg)
      haptic.error()
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setCode("")
    setErrorMessage(null)
    setSuccessInfo(null)
    onClose()
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="Gabung Grup Kelas"
      subtitle="Gunakan 6 digit kode undangan"
    >
      <div className="space-y-4 pt-1 pb-4">
        {successInfo ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm">
              Berhasil Bergabung!
            </h3>
            <p className="text-xs text-emerald-800 font-bold">
              {successInfo.groupName}
            </p>
            {successInfo.schoolName && (
              <p className="text-[11px] text-slate-500 font-medium">
                {successInfo.schoolName}
              </p>
            )}
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">
                  Undangan Khusus Berbasis Email
                </p>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Kode 6 digit diterbitkan khusus untuk email akun Anda demi
                  keamanan data kas kelas.
                </p>
              </div>
            </div>

            {/* Error Message with Copy Button */}
            {errorMessage && (
              <ErrorAlert
                message={errorMessage}
                title="Gagal Menggunakan Kode"
              />
            )}

            {/* 6 Digit Code Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Kode Undangan 6 Digit
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={handleInputChange}
                  placeholder="CONTOH: RU8392"
                  maxLength={6}
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck="false"
                  disabled={isLoading}
                  className="w-full text-center tracking-[0.4em] font-mono text-xl font-black py-3.5 px-4 bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-xs placeholder:text-slate-400 placeholder:font-medium disabled:opacity-50 uppercase"
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center font-medium">
                {code.length}/6 Karakter
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 py-3.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs min-h-[48px] hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="flex-1 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs min-h-[48px] shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <span>Gabung Grup</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </BottomSheet>
  )
}
