import React from "react"

export default function HomeSkeleton() {
  return (
    <div
      className="space-y-3 pt-0.5 animate-pulse"
      aria-label="Memuat data tabungan..."
    >
      {/* Group Card Skeleton */}
      <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-2.5 flex items-center gap-2.5 shadow-2xs">
        <div className="w-8 h-8 rounded-xl bg-slate-200 flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-14 h-3 rounded-full bg-slate-200" />
            <div className="w-12 h-3 rounded-full bg-slate-200" />
          </div>
          <div className="w-36 h-3.5 rounded-md bg-slate-200" />
          <div className="w-48 h-2.5 rounded-md bg-slate-100" />
        </div>
        <div className="w-12 h-6 rounded-xl bg-slate-100 flex-shrink-0" />
      </div>

      {/* Saldo Hero Card Skeleton */}
      <div className="rounded-[22px] bg-slate-900/95 p-5 text-white relative overflow-hidden shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-24 h-3.5 rounded-md bg-slate-800" />
          <div className="w-16 h-5 rounded-full bg-slate-800" />
        </div>

        <div className="space-y-2 py-1">
          <div className="w-40 h-9 rounded-xl bg-slate-800" />
          <div className="w-48 h-3 rounded-md bg-slate-800/80" />
        </div>

        <div className="pt-3.5 border-t border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="w-24 h-2.5 rounded-md bg-slate-800" />
            <div className="w-20 h-3.5 rounded-md bg-slate-800" />
          </div>
          <div className="space-y-1 text-right">
            <div className="w-16 h-2.5 rounded-md bg-slate-800 ml-auto" />
            <div className="w-20 h-3.5 rounded-md bg-slate-800 ml-auto" />
          </div>
        </div>
      </div>

      {/* CTA Button Skeleton */}
      <div className="w-full h-[52px] rounded-2xl bg-blue-200/70" />

      {/* Transparansi Kas Kelas Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-36 h-4 rounded-md bg-slate-200" />
          <div className="w-12 h-3 rounded-md bg-slate-200" />
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-50 rounded-xl p-3 h-16 border border-slate-100 flex flex-col justify-center space-y-1.5">
            <div className="w-16 h-3.5 rounded bg-slate-200 mx-auto" />
            <div className="w-12 h-2.5 rounded bg-slate-100 mx-auto" />
          </div>
          <div className="bg-slate-50 rounded-xl p-3 h-16 border border-slate-100 flex flex-col justify-center space-y-1.5">
            <div className="w-16 h-3.5 rounded bg-slate-200 mx-auto" />
            <div className="w-12 h-2.5 rounded bg-slate-100 mx-auto" />
          </div>
          <div className="bg-slate-50 rounded-xl p-3 h-16 border border-slate-100 flex flex-col justify-center space-y-1.5">
            <div className="w-16 h-3.5 rounded bg-slate-200 mx-auto" />
            <div className="w-12 h-2.5 rounded bg-slate-100 mx-auto" />
          </div>
        </div>
      </div>

      {/* Aktivitas Terbaru Skeleton */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="w-28 h-4 rounded-md bg-slate-200" />
          <div className="w-16 h-3 rounded-md bg-slate-200" />
        </div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-center gap-3 shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="w-28 h-3.5 rounded bg-slate-200" />
                <div className="w-20 h-2.5 rounded bg-slate-100" />
              </div>
              <div className="w-16 h-4 rounded bg-slate-200 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
