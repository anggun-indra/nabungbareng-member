export type TabType = "beranda" | "aktivitas" | "laporan" | "akun"

export type FilterType = "Semua" | "Setoran" | "Pengeluaran" | "Menunggu"

export type UploadState = "idle" | "scanning" | "ready" | "invalid"

export interface AuthUser {
  id?: string
  uid?: string
  name: string
  email: string
  avatar: string
  photoURL?: string | null
  role?: string
}

export interface Submission {
  id: string
  nominal: number
  tanggal: string
  periode: string
  periodAllocations?: Array<{ period: string; amount_idr: number }>
  catatan: string
  file: string
  fileUrl?: string
  status: "Menunggu" | "Disetujui" | "Ditolak"
  sha256?: string
  originalSize?: number
  compressedSize?: number
  dimensions?: { width: number; height: number }
}

export interface TransactionItem {
  id: string
  jenis: "Setoran" | "Pengeluaran" | "Menunggu"
  label: string
  tanggal: string
  nominal: number
  status: "Disetujui" | "Menunggu" | "Pengeluaran" | "Ditolak"
  submissionId?: string
  periode?: string
  periodAllocations?: Array<{ period: string; amount_idr: number }>
  catatan?: string
  receiptUrl?: string
  kategori?: string
  sha256?: string
  fileSize?: string
}

export interface GroupInfo {
  id: string
  nama: string
  sekolah: string
  role: "member" | "treasurer" | "group_admin"
  targetBulanan: number
  saldoSaya: number
  kasTotal: number
  siswaNama: string
  siswaKelas: string
  startMonth?: string
  memberJoinedAt?: string
  effectiveStartMonth?: string
  logoUrl?: string
  publicReportEnabled?: boolean
  publicSlug?: string
}
