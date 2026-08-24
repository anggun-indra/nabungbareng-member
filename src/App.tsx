import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Activity,
  Plus,
  BarChart3,
  User,
  Shield,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  WifiOff,
  School,
  Sparkles,
  KeyRound,
  Inbox,
  Globe,
  Copy,
  Check,
  Calendar,
  Share2,
  ExternalLink,
  Layers,
  RefreshCw,
  Zap,
  Info,
  Download,
  HelpCircle,
  CreditCard,
} from "lucide-react"

import PwaInstallPrompt, { triggerGlobalInstall } from "./PwaInstallPrompt"
import PwaUpdateBanner from "./components/PwaUpdateBanner"
import BottomSheet from "./components/BottomSheet"
import KirimBuktiSheet from "./components/KirimBuktiSheet"
import TransactionDetailSheet from "./components/TransactionDetailSheet"
import GroupSwitcherSheet from "./components/GroupSwitcherSheet"
import JoinGroupSheet from "./components/JoinGroupSheet"
import KartuIuranView from "./components/KartuIuranView"
import PullToRefresh from "./components/PullToRefresh"
import AnimatedCounter from "./components/AnimatedCounter"
import LoginScreen from "./components/LoginScreen"
import UserAvatar from "./components/UserAvatar"
import HomeSkeleton from "./components/HomeSkeleton"
import MemberCoachmark, {
  MEMBER_COACHMARK_STORAGE_KEY,
} from "./components/MemberCoachmark"
import { haptic } from "./utils/haptics"
import { formatBytes } from "./utils/imageCompressor"
import { logoutUser, auth, onAuthStateChanged } from "./lib/firebase"
import {
  fetchUserGroups,
  fetchGroupTransactions,
  syncUserProfile,
} from "./services/api"
import { APP_VERSION, BUILD_NUMBER, BUILD_TIMESTAMP } from "./version"
import {
  checkForPwaUpdate,
  forcePwaUpdate,
  type UpdateCheckResult,
} from "./utils/pwaUpdater"
import type {
  TabType,
  FilterType,
  TransactionItem,
  Submission,
  GroupInfo,
  AuthUser,
} from "./types"

