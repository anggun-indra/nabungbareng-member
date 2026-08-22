import { Check, Users, School, Plus, ShieldAlert, KeyRound } from "lucide-react"
import BottomSheet from "./BottomSheet"
import { haptic } from "../utils/haptics"
import type { GroupInfo } from "../types"

interface GroupSwitcherSheetProps {
  isOpen: boolean
  onClose: () => void
  groups: GroupInfo[]
  activeGroupId: string
  onSelectGroup: (groupId: string) => void
  onOpenJoinGroup?: () => void
}

export default function GroupSwitcherSheet({
  isOpen,
  onClose,
  groups,
  activeGroupId,
  onSelectGroup,
  onOpenJoinGroup,
}: GroupSwitcherSheetProps) {
  const handleSelect = (id: string) => {
    haptic.light()
    onSelectGroup(id)
    onClose()
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Pilih Group Tabungan"
      subtitle="Saldo & mutasi terpisah secara mandiri per grup"
      maxHeight="max-h-[80vh]"
    >
      <div className="space-y-3 pb-4">
        {groups.map((g) => {
          const isSelected = g.id === activeGroupId
          return (
            <div
              key={g.id}
              onClick={() => handleSelect(g.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between active:scale-[0.99] ${
                isSelected
                  ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {g.logoUrl ? (
                  <img
                    src={g.logoUrl}
                    alt={g.nama}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-2xs flex-shrink-0 bg-white"
                  />
                ) : (
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
                      isSelected
                        ? "bg-[#2563EB] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <School className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[#0F172A] truncate">
                      {g.nama}
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {g.role === "member"
                        ? "Anggota"
                        : g.role === "treasurer"
                          ? "Bendahara"
                          : "Admin"}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5 truncate">
                    {g.sekolah}
                  </p>
                  <p className="text-blue-600 text-xs font-bold mt-1">
                    Saldo: Rp{g.saldoSaya.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
          )
        })}

        {/* Action to Join/Add Group with 6-digit invitation code */}
        {onOpenJoinGroup && (
          <button
            onClick={() => {
              haptic.light()
              onClose()
              onOpenJoinGroup()
            }}
            className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/40 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 active:scale-98 transition-all min-h-[48px] mt-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-blue-600" />
            <span>Masukkan Kode Undangan Grup (6 Digit)</span>
          </button>
        )}

        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex items-start gap-2.5 text-[11px] text-slate-500">
          <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p>
            Sesuai arsitektur multi-group NabungBareng, saldo, bukti setoran,
            dan hak akses bendahara di satu grup tidak akan pernah tercampur ke
            grup lainnya.
          </p>
        </div>
      </div>
    </BottomSheet>
  )
}
