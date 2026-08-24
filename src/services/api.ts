import { supabase } from "../lib/supabase"
import type { GroupInfo, TransactionItem, Submission } from "../types"

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id)
}

/**
 * Sync user profile to Supabase on login
 */
export async function syncUserProfile(user: {
  uid: string
  displayName?: string | null
  email?: string | null
  photoURL?: string | null
}) {
  const displayName =
    user.displayName || user.email?.split("@")[0] || "Wali Murid"
  const email = user.email || ""
  const avatarUrl = user.photoURL || null

  try {
    const { data, error } = await supabase.rpc("upsert_current_user_profile", {
      p_display_name: displayName,
      p_email: email,
      p_avatar_url: avatarUrl || undefined,
      p_user_id: user.uid,
    })

    if (error) {
      console.warn("RPC upsert_current_user_profile fallback:", error)
      const { data: directData } = await supabase
        .from("profiles")
        .upsert({
          id: user.uid,
          display_name: displayName,
          email,
          avatar_url: avatarUrl,
        })
        .select()
        .single()
      return directData
    }

    return data
  } catch (err) {
    console.warn("Sync profile notice:", err)
    return null
  }
}

/**
 * Fetch all groups that the current user belongs to
 */
export async function fetchUserGroups(targetUserId?: string): Promise<GroupInfo[]> {
  try {
    const currentUserId = targetUserId || getCurrentUserId()

    // 1. Fetch group members
    let membersQuery = supabase
      .from("group_members")
      .select("id, group_id, user_id, role, display_name, student_name, active, created_at")
      .eq("active", true)

    if (currentUserId) {
      membersQuery = membersQuery.eq("user_id", currentUserId)
    }

    const { data: memberRows, error: memberErr } = await membersQuery

    if (memberErr) {
      console.error("fetchUserGroups memberErr:", memberErr)
      return []
    }

    if (!memberRows || memberRows.length === 0) {
      return []
    }

    const groupIds = Array.from(new Set(memberRows.map((m: any) => m.group_id).filter(Boolean)))
    const memberIds = memberRows.map((m: any) => m.id)

    if (groupIds.length === 0) {
      return []
    }

    // 2. Fetch groups
    const { data: groupsData, error: groupsErr } = await supabase
      .from("groups")
      .select("id, name, school_name, monthly_target_idr, start_month, logo_url, status, public_report_enabled, public_slug")
      .in("id", groupIds)
      .eq("status", "active")

    if (groupsErr) {
      console.error("fetchUserGroups groupsErr:", groupsErr)
    }

    const groupsMap = new Map<string, any>()
    if (groupsData) {
      groupsData.forEach((g: any) => groupsMap.set(g.id, g))
    }

    // 3. Fetch member balances
    const { data: balancesData } = await supabase
      .from("member_balances")
      .select("group_member_id, balance_idr")
      .in("group_member_id", memberIds)

    const balancesMap = new Map<string, number>()
    if (balancesData) {
      balancesData.forEach((b: any) => balancesMap.set(b.group_member_id, Number(b.balance_idr)))
    }

    // 4. Fetch total cash balances
    const { data: cashData } = await supabase
      .from("group_cash_balances")
      .select("group_id, balance_idr")
      .in("group_id", groupIds)

    const cashMap = new Map<string, number>()
    if (cashData) {
      cashData.forEach((c: any) => cashMap.set(c.group_id, Number(c.balance_idr)))
    }

    const groupList: GroupInfo[] = []

    for (const row of memberRows) {
      const g = groupsMap.get(row.group_id)
      if (!g) continue

      let effectiveStartMonth = g.start_month || undefined
      if (row.created_at) {
        try {
          const joinDate = new Date(row.created_at)
          if (!isNaN(joinDate.getTime())) {
            const joinYearMonth = `${joinDate.getFullYear()}-${String(joinDate.getMonth() + 1).padStart(2, "0")}`
            if (!effectiveStartMonth || joinYearMonth > effectiveStartMonth) {
              effectiveStartMonth = joinYearMonth
            }
          }
        } catch {
          // Keep fallback
        }
      }

      const bal = balancesMap.get(row.id) ?? 0
      const cash = cashMap.get(g.id) ?? 0

      groupList.push({
        id: g.id,
        nama: g.name,
        sekolah: g.school_name || "Sekolah Dasar",
        role: row.role as "member" | "treasurer" | "group_admin",
        targetBulanan: Number(g.monthly_target_idr) || 25000,
        saldoSaya: bal,
        kasTotal: cash,
        siswaNama: row.student_name || row.display_name,
        siswaKelas: g.name,
        startMonth: g.start_month || undefined,
        memberJoinedAt: row.created_at || undefined,
        effectiveStartMonth,
        logoUrl: g.logo_url || undefined,
        publicReportEnabled: g.public_report_enabled ?? false,
        publicSlug: g.public_slug || undefined,
      })
    }

    return groupList
  } catch (err) {
    console.error("Error fetching user groups:", err)
    return []
  }
}