function getTimeGreeting(): string {
  const hours = new Date().getHours()
  if (hours >= 4 && hours < 11) {
    return "Selamat pagi"
  } else if (hours >= 11 && hours < 15) {
    return "Selamat siang"
  } else if (hours >= 15 && hours < 18) {
    return "Selamat sore"
  } else if (hours >= 18 && hours < 19) {
    return "Selamat petang"
  } else {
    return "Selamat malam"
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem("nabungbareng_auth_user")
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [groups, setGroups] = useState<GroupInfo[]>([])
  const [activeTab, setActiveTab] = useState<TabType>("beranda")
  const [activeGroupId, setActiveGroupId] = useState<string>("")
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false)

  // Sub-tab for Tab Laporan: "kartu" (Kartu Iuran) vs "kas" (Transparansi Kas Kelas)
  const [laporanSubTab, setLaporanSubTab] = useState<"kartu" | "kas">("kartu")
  const [kirimPreselectedMonth, setKirimPreselectedMonth] = useState<string | null>(null)

  // Sheets state
  const [isKirimOpen, setIsKirimOpen] = useState(false)
  const [isGroupSwitcherOpen, setIsGroupSwitcherOpen] = useState(false)
  const [isJoinGroupOpen, setIsJoinGroupOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showForceUpdateModal, setShowForceUpdateModal] = useState(false)
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false)
  const [showCoachmark, setShowCoachmark] = useState(false)
  const [updateStatusMessage, setUpdateStatusMessage] = useState<{
    type: "success" | "info" | "error"
    text: string
  } | null>(null)

  // Auto-launch Coachmark for member on first login in this browser
  useEffect(() => {
    if (currentUser && !isInitialLoading) {
      try {
        const completed = localStorage.getItem(MEMBER_COACHMARK_STORAGE_KEY)
        if (!completed) {
          const timer = setTimeout(() => {
            setShowCoachmark(true)
          }, 800)
          return () => clearTimeout(timer)
        }
      } catch (e) {
        console.warn("Storage check notice:", e)
      }
    }
  }, [currentUser?.id, isInitialLoading])

  // Filter state for Aktivitas tab
  const [filter, setFilter] = useState<FilterType>("Semua")
  const [selectedMonthFilter, setSelectedMonthFilter] =
    useState<string>("Semua Bulan")
  const [activityDisplayLimit, setActivityDisplayLimit] = useState<number>(10)
  const [expenseDisplayLimit, setExpenseDisplayLimit] = useState<number>(5)
  const [reportLinkCopied, setReportLinkCopied] = useState(false)

  // Reset pagination limit when filter or active group changes
  useEffect(() => {
    setActivityDisplayLimit(10)
  }, [filter, selectedMonthFilter, activeGroupId])

  // Offline indicator state
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  // Independent scroll containers per tab
  const berandaScrollRef = useRef<HTMLDivElement>(null)
  const aktivitasScrollRef = useRef<HTMLDivElement>(null)
  const laporanScrollRef = useRef<HTMLDivElement>(null)
  const akunScrollRef = useRef<HTMLDivElement>(null)

  // Scroll offset tracking for smooth sticky top navbar transition on Beranda
  const [berandaScrollTop, setBerandaScrollTop] = useState(0)

  const activeGroup =
    groups.find((g) => g.id === activeGroupId) ||
    (groups.length > 0 ? groups[0] : null)

  // Handle clean group switch with immediate cache purge & smooth reset
  const handleSelectGroup = (gId: string) => {
    if (gId !== activeGroupId) {
      haptic.selection()
      setTransactions([])
      setIsTransactionsLoading(true)
      setActiveGroupId(gId)
      setSelectedMonthFilter("Semua Bulan")
      setFilter("Semua")
      berandaScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
      aktivitasScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
      laporanScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }
    setIsGroupSwitcherOpen(false)
  }

  // Load groups & transactions from Supabase
  const loadRemoteData = async (preferredGroupId?: string, targetUserId?: string) => {
    try {
      if (typeof auth.authStateReady === "function") {
        await auth.authStateReady()
      }
      const uId = targetUserId || auth.currentUser?.uid || currentUser?.id
      const remoteGroups = await fetchUserGroups(uId)
      setGroups(remoteGroups)

      if (remoteGroups.length > 0) {
        const targetId = preferredGroupId || activeGroupId
        const nextActiveId =
          targetId && remoteGroups.some((g) => g.id === targetId)
            ? targetId
            : remoteGroups[0].id

        setActiveGroupId(nextActiveId)

        const remoteTxs = await fetchGroupTransactions(nextActiveId)
        setTransactions(remoteTxs)
      } else {
        setActiveGroupId("")
        setTransactions([])
      }
    } catch (err) {
      console.warn("Load remote data notice:", err)
    } finally {
      setIsInitialLoading(false)
    }
  }

  // Firebase Auth State Listener to ensure session persistence on refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const initials = (fbUser.displayName || fbUser.email || "U")
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()

        const userObj: AuthUser = {
          id: fbUser.uid,
          name: fbUser.displayName || "Wali Murid",
          email: fbUser.email || "",
          role: "member",
          avatar: initials,
          photoURL: fbUser.photoURL || undefined,
        }
        setCurrentUser(userObj)
        localStorage.setItem("nabungbareng_auth_user", JSON.stringify(userObj))
        syncUserProfile(fbUser).catch(() => {})
        await loadRemoteData(undefined, fbUser.uid)
      } else {
        const saved = localStorage.getItem("nabungbareng_auth_user")
        if (!saved) {
          setCurrentUser(null)
          setGroups([])
          setTransactions([])
        }
        setIsInitialLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (currentUser?.id) {
      loadRemoteData(undefined, currentUser.id)
    }
  }, [currentUser?.id])

  useEffect(() => {
    if (currentUser && activeGroupId) {
      setIsTransactionsLoading(true)
      fetchGroupTransactions(activeGroupId)
        .then((txs) => {
          setTransactions(txs)
        })
        .finally(() => {
          setIsTransactionsLoading(false)
        })
    }
  }, [activeGroupId])

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Listen to scroll events on Beranda container for smooth top navbar transformation
  useEffect(() => {
    const el = berandaScrollRef.current
    if (!el) return
    const onScroll = () => {
      setBerandaScrollTop(el.scrollTop)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  // Handle Tab Switch & Smooth Scroll to Top on Re-tap
  const handleTabClick = (tab: TabType) => {
    if (activeTab === tab) {
      const refMap: Record<TabType, React.RefObject<HTMLDivElement | null>> = {
        beranda: berandaScrollRef,
        aktivitas: aktivitasScrollRef,
        laporan: laporanScrollRef,
        akun: akunScrollRef,
      }
      refMap[tab].current?.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      setActiveTab(tab)
    }
  }

  // Quick refresh action
  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await loadRemoteData()
    await new Promise((r) => setTimeout(r, 400))
    setIsRefreshing(false)
  }

  // Manual check for PWA updates
  const handleManualCheckUpdate = async () => {
    setIsCheckingUpdate(true)
    setUpdateStatusMessage(null)
    haptic.selection()

    try {
      const res = await checkForPwaUpdate()
      if (res.hasUpdate) {
        haptic.success()
        setUpdateStatusMessage({
          type: "info",
          text: `Versi baru ${res.serverVersion || ""} tersedia! Ketuk Update pada banner.`,
        })
      } else {
        haptic.light()
        setUpdateStatusMessage({
          type: "success",
          text: `Aplikasi sudah dalam versi terbaru (v${APP_VERSION} · Build ${BUILD_NUMBER}).`,
        })
      }
    } catch (err: any) {
      haptic.error()
      setUpdateStatusMessage({
        type: "error",
        text: "Gagal memeriksa pembaruan. Periksa koneksi internet.",
      })
    } finally {
      setIsCheckingUpdate(false)
      setTimeout(() => {
        setUpdateStatusMessage(null)
      }, 6000)
    }
  }

  // Handle force update execution
  const handleExecuteForceUpdate = async () => {
    haptic.success()
    setShowForceUpdateModal(false)
    await forcePwaUpdate()
  }

  // Handle successful submission from KirimBuktiSheet
  const handleSubmissionSuccess = (sub: Submission) => {
    const newTx: TransactionItem = {
      id: sub.id,
      jenis: "Menunggu",
      label: `Iuran ${sub.periode}`,
      tanggal: sub.tanggal,
      nominal: sub.nominal,
      status: "Menunggu",
      submissionId: sub.id,
      catatan: sub.catatan,
      receiptUrl: sub.fileUrl,
      sha256: sub.sha256,
      fileSize: sub.compressedSize
        ? formatBytes(sub.compressedSize)
        : undefined,
    }

    setTransactions((prev) => [newTx, ...prev.filter((t) => t.id !== sub.id)])
    setHighlightedId(sub.id)
    setActiveTab("aktivitas")

    // Reload live transactions and balances from Supabase
    loadRemoteData().catch(() => {})

    setTimeout(() => {
      aktivitasScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  const handleOpenDetail = (tx: TransactionItem) => {
    setSelectedTransaction(tx)
    setIsDetailOpen(true)
  }

  // Handle successful group join via 6-digit code
  const handleJoinGroupSuccess = async (joined: {
    groupId: string
    groupName: string
    schoolName?: string
    studentName?: string
    monthlyTarget: number
  }) => {
    setActiveGroupId(joined.groupId)
    await loadRemoteData(joined.groupId)
    setActiveTab("beranda")
  }

  // Dynamic available months extracted from current group transactions
  const availableMonths = React.useMemo(() => {
    const monthsSet = new Set<string>()
    transactions.forEach((t) => {
      if (t.periode && t.periode.trim()) {
        monthsSet.add(t.periode.trim())
      }
    })
    return ["Semua Bulan", ...Array.from(monthsSet)]
  }, [transactions])

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((t) => {
      const matchesType =
        filter === "Semua" ||
        (filter === "Setoran" && t.jenis === "Setoran") ||
        (filter === "Pengeluaran" && t.jenis === "Pengeluaran") ||
        (filter === "Menunggu" &&
          (t.jenis === "Menunggu" || t.status === "Menunggu"))

      const matchesMonth =
        selectedMonthFilter === "Semua Bulan" ||
        (t.periode &&
          t.periode.toLowerCase() === selectedMonthFilter.toLowerCase()) ||
        t.tanggal.toLowerCase().includes(selectedMonthFilter.toLowerCase())

      return matchesType && matchesMonth
    })
  }, [transactions, filter, selectedMonthFilter])

  // Calculate dynamic report stats from transactions & group
  const totalExpenses = transactions
    .filter((t) => t.jenis === "Pengeluaran")
    .reduce((sum, t) => sum + Math.abs(t.nominal), 0)

  const totalVerifiedDeposits = transactions
    .filter((t) => t.status === "Disetujui" && t.nominal > 0)
    .reduce((sum, t) => sum + t.nominal, 0)

  const expenseItems = transactions.filter((t) => t.jenis === "Pengeluaran")

  if (!currentUser) {
    return (
      <div className="h-screen h-[100dvh] w-full bg-[#0F172A] flex justify-center selection:bg-blue-500 selection:text-white overflow-hidden">
        <div className="w-full max-w-md h-full bg-[#0F172A] flex flex-col relative overflow-hidden shadow-2xl">
          <LoginScreen
            onLoginSuccess={(user) => {
              setCurrentUser(user)
              localStorage.setItem(
                "nabungbareng_auth_user",
                JSON.stringify(user),
              )
            }}
          />
          <PwaInstallPrompt />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen h-[100dvh] w-full bg-[#0F172A] flex justify-center selection:bg-blue-500 selection:text-white overflow-hidden">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md h-full bg-[#F8FAFC] flex flex-col relative overflow-hidden shadow-2xl">
        {/* Offline Banner */}
        <AnimatePresence>
          {isOffline && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-amber-600 text-white px-3 py-1.5 text-xs flex items-center justify-between font-medium flex-shrink-0 z-50 shadow-sm"
            >
              <div className="flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Mode Offline · Data tersimpan lokal</span>
              </div>
              <button
                onClick={() => setIsOffline(!navigator.onLine)}
                className="underline text-[11px] font-bold"
              >
                Cek
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── TAB 1: BERANDA ────────────────────────────────────────────── */}
        <div
          ref={berandaScrollRef}
          onScroll={(e) => setBerandaScrollTop(e.currentTarget.scrollTop)}
          style={{ display: activeTab === "beranda" ? "block" : "none" }}
          className="tab-scroll-container flex-1 pb-28 relative"
        >
          {/* STICKY TOP NAV BAR (Smooth transformation: Greeting -> Compact Group Selector) */}
          <header
            className={`sticky top-0 z-30 px-4 pt-5 pb-2.5 sticky-top-header w-full flex items-center justify-between transition-all duration-300 ${
              berandaScrollTop > 30
                ? "bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
                : "bg-[#F8FAFC]"
            }`}
          >
            {berandaScrollTop <= 30 ? (
              /* INITIAL / EXPANDED GREETING ROW (When at top of screen) */
              <div className="flex items-center justify-between w-full transition-all duration-200">
                <div>
                  <p className="text-slate-500 text-xs font-medium leading-normal mb-0.5">
                    {getTimeGreeting()},
                  </p>
                  <h1 className="text-[#0F172A] text-lg sm:text-xl font-extrabold tracking-tight leading-tight">
                    Halo, {currentUser.name} 👋
                  </h1>
                </div>
                <button
                  onClick={() => handleTabClick("akun")}
                  className="active:scale-95 transition-transform cursor-pointer rounded-xl ring-2 ring-blue-500/20 shadow-2xs"
                  title="Buka Akun Saya"
                >
                  <UserAvatar
                    src={currentUser.photoURL}
                    name={currentUser.name}
                    initials={currentUser.avatar}
                    size="sm"
                  />
                </button>
              </div>
            ) : (
              /* SCROLLED COMPACT TOP NAV BAR (Appears smoothly when scrolled past 30px) */
              <div className="flex items-center justify-between w-full animate-in fade-in duration-200">
                {activeGroup ? (
                  <button
                    onClick={() => setIsGroupSwitcherOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 text-slate-800 shadow-2xs active:scale-95 transition-all text-left max-w-[75%] min-h-[40px] cursor-pointer"
                  >
                    {activeGroup.logoUrl ? (
                      <img
                        src={activeGroup.logoUrl}
                        alt={activeGroup.nama}
                        className="w-6 h-6 rounded-lg object-cover flex-shrink-0 bg-white border border-slate-200"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <School className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none truncate">
                        Group Aktif
                      </p>
                      <p className="text-xs font-bold text-[#0F172A] truncate leading-tight mt-0.5">
                        {activeGroup.nama}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-0.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsJoinGroupOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-blue-200 hover:border-blue-400 text-blue-700 shadow-2xs active:scale-95 transition-all text-left max-w-[75%] min-h-[40px] cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <School className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                        Grup Tabungan
                      </p>
                      <p className="text-xs font-bold text-blue-600 leading-tight mt-0.5">
                        + Pilih / Gabung
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-0.5" />
                  </button>
                )}

                <button
                  onClick={() => handleTabClick("akun")}
                  className="active:scale-95 transition-transform cursor-pointer rounded-lg ring-1 ring-blue-500/20"
                  title="Buka Akun Saya"
                >
                  <UserAvatar
                    src={currentUser.photoURL}
                    name={currentUser.name}
                    initials={currentUser.avatar}
                    size="xs"
                  />
                </button>
              </div>
            )}
          </header>

          {/* Home Content Body with Pull to Refresh */}
          <PullToRefresh
            onRefresh={handleManualRefresh}
            scrollRef={berandaScrollRef}
          >
            <div className="px-4 pt-1 pb-2 space-y-2.5">
              {isInitialLoading ? (
                <HomeSkeleton />
              ) : !activeGroup ? (
                /* ─── EMPTY STATE: BELUM GABUNG KE GRUP ─────────────────────── */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-2"
                >
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 p-0.5 mx-auto shadow-lg shadow-blue-500/20 flex items-center justify-center">
                      <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-blue-600">
                        <KeyRound className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h2 className="text-lg font-extrabold text-[#0F172A]">
                        Belum Ada Grup Tabungan
                      </h2>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                        Akun{" "}
                        <span className="font-bold text-slate-700">
                          {currentUser.email}
                        </span>{" "}
                        belum terdaftar di grup kelas manapun. Masukkan 6 digit
                        kode undangan untuk mulai mencatat tabungan.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsJoinGroupOpen(true)}
                      className="w-full bg-[#2563EB] hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 text-xs transition-all active:scale-[0.98] min-h-[48px] cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>Masukkan Kode Undangan (6 Digit)</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 text-xs text-slate-600">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Undangan terikat langsung dengan email akun Google Anda
                      demi menjaga keamanan dan privasi data tabungan kelas.
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* ─── REAL GROUP ACTIVE STATE ────────────────────────────────── */
                <>
                  {/* EXPANDED GROUP / SEKOLAH SELECTOR CARD (Compact 25% reduction) */}
                  <div
                    className={`transition-all duration-200 ${
                      berandaScrollTop > 30
                        ? "opacity-0 pointer-events-none -mt-4"
                        : "opacity-100 pointer-events-auto mt-0"
                    }`}
                  >
                    <button
                      onClick={() => setIsGroupSwitcherOpen(true)}
                      className="w-full bg-white hover:bg-slate-50 active:scale-[0.98] transition-all border border-slate-200/90 rounded-2xl p-2.5 flex items-center gap-2.5 text-left shadow-2xs cursor-pointer"
                    >
                      {activeGroup.logoUrl ? (
                        <img
                          src={activeGroup.logoUrl}
                          alt={activeGroup.nama}
                          className="w-8 h-8 rounded-xl object-cover border border-slate-200 shadow-2xs flex-shrink-0 bg-white"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <School className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                            Group Aktif
                          </span>
                          <span className="text-[9px] font-medium text-slate-400">
                            {activeGroup.role === "member"
                              ? "Anggota"
                              : activeGroup.role === "treasurer"
                                ? "Bendahara"
                                : "Admin"}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#0F172A] truncate mt-0.5">
                          {activeGroup.nama}
                        </p>
                        <p className="text-slate-400 text-[11px] truncate">
                          {activeGroup.sekolah}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-xl flex-shrink-0">
                        <span>Ganti</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </button>
                  </div>

                  {/* Saldo Hero Card */}
                  <div className="rounded-[22px] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1E3A8A] p-5 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute right-0 top-0 w-36 h-36 rounded-full bg-white/5 -translate-y-12 translate-x-10 blur-xl pointer-events-none" />
                    <div className="absolute left-12 bottom-0 w-24 h-24 rounded-full bg-teal-500/10 translate-y-8 blur-lg pointer-events-none" />

                    <div className="flex items-center justify-between">
                      <p className="text-blue-200 text-xs font-bold tracking-wider uppercase">
                        Tabungan Saya
                      </p>
                      <span className="text-[11px] font-semibold bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10 text-teal-300">
                        {activeGroup.role === "member"
                          ? "Anggota"
                          : "Bendahara"}
                      </span>
                    </div>

                    {/* Animated Count-up Balance */}
                    <div className="mt-2 mb-1">
                      <AnimatedCounter
                        value={activeGroup.saldoSaya}
                        className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                      />
                    </div>

                    <p className="text-slate-300 text-xs mt-0.5">
                      {activeGroup.siswaNama || currentUser.name} ·{" "}
                      {activeGroup.sekolah}
                    </p>

                    <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-slate-300 text-[11px]">
                          Target Iuran Bulanan
                        </p>
                        <p className="text-white font-bold text-xs mt-0.5">
                          Rp{activeGroup.targetBulanan.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-300 text-[11px]">Kas Grup</p>
                        <p className="text-teal-300 text-xs font-bold mt-0.5">
                          Rp{activeGroup.kasTotal.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Shortcut to Kartu Iuran Digital */}
                  <button
                    type="button"
                    onClick={() => {
                      haptic.selection()
                      setLaporanSubTab("kartu")
                      handleTabClick("laporan")
                    }}
                    className="w-full bg-white hover:bg-slate-50 active:scale-[0.98] transition-all border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-2xs cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0F172A]">
                          Kartu Iuran Digital
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Lihat status stempel lunas & matriks 12 bulan
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-teal-700">
                      <span>Buka</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* CTA Primary Action */}
                  <button
                    onClick={() => setIsKirimOpen(true)}
                    className="w-full bg-[#2563EB] hover:bg-blue-600 active:scale-[0.98] text-white py-4 rounded-2xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all min-h-[52px] cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Kirim Bukti Transfer</span>
                  </button>

                  {/* Ringkasan Kas Kelas */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-teal-600" />
                        <h2 className="text-[#0F172A] font-bold text-sm">
                          Transparansi Kas Kelas
                        </h2>
                      </div>
                      <button
                        onClick={() => handleTabClick("laporan")}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center min-h-[36px] cursor-pointer"
                      >
                        Detail <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5 mb-3">
                      <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <p className="text-teal-700 font-bold text-sm truncate">
                          Rp{activeGroup.kasTotal.toLocaleString("id-ID")}
                        </p>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Total Kas
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <p className="text-blue-600 font-bold text-sm truncate">
                          Rp{totalVerifiedDeposits.toLocaleString("id-ID")}
                        </p>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Setoran
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <p className="text-slate-700 font-bold text-sm truncate">
                          Rp{totalExpenses.toLocaleString("id-ID")}
                        </p>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Keluar
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-teal-50/80 rounded-xl px-3 py-2 border border-teal-100">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <p className="text-teal-800 text-xs font-medium">
                        Kas kelas aktif · Database terisolasi
                      </p>
                    </div>
                  </div>

                  {/* Aktivitas Terbaru */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-[#0F172A] font-bold text-sm">
                        Aktivitas Terbaru
                      </h2>
                      <button
                        onClick={() => handleTabClick("aktivitas")}
                        className="text-blue-600 text-xs font-bold min-h-[36px] flex items-center cursor-pointer"
                      >
                        Lihat Semua
                      </button>
                    </div>

                    {transactions.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center text-slate-400 text-xs space-y-1">
                        <Inbox className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="font-semibold text-slate-600">
                          Belum Ada Transaksi
                        </p>
                        <p className="text-[11px]">
                          Kirim bukti setoran pertama Anda di grup ini.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {transactions.slice(0, 3).map((a) => (
                          <div
                            key={a.id}
                            onClick={() => handleOpenDetail(a)}
                            className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer shadow-2xs"
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                                a.jenis === "Setoran"
                                  ? "bg-teal-50 text-teal-600"
                                  : a.jenis === "Menunggu"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {a.jenis === "Setoran" && (
                                <ArrowUpRight className="w-5 h-5" />
                              )}
                              {a.jenis === "Pengeluaran" && (
                                <ArrowDownLeft className="w-5 h-5" />
                              )}
                              {a.jenis === "Menunggu" && (
                                <Clock className="w-5 h-5" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-[#0F172A] font-bold text-sm leading-tight truncate">
                                {a.label}
                              </p>
                              <p className="text-slate-400 text-xs mt-0.5">
                                {a.tanggal}
                              </p>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <p
                                className={`text-sm font-extrabold ${
                                  a.nominal > 0
                                    ? "text-teal-700"
                                    : "text-slate-800"
                                }`}
                              >
                                {a.nominal > 0 ? "+" : "-"}Rp
                                {Math.abs(a.nominal).toLocaleString("id-ID")}
                              </p>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                                  a.status === "Disetujui"
                                    ? "bg-teal-50 text-teal-700"
                                    : a.status === "Menunggu"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {a.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Subtle Beranda Version Tag */}
                  <div className="pt-3 pb-2 text-center">
                    <p className="text-[10px] font-semibold text-slate-400">
                      NabungBareng PWA v{APP_VERSION}
                    </p>
                  </div>
                </>
              )}
            </div>
          </PullToRefresh>
        </div>

        {/* ─── TAB 2: AKTIVITAS ──────────────────────────────────────────── */}
        <div
          ref={aktivitasScrollRef}
          style={{ display: activeTab === "aktivitas" ? "block" : "none" }}
          className="tab-scroll-container flex-1 pb-28 relative"
        >
          {/* STICKY HEADER */}
          <header className="sticky top-0 z-30 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200/80 px-4 pt-5 pb-2.5 sticky-top-header flex items-center justify-between shadow-2xs">
            <div>
              <h1 className="text-[#0F172A] font-extrabold text-base leading-tight">
                Aktivitas Tabungan
              </h1>
              <p className="text-slate-500 text-[11px]">
                {activeGroup ? activeGroup.nama : "Belum Ada Grup"}
              </p>
            </div>
          </header>

          <PullToRefresh
            onRefresh={handleManualRefresh}
            scrollRef={aktivitasScrollRef}
          >
            <div className="px-4 pt-3 pb-2 space-y-3.5">
              {isInitialLoading ? (
                <div className="space-y-3 pt-1 animate-pulse">
                  <div className="h-9 bg-slate-200 rounded-full w-3/4" />
                  <div className="space-y-2.5 pt-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs"
                      />
                    ))}
                  </div>
                </div>
              ) : !activeGroup ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3 mt-4">
                  <Inbox className="w-10 h-10 mx-auto text-slate-300" />
                  <h3 className="font-bold text-sm text-slate-800">
                    Belum Ada Aktivitas
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Bergabunglah ke grup tabungan kelas terlebih dahulu untuk
                    melihat riwayat setoran dan mutasi.
                  </p>
                  <button
                    onClick={() => setIsJoinGroupOpen(true)}
                    className="py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Masukkan Kode Undangan</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Period / Month Filter (if multiple periods exist) */}
                  {availableMonths.length > 1 && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Periode Bulan
                      </p>
                      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        {availableMonths.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              haptic.selection()
                              setSelectedMonthFilter(m)
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 min-h-[32px] flex items-center gap-1.5 cursor-pointer ${
                              selectedMonthFilter === m
                                ? "bg-slate-900 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            <span>{m}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transaction Type Filter Pills */}
                  <div className="space-y-1.5">
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {([
                        "Semua",
                        "Setoran",
                        "Pengeluaran",
                        "Menunggu",
                      ] as FilterType[]).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => {
                            haptic.selection()
                            setFilter(f)
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 min-h-[36px] flex items-center cursor-pointer ${
                            filter === f
                              ? "bg-[#2563EB] text-white shadow-xs"
                              : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter Count & Summary Indicator */}
                  <div className="flex items-center justify-between px-1 text-[11px] text-slate-400 font-medium">
                    <span>
                      {selectedMonthFilter !== "Semua Bulan"
                        ? `${selectedMonthFilter} · `
                        : ""}
                      {filteredTransactions.length} transaksi
                    </span>
                    {(filter !== "Semua" ||
                      selectedMonthFilter !== "Semua Bulan") && (
                      <button
                        onClick={() => {
                          haptic.light()
                          setFilter("Semua")
                          setSelectedMonthFilter("Semua Bulan")
                        }}
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>

                  {/* Transaction List with Loading Skeleton Support */}
                  {isTransactionsLoading ? (
                    <div className="space-y-2.5 pt-1 animate-pulse">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-20 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs"
                        />
                      ))}
                    </div>
                  ) : filteredTransactions.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-xs bg-white rounded-2xl border border-slate-200/70 p-6 space-y-1">
                      <Inbox className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-semibold text-slate-600">
                        Tidak ada transaksi ditemukan
                      </p>
                      <p className="text-[11px]">
                        Coba sesuaikan pilihan filter jenis atau periode bulan.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredTransactions
                        .slice(0, activityDisplayLimit)
                        .map((a) => {
                          const isNew = highlightedId === a.id
                          return (
                            <div
                              key={a.id}
                              onClick={() => handleOpenDetail(a)}
                              className={`rounded-2xl border p-4 transition-all cursor-pointer active:scale-[0.98] ${
                                isNew
                                  ? "border-amber-300 bg-amber-50/70 shadow-md ring-2 ring-amber-400/30"
                                  : "border-slate-200/80 bg-white hover:border-slate-300 shadow-2xs"
                              }`}
                            >
                              <div className="flex items-start gap-3.5">
                                <div
                                  className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-2xs ${
                                    a.jenis === "Setoran"
                                      ? "bg-teal-50 text-teal-600"
                                      : a.jenis === "Menunggu"
                                        ? "bg-amber-50 text-amber-600"
                                        : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {a.jenis === "Setoran" && (
                                    <ArrowUpRight className="w-5 h-5" />
                                  )}
                                  {a.jenis === "Pengeluaran" && (
                                    <ArrowDownLeft className="w-5 h-5" />
                                  )}
                                  {a.jenis === "Menunggu" && (
                                    <Clock className="w-5 h-5" />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="text-[#0F172A] font-bold text-sm leading-tight truncate">
                                        {a.label}
                                      </p>
                                      <p className="text-slate-400 text-xs mt-0.5">
                                        {a.tanggal}
                                      </p>
                                    </div>
                                    <p
                                      className={`text-sm font-extrabold flex-shrink-0 ${
                                        a.nominal > 0
                                          ? "text-teal-700"
                                          : "text-slate-800"
                                      }`}
                                    >
                                      {a.nominal > 0 ? "+" : "-"}Rp
                                      {Math.abs(a.nominal).toLocaleString(
                                        "id-ID",
                                      )}
                                    </p>
                                  </div>

                                  <div className="mt-2 flex items-center justify-between text-xs">
                                    <span
                                      className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                                        a.status === "Disetujui"
                                          ? "bg-teal-50 text-teal-700"
                                          : a.status === "Menunggu"
                                            ? "bg-amber-100 text-amber-800"
                                            : "bg-slate-100 text-slate-600"
                                      }`}
                                    >
                                      {a.status === "Menunggu"
                                        ? "Menunggu Verifikasi"
                                        : a.status}
                                    </span>
                                    <span className="text-slate-400 text-[11px]">
                                      Lihat rincian →
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}

                      {filteredTransactions.length > activityDisplayLimit && (
                        <div className="pt-1.5 pb-1">
                          <button
                            onClick={() => {
                              haptic.selection()
                              setActivityDisplayLimit((prev) => prev + 10)
                            }}
                            className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-[0.98] flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              Muat Lebih Banyak (+10 dari{" "}
                              {filteredTransactions.length - activityDisplayLimit}{" "}
                              tersisa)
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </PullToRefresh>
        </div>

        {/* ─── TAB 3: LAPORAN & KARTU IURAN ────────────────────────────────── */}
        <div
          ref={laporanScrollRef}
          style={{ display: activeTab === "laporan" ? "block" : "none" }}
          className="tab-scroll-container flex-1 pb-28 relative"
        >
          {/* STICKY HEADER */}
          <header className="sticky top-0 z-30 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200/80 px-4 pt-5 pb-2.5 sticky-top-header flex items-center justify-between shadow-2xs">
            <div>
              <h1 className="text-[#0F172A] font-extrabold text-base leading-tight">
                {laporanSubTab === "kartu" ? "Kartu Iuran" : "Transparansi Kas Kelas"}
              </h1>
              <p className="text-slate-500 text-[11px]">
                {activeGroup ? `${activeGroup.nama}${activeGroup.sekolah ? ` · ${activeGroup.sekolah}` : ""}` : "Belum Ada Grup"}
              </p>
            </div>
          </header>

          <div className="px-4 pt-3 pb-2">
            {isInitialLoading ? (
              <div className="space-y-3 pt-1 animate-pulse">
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-24 bg-slate-200 rounded-2xl" />
                  <div className="h-24 bg-slate-200 rounded-2xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 bg-slate-200 rounded-2xl" />
                  <div className="h-16 bg-slate-200 rounded-2xl" />
                </div>
                <div className="h-44 bg-white border border-slate-200/80 rounded-2xl" />
              </div>
            ) : !activeGroup ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3 mt-4">
                <BarChart3 className="w-10 h-10 mx-auto text-slate-300" />
                <h3 className="font-bold text-sm text-slate-800">
                  Belum Ada Laporan
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Laporan dan kartu iuran akan tampil setelah Anda
                  terdaftar di grup tabungan.
                </p>
                <button
                  onClick={() => setIsJoinGroupOpen(true)}
                  className="py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Masukkan Kode Undangan</span>
                </button>
              </div>
            ) : (
              <>
                {/* Segmented Sub-Tab Switcher: Kartu Iuran vs Kas Kelas */}
                <div className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-2xl mb-3.5 gap-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      haptic.selection()
                      setLaporanSubTab("kartu")
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      laporanSubTab === "kartu"
                        ? "bg-white text-[#0F172A] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                    <span>Kartu Iuran</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      haptic.selection()
                      setLaporanSubTab("kas")
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      laporanSubTab === "kas"
                        ? "bg-white text-[#0F172A] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Kas Kelas</span>
                  </button>
                </div>

                {laporanSubTab === "kartu" ? (
                  /* ─── KARTU IURAN DIGITAL ────────────────────────────── */
                  <KartuIuranView
                    activeGroup={activeGroup}
                    currentUser={currentUser}
                    transactions={transactions}
                    onPayMonth={(m) => {
                      setKirimPreselectedMonth(m)
                      setIsKirimOpen(true)
                    }}
                    onSelectTransaction={(tx) => {
                      setSelectedTransaction(tx)
                      setIsDetailOpen(true)
                    }}
                  />
                ) : (
                  /* ─── TRANSPARANSI KAS KELAS ───────────────────────────────── */
                  <>
                    {/* Privacy Alert */}
                    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-3.5 flex gap-2.5 mb-3 text-xs text-teal-800 leading-relaxed shadow-2xs">
                      <Shield className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <p>
                        Laporan ini menampilkan data agregat kas kelas secara
                        transparan bagi seluruh anggota grup.
                      </p>
                    </div>

                    {/* Public Report Share Card (if enabled) */}
                    {activeGroup.publicReportEnabled && (
                      <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-blue-50/80 border border-blue-200/90 rounded-2xl p-4 mb-4 shadow-2xs space-y-3">
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs flex-shrink-0">
                              <Globe className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-[#0F172A]">
                                Laporan Web Publik Aktif
                              </h4>
                              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                Seluruh anggota & pengurus dapat memantau transparansi kas
                                tanpa perlu login.
                              </p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100/90 text-blue-700 font-bold text-[10px] flex-shrink-0">
                            Publik
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white border border-blue-200/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 truncate shadow-2xs">
                            {window.location.origin}/r/
                            {activeGroup.publicSlug || activeGroup.id.slice(0, 8)}
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              const url = `${window.location.origin}/r/${activeGroup.publicSlug || activeGroup.id}`
                              try {
                                if (navigator.clipboard?.writeText) {
                                  await navigator.clipboard.writeText(url)
                                }
                                setReportLinkCopied(true)
                                haptic.success()
                                setTimeout(() => setReportLinkCopied(false), 2000)
                              } catch (e) {
                                console.warn("Copy error:", e)
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all flex-shrink-0 cursor-pointer min-h-[38px]"
                          >
                            {reportLinkCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Salin Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gradient-to-br from-[#0F766E] to-[#0D9488] rounded-2xl p-4 text-white shadow-sm">
                        <p className="text-teal-100 text-xs font-semibold">
                          Kas Grup
                        </p>
                        <p className="text-xl sm:text-2xl font-black mt-1 truncate">
                          Rp{activeGroup.kasTotal.toLocaleString("id-ID")}
                        </p>
                        <p className="text-teal-100 text-[11px] mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Kondisi Sehat
                        </p>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                        <p className="text-slate-500 text-xs font-semibold">
                          Target Iuran
                        </p>
                        <p className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1 truncate">
                          Rp{activeGroup.targetBulanan.toLocaleString("id-ID")}
                        </p>
                        <p className="text-slate-400 text-[11px] mt-1">
                          per anggota/bulan
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
                        <p className="text-slate-500 text-[11px] font-semibold">
                          Total Setoran Terverifikasi
                        </p>
                        <p className="text-base font-bold text-blue-600 mt-0.5 truncate">
                          Rp{totalVerifiedDeposits.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
                        <p className="text-slate-500 text-[11px] font-semibold">
                          Total Pengeluaran Kas
                        </p>
                        <p className="text-base font-bold text-slate-700 mt-0.5 truncate">
                          Rp{totalExpenses.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    {/* Expense Breakdown */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-4 shadow-2xs">
                      <div className="px-4 py-3 border-b border-slate-100 font-bold text-xs text-[#0F172A]">
                        Rincian Pengeluaran Kas
                      </div>
                      {expenseItems.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs">
                          Belum ada pengeluaran kas yang dibukukan.
                        </div>
                      ) : (
                        <>
                          <div className="divide-y divide-slate-100 text-xs">
                            {expenseItems.slice(0, expenseDisplayLimit).map((p) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between px-4 py-3"
                              >
                                <div>
                                  <p className="font-semibold text-slate-800">
                                    {p.label}
                                  </p>
                                  <p className="text-slate-400 text-[11px] mt-0.5">
                                    {p.tanggal}
                                  </p>
                                </div>
                                <p className="font-bold text-slate-700">
                                  Rp{Math.abs(p.nominal).toLocaleString("id-ID")}
                                </p>
                              </div>
                            ))}
                          </div>

                          {expenseItems.length > 5 && (
                            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                              <button
                                onClick={() => {
                                  haptic.light()
                                  setExpenseDisplayLimit((prev) =>
                                    prev === 5 ? expenseItems.length : 5,
                                  )
                                }}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                              >
                                {expenseDisplayLimit === 5
                                  ? `Lihat Semua Pengeluaran (${expenseItems.length})`
                                  : "Ciutkan / Tampilkan Lebih Sedikit"}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* ─── TAB 4: AKUN ──────────────────────────────────────────────── */}
        <div
          ref={akunScrollRef}
          style={{ display: activeTab === "akun" ? "block" : "none" }}
          className="tab-scroll-container flex-1 pb-28 relative"
        >
          {/* STICKY HEADER */}
          <header className="sticky top-0 z-30 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200/80 px-4 pt-5 pb-2.5 sticky-top-header flex items-center justify-between shadow-2xs">
            <h1 className="text-[#0F172A] font-extrabold text-base leading-tight">
              Akun Saya
            </h1>
          </header>

          <div className="px-4 pt-3 pb-2 space-y-4">
            {/* Profile Card with Integrated Version Info & Quick Update Controls */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-3.5">
                <UserAvatar
                  src={currentUser.photoURL}
                  name={currentUser.name}
                  initials={currentUser.avatar}
                  size="xl"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[#0F172A] font-extrabold text-base leading-tight truncate">
                      {currentUser.name}
                    </p>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> v
                      {APP_VERSION}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs truncate mt-0.5">
                    {currentUser.email}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-teal-600" /> Google Auth ·
                    Build {BUILD_NUMBER}
                  </p>
                </div>
              </div>

              {/* Version & Update Toast Message if triggered */}
              {updateStatusMessage && (
                <div
                  className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-xs ${
                    updateStatusMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : updateStatusMessage.type === "info"
                        ? "bg-blue-50 text-blue-800 border border-blue-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  <Info className="w-4 h-4 flex-shrink-0 text-current" />
                  <p className="flex-1 leading-snug">
                    {updateStatusMessage.text}
                  </p>
                </div>
              )}

              {/* Quick Update Action Buttons inside Profile */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleManualCheckUpdate}
                  disabled={isCheckingUpdate}
                  className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-700 text-xs font-bold transition-all border border-slate-200/80 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 min-h-[42px]"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      isCheckingUpdate
                        ? "animate-spin text-teal-600"
                        : "text-slate-500"
                    }`}
                  />
                  <span>
                    {isCheckingUpdate ? "Memeriksa..." : "Cek Pembaruan"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowForceUpdateModal(true)}
                  className="py-2.5 px-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 active:scale-95 text-blue-700 text-xs font-bold transition-all border border-blue-200/80 flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Paksa Update</span>
                </button>
              </div>
            </div>

            {/* Anggota / Grup Terhubung */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-[#0F172A] font-bold text-xs uppercase tracking-wider">
                  Anggota / Grup Terhubung
                </p>
                {activeGroup && (
                  <button
                    onClick={() => setIsGroupSwitcherOpen(true)}
                    className="text-blue-600 text-xs font-bold min-h-[36px] flex items-center cursor-pointer"
                  >
                    Ganti Grup
                  </button>
                )}
              </div>
              {!activeGroup ? (
                <div className="p-4 text-center space-y-2">
                  <p className="text-xs text-slate-500">
                    Belum ada grup tabungan yang terhubung.
                  </p>
                  <button
                    onClick={() => setIsJoinGroupOpen(true)}
                    className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Gabung dengan Kode Undangan</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 flex items-center gap-3">
                  <UserAvatar
                    name={activeGroup.siswaNama || currentUser.name}
                    size="md"
                    className="bg-gradient-to-tr from-teal-500 to-emerald-400"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0F172A] font-bold text-sm">
                      {activeGroup.siswaNama || currentUser.name}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {activeGroup.sekolah}
                    </p>
                  </div>
                  <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-100">
                    Aktif
                  </span>
                </div>
              )}
            </div>

            {/* Menu List */}
            <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-2xs">
              <div
                onClick={() => {
                  haptic.light()
                  setShowCoachmark(true)
                }}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-teal-50/50 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-800">
                      Panduan Penggunaan Aplikasi
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Buka panduan alur menabung & mutasi
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => triggerGlobalInstall()}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-teal-50/50 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-800">
                      Pasang Aplikasi (PWA)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Pasang ke layar utama HP
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => setIsJoinGroupOpen(true)}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-800">
                      Gabung Grup Baru
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Masukkan 6 digit kode undangan
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => setShowLogoutModal(true)}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-red-50 text-red-600 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <p className="font-bold text-xs">Keluar Akun</p>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </div>
            </div>

            {/* Version & PWA Footer */}
            <div className="pt-2 pb-6 text-center space-y-1">
              <p className="text-[11px] font-bold text-slate-400 font-mono">
                NabungBareng PWA v{APP_VERSION} (Build {BUILD_NUMBER})
              </p>
              <p className="text-[10px] text-slate-400">
                PWA Aktif · Caching &amp; Offline Ready
              </p>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM NAVIGATION BAR ─────────────────────────────────────── */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 bottom-nav">
          <div className="flex items-end justify-around px-2 pt-1.5 pb-1">
            {/* Beranda */}
            <button
              data-coachmark="tab-beranda"
              onClick={() => handleTabClick("beranda")}
              className="flex flex-col items-center gap-1 min-w-[52px] min-h-[44px] justify-center px-1 active:scale-95 transition-transform cursor-pointer"
            >
              <Home
                className={`w-5 h-5 transition-colors ${
                  activeTab === "beranda" ? "text-[#2563EB]" : "text-slate-400"
                }`}
              />
              <span
                className={`text-[10px] font-bold ${
                  activeTab === "beranda" ? "text-[#2563EB]" : "text-slate-400"
                }`}
              >
                Beranda
              </span>
            </button>

            {/* Aktivitas */}
            <button
              data-coachmark="tab-aktivitas"
              onClick={() => handleTabClick("aktivitas")}
              className="flex flex-col items-center gap-1 min-w-[52px] min-h-[44px] justify-center px-1 active:scale-95 transition-transform cursor-pointer"
            >
              <Activity
                className={`w-5 h-5 transition-colors ${
                  activeTab === "aktivitas"
                    ? "text-[#2563EB]"
                    : "text-slate-400"
                }`}
              />
              <span
                className={`text-[10px] font-bold ${
                  activeTab === "aktivitas"
                    ? "text-[#2563EB]"
                    : "text-slate-400"
                }`}
              >
                Aktivitas
              </span>
            </button>

            {/* FAB Kirim Bukti Center Button */}
            <div
              data-coachmark="member-kirim-fab"
              className="flex flex-col items-center -mt-6"
            >
              <button
                onClick={() => {
                  if (!activeGroup) {
                    setIsJoinGroupOpen(true)
                  } else {
                    setIsKirimOpen(true)
                  }
                }}
                aria-label="Kirim Bukti Transfer"
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#2563EB] to-blue-500 text-white shadow-xl shadow-blue-500/35 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
              >
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </button>
              <span className="text-[10px] font-bold text-slate-500 mt-1">
                Kirim
              </span>
            </div>

            {/* Laporan */}
            <button
              data-coachmark="tab-laporan"
              onClick={() => handleTabClick("laporan")}
              className="flex flex-col items-center gap-1 min-w-[52px] min-h-[44px] justify-center px-1 active:scale-95 transition-transform cursor-pointer"
            >
              <BarChart3
                className={`w-5 h-5 transition-colors ${
                  activeTab === "laporan" ? "text-[#2563EB]" : "text-slate-400"
                }`}
              />
              <span
                className={`text-[10px] font-bold ${
                  activeTab === "laporan" ? "text-[#2563EB]" : "text-slate-400"
                }`}
              >
                Laporan
              </span>
            </button>

            {/* Akun */}
            <button
              data-coachmark="tab-akun"
              onClick={() => handleTabClick("akun")}
              className="flex flex-col items-center gap-1 min-w-[52px] min-h-[44px] justify-center px-1 active:scale-95 transition-transform cursor-pointer"
            >
              <User
                className={`w-5 h-5 transition-colors ${
                  activeTab === "akun" ? "text-[#2563EB]" : "text-slate-400"
                }`}
              />
              <span
                className={`text-[10px] font-bold ${
                  activeTab === "akun" ? "text-[#2563EB]" : "text-slate-400"
                }`}
              >
                Akun
              </span>
            </button>
          </div>
        </nav>

        {/* ─── MODAL BOTTOM SHEETS ───────────────────────────────────────── */}
        {/* Kirim Bukti Sheet */}
        {activeGroup && (
          <KirimBuktiSheet
            isOpen={isKirimOpen}
            onClose={() => {
              setIsKirimOpen(false)
              setKirimPreselectedMonth(null)
            }}
            onSuccess={(sub) => {
              handleSubmissionSuccess(sub)
              setKirimPreselectedMonth(null)
            }}
            groupId={activeGroup.id}
            userId={currentUser?.id}
            groupName={activeGroup.nama}
            targetBulanan={activeGroup.targetBulanan}
            startMonth={activeGroup.effectiveStartMonth || activeGroup.startMonth}
            groupStartMonth={activeGroup.startMonth}
            preselectedMonth={kirimPreselectedMonth}
            existingTransactions={transactions}
          />
        )}

        {/* Transaction Detail Sheet */}
        <TransactionDetailSheet
          transaction={selectedTransaction}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false)
            setSelectedTransaction(null)
          }}
        />

        {/* Group Switcher Sheet */}
        <GroupSwitcherSheet
          isOpen={isGroupSwitcherOpen}
          onClose={() => setIsGroupSwitcherOpen(false)}
          groups={groups}
          activeGroupId={activeGroupId}
          onSelectGroup={handleSelectGroup}
          onOpenJoinGroup={() => setIsJoinGroupOpen(true)}
        />

        {/* Join Group Invitation Sheet */}
        <JoinGroupSheet
          isOpen={isJoinGroupOpen}
          onClose={() => setIsJoinGroupOpen(false)}
          onSuccess={handleJoinGroupSuccess}
        />

        {/* Logout Confirmation Sheet */}
        <BottomSheet
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          title="Keluar dari Akun?"
          subtitle="Konfirmasi keluar"
        >
          <div className="space-y-4 pt-1 pb-4">
            <p className="text-slate-600 text-xs leading-relaxed">
              Anda perlu masuk kembali menggunakan akun Google Anda untuk
              mengakses pencatatan tabungan kelas.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs min-h-[48px] hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  setShowLogoutModal(false)
                  try {
                    await logoutUser()
                  } catch (err) {
                    console.warn("Logout error:", err)
                  }
                  setCurrentUser(null)
                  localStorage.removeItem("nabungbareng_auth_user")
                }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs min-h-[48px] shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </BottomSheet>

        {/* Force Update Confirmation Modal */}
        <BottomSheet
          isOpen={showForceUpdateModal}
          onClose={() => setShowForceUpdateModal(false)}
          title="Paksa Update PWA?"
          subtitle="Bersihkan Cache & Refresh"
        >
          <div className="space-y-4 pt-1 pb-4">
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
              <Zap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Membersihkan Seluruh Cache Lokal</p>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Tindakan ini akan mengunduh versi terbaru dari server dan
                  menyinkronkan seluruh aset aplikasi. Data login Anda tetap
                  aman.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowForceUpdateModal(false)}
                className="flex-1 py-3.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs min-h-[48px] hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleExecuteForceUpdate}
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#0F766E] hover:bg-teal-700 text-white font-bold text-xs min-h-[48px] shadow-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Ya, Update Sekarang</span>
              </button>
            </div>
          </div>
        </BottomSheet>

        {/* PWA Prompts & Banners */}
        <PwaInstallPrompt />
        <PwaUpdateBanner />

        {/* Member Coachmark Onboarding Tour */}
        <MemberCoachmark
          isOpen={showCoachmark}
          onClose={() => setShowCoachmark(false)}
          onSelectTab={(tab) => handleTabClick(tab)}
        />
      </div>
    </div>
  )
}
