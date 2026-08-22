import React, { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, AlertCircle } from "lucide-react"
import NabungBarengLogo from "./NabungBarengLogo"
import ErrorAlert from "./ErrorAlert"
import { haptic } from "../utils/haptics"
import { loginWithGoogle } from "../lib/firebase"
import { syncUserProfile } from "../services/api"
import type { AuthUser } from "../types"

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    haptic.light()

    try {
      // 1. Authenticate via Firebase Google Auth
      const firebaseUser = await loginWithGoogle()
      const displayName =
        firebaseUser.displayName ||
        firebaseUser.email?.split("@")[0] ||
        "Pengguna"
      const email = firebaseUser.email || ""
      const avatar =
        displayName
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase() || "NB"

      // 2. Sync user profile to Supabase Database
      await syncUserProfile({
        uid: firebaseUser.uid,
        displayName,
        email,
        photoURL: firebaseUser.photoURL,
      })

      haptic.success()
      onLoginSuccess({
        name: displayName,
        email,
        avatar,
        photoURL: firebaseUser.photoURL,
        uid: firebaseUser.uid,
      })
    } catch (err: unknown) {
      console.error("Firebase Google Login Error:", err)
      haptic.error()

      const errorObj = err as { code?: string; message?: string }
      if (errorObj?.code === "auth/popup-closed-by-user") {
        setErrorMessage("Jendela login ditutup sebelum selesai.")
      } else if (errorObj?.code === "auth/unauthorized-domain") {
        setErrorMessage(
          "Domain ini belum diizinkan di Firebase Console > Authentication > Authorized domains.",
        )
      } else {
        setErrorMessage(
          errorObj?.message ||
            "Gagal masuk dengan akun Google. Silakan coba lagi.",
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    haptic.medium()
    onLoginSuccess({
      name: "Bunda Ibou (Demo)",
      email: "bunda.ibou@email.com",
      avatar: "IA",
      uid: "demo-user-ibou",
    })
  }

  return (
    <div className="h-full w-full bg-[#0F172A] flex flex-col items-center justify-between p-6 text-white relative overflow-hidden select-none">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top spacer for optical balance */}
      <div className="w-full pt-4" />

      {/* Center Content: Brand & Google Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xs flex flex-col items-center text-center z-10 space-y-6"
      >
        {/* App Logo */}
        <div className="flex flex-col items-center">
          <div className="mb-4 relative flex items-center justify-center">
            <NabungBarengLogo
              size={98}
              primaryColor="#2B7FFF"
              className="drop-shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            NabungBareng
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">
            Tabungan Bersama Komunitas
          </p>
        </div>

        {/* Error Alert with Copy Button */}
        {errorMessage && (
          <ErrorAlert
            message={errorMessage}
            title="Gagal Masuk"
            variant="dark"
          />
        )}

        {/* Center Google Sign-in Button */}
        <div className="w-full space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-black/30 flex items-center justify-center gap-3 transition-all active:scale-[0.97] disabled:opacity-75 min-h-[50px] cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-xs font-bold text-slate-700">
                  Membuka Akun Google...
                </span>
              </>
            ) : (
              <>
                {/* Google G Logo */}
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  Masuk dengan Google
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors py-1 cursor-pointer"
          >
            Atau coba mode pratinjau demo &rarr;
          </button>
        </div>
      </motion.div>

      {/* Minimal Footer */}
      <div className="w-full pb-4 text-center z-10">
        <p className="text-[11px] text-slate-500 font-medium">
          Firebase Google Auth &middot; Supabase PostgreSQL
        </p>
      </div>
    </div>
  )
}