/**
 * Accept a 6-digit group invitation code
 */
export async function acceptGroupInvitation(
  inviteCode: string,
): Promise<{
  success: boolean
  groupId: string
  groupName: string
  schoolName?: string
  role: string
  studentName?: string
  monthlyTarget: number
}> {
  const code = inviteCode.trim().toUpperCase()
  if (!code || code.length !== 6) {
    throw new Error("Kode undangan harus terdiri dari 6 karakter.")
  }

  const { data, error } = await supabase.rpc("accept_group_invitation", {
    p_invite_code: code,
  })

  if (error) {
    throw new Error(error.message || "Gagal menerima undangan grup.")
  }

  const res = data as {
    success?: boolean
    group_id: string
    group_name: string
    school_name?: string
    role: string
    student_name?: string
    monthly_target_idr?: number
  }

  return {
    success: true,
    groupId: res.group_id,
    groupName: res.group_name,
    schoolName: res.school_name,
    role: res.role,
    studentName: res.student_name,
    monthlyTarget: Number(res.monthly_target_idr) || 50000,
  }
}

/**
 * Fetch transaction history (Deposits + Expense Allocations) for active group
 */
export async function fetchGroupTransactions(
  groupId: string,
  userMemberId?: string,
): Promise<TransactionItem[]> {
  if (!isValidUUID(groupId)) {
    // If mock group ID like "grp-1", do not query Postgres with invalid UUID
    return []
  }

  try {
    const transactions: TransactionItem[] = []

    // 1. Fetch Payment Submissions
    const { data: submissions, error: subErr } = await supabase
      .from("payment_submissions")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: false })

    if (submissions && !subErr) {
      for (const sub of submissions) {
        let receiptUrl: string | undefined
        if (sub.storage_path) {
          const { data: signed } = await supabase.storage
            .from("payment-proofs")
            .createSignedUrl(sub.storage_path, 3600)
          receiptUrl = signed?.signedUrl
        }

        const isVerified = sub.status === "verified"
        const isVoided = sub.status === "voided"
        const isRejected = sub.status === "rejected"
        const allocations =
          sub.period_allocations as Array<{
            period: string
            amount_idr: number
          }> || []

        if (allocations && allocations.length > 1) {
          // Explode multi-period allocation into distinct transaction items per month
          allocations.forEach((alloc, idx) => {
            transactions.push({
              id: `${sub.id}-p${idx}`,
              jenis: isVerified ? "Setoran" : "Menunggu",
              label: `Iuran ${alloc.period}`,
              tanggal: new Date(sub.transfer_date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              periode: alloc.period,
              periodAllocations: allocations,
              nominal: Number(alloc.amount_idr),
              status: isVerified
                ? "Disetujui"
                : isVoided
                  ? "Ditolak"
                  : isRejected
                    ? "Ditolak"
                    : "Menunggu",
              submissionId: sub.id,
              catatan: sub.catatan
                ? `${sub.catatan} (Bagian ${idx + 1}/${allocations.length})`
                : undefined,
              receiptUrl,
              sha256: sub.sha256 || undefined,
            })
          })
        } else {
          transactions.push({
            id: sub.id,
            jenis: isVerified ? "Setoran" : "Menunggu",
            label: `Iuran ${sub.period_label}`,
            tanggal: new Date(sub.transfer_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            periode: sub.period_label,
            periodAllocations:
              allocations.length === 1 ? allocations : undefined,
            nominal: Number(sub.amount_idr),
            status: isVerified
              ? "Disetujui"
              : isVoided
                ? "Ditolak"
                : isRejected
                  ? "Ditolak"
                  : "Menunggu",
            submissionId: sub.id,
            catatan: sub.catatan || undefined,
            receiptUrl,
            sha256: sub.sha256 || undefined,
          })
        }
      }
    }

    // 2. Fetch Posted Expenses & Allocations
    const { data: allocations, error: allocErr } = await supabase
      .from("expense_allocations")
      .select(`
        id,
        amount_idr,
        balance_before_idr,
        balance_after_idr,
        created_at,
        expenses (
          id,
          description,
          category,
          expense_date,
          status
        )
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: false })

    if (allocations && !allocErr) {
      for (const alloc of allocations) {
        const expRaw = alloc.expenses
        const exp = (Array.isArray(expRaw) ? expRaw[0] : expRaw) as {
          id: string
          description: string
          category: string
          expense_date: string
          status: string
        } | null

        if (!exp || exp.status !== "posted") continue

        transactions.push({
          id: alloc.id,
          jenis: "Pengeluaran",
          label: exp.description,
          tanggal: new Date(exp.expense_date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          periode: new Date(exp.expense_date).toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          }),
          nominal: -Number(alloc.amount_idr),
          status: "Pengeluaran",
          kategori: exp.category,
        })
      }
    }

    // Sort all transactions by date descending
    return transactions.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1))
  } catch (err) {
    console.warn("Error fetching group transactions:", err)
    return []
  }
}

/**
 * Upload compressed payment proof to private Supabase Storage and invoke RPC
 */
export async function uploadAndSubmitPayment(params: {
  groupId: string
  userId: string
  file: File
  amountIdr: number
  transferDate: string
  periodLabel: string
  periodAllocations?: Array<{ period: string; amount_idr: number }>
  catatan?: string
  sha256?: string
}): Promise<Submission> {
  const {
    groupId,
    userId,
    file,
    amountIdr,
    transferDate,
    periodLabel,
    periodAllocations,
    catatan,
    sha256,
  } = params

  if (!isValidUUID(groupId)) {
    throw new Error("ID Grup tidak valid.")
  }

  const fileExt = file.name.split(".").pop() || "jpg"
  const randomId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2)
  const storagePath = `groups/${groupId}/members/${userId}/${randomId}.${fileExt}`

  // 1. Upload to Supabase Storage private bucket
  const { error: uploadError } = await supabase.storage
    .from("payment-proofs")
    .upload(storagePath, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    })

  if (uploadError) {
    console.error("Storage upload error:", uploadError)
    throw new Error(
      `Gagal mengunggah foto bukti transfer: ${uploadError.message}`,
    )
  }

  // 2. Call RPC create_payment_submission with period allocations
  const { data: rpcRes, error: rpcErr } = await supabase.rpc(
    "create_payment_submission",
    {
      p_group_id: groupId,
      p_storage_path: storagePath,
      p_amount_idr: amountIdr,
      p_transfer_date: transferDate,
      p_period_label: periodLabel,
      p_catatan: catatan || undefined,
      p_sha256: sha256 || undefined,
      p_user_id: userId,
      p_period_allocations: (periodAllocations && periodAllocations.length > 0
        ? periodAllocations
        : []) as any,
    },
  )

  if (rpcErr) {
    console.error("RPC create_payment_submission error:", rpcErr)
    throw new Error(`Gagal menyimpan setoran: ${rpcErr.message}`)
  }

  const submissionId =
    (rpcRes as { submission_id?: string })?.submission_id ||
    `TBK-${randomId.slice(0, 8)}`

  // 3. Generate signed URL for immediate display
  const { data: signed } = await supabase.storage
    .from("payment-proofs")
    .createSignedUrl(storagePath, 3600)

  return {
    id: submissionId,
    nominal: amountIdr,
    tanggal: new Date(transferDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    periode: periodLabel,
    periodAllocations,
    catatan: catatan || "",
    file: file.name,
    fileUrl: signed?.signedUrl,
    status: "Menunggu",
    sha256,
  }
}
