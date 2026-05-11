"use client"

import Link from "next/link"
import { BookOpenCheck, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  compact?: boolean
  className?: string
}

export function BrandLogo({ compact = false, className }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="研途共享首页"
      className={cn("flex items-center gap-3", className)}
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm">
        <BookOpenCheck className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-md bg-amber-400 text-slate-950">
          <GraduationCap className="h-3.5 w-3.5" />
        </span>
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="text-lg font-semibold tracking-normal text-slate-950">
            研途共享
          </div>
          <div className="mt-1 text-[11px] font-medium text-slate-500">
            LearnX
          </div>
        </div>
      )}
    </Link>
  )
}
