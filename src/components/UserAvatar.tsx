import React, { useState } from "react"

interface UserAvatarProps {
  src?: string | null
  name?: string | null
  initials?: string | null
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
}

export function getInitials(name?: string | null): string {
  if (!name) return "NB"
  const cleaned = name.trim()
  if (!cleaned) return "NB"

  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "NB"
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const sizeClasses = {
  xs: "w-7 h-7 text-[10px] rounded-lg",
  sm: "w-9 h-9 text-xs rounded-xl",
  md: "w-10 h-10 text-sm rounded-xl",
  lg: "w-12 h-12 text-base rounded-2xl",
  xl: "w-14 h-14 text-lg rounded-2xl",
}

export default function UserAvatar({
  src,
  name,
  initials,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false)

  const computedInitials = initials || getInitials(name)
  const sizeClass = sizeClasses[size] || sizeClasses.md

  // Show photo if available and not failed
  if (src && !imageFailed) {
    return (
      <div
        className={`${sizeClass} relative overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center border border-slate-200/60 shadow-2xs ${className}`}
      >
        <img
          src={src}
          alt={name || "Avatar"}
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  // Fallback to vibrant modern initials badge
  return (
    <div
      className={`${sizeClass} bg-gradient-to-tr from-blue-600 to-teal-400 text-white font-extrabold flex-shrink-0 flex items-center justify-center shadow-xs border border-white/20 select-none ${className}`}
    >
      <span>{computedInitials}</span>
    </div>
  )
}
