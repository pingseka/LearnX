"use client"

import { BookOpen, Calculator, FileText, Globe, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Category, getCategoryName } from "@/lib/catalog"

interface MaterialCoverProps {
  title: string
  category: string
  fileType?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const coverStyles: Record<
  Category,
  {
    bg: string
    panel: string
    accent: string
    icon: typeof BookOpen
  }
> = {
  politics: {
    bg: "bg-red-50",
    panel: "bg-red-600",
    accent: "bg-amber-300",
    icon: BookOpen,
  },
  english: {
    bg: "bg-blue-50",
    panel: "bg-blue-600",
    accent: "bg-sky-200",
    icon: Globe,
  },
  math: {
    bg: "bg-emerald-50",
    panel: "bg-emerald-600",
    accent: "bg-lime-200",
    icon: Calculator,
  },
  professional: {
    bg: "bg-amber-50",
    panel: "bg-amber-600",
    accent: "bg-orange-200",
    icon: GraduationCap,
  },
}

function getCoverTitle(title: string) {
  const trimmed = title.trim()
  if (!trimmed) return "待填写资料标题"
  return trimmed.length > 22 ? `${trimmed.slice(0, 22)}...` : trimmed
}

export function MaterialCover({
  title,
  category,
  fileType = "PDF",
  size = "md",
  className,
}: MaterialCoverProps) {
  const safeCategory = category in coverStyles ? (category as Category) : "professional"
  const style = coverStyles[safeCategory]
  const Icon = style.icon
  const titleClass =
    size === "lg"
      ? "text-xl"
      : size === "sm"
        ? "text-sm"
        : "text-base"

  return (
    <div
      className={cn(
        "relative flex h-full min-h-36 overflow-hidden rounded-md border",
        style.bg,
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-2 bg-slate-950" />
      <div className="absolute right-3 top-3 rounded-md bg-white px-2 py-1 text-[10px] font-semibold uppercase text-slate-700 shadow-sm">
        {fileType}
      </div>

      <div className="flex w-full flex-col justify-between p-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md text-white",
              style.panel
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm">
            {getCategoryName(safeCategory)}
          </span>
        </div>

        <div className="mt-8">
          <div
            className={cn(
              "mb-3 h-1.5 w-16 rounded-full",
              style.accent
            )}
          />
          <h3
            className={cn(
              "line-clamp-3 font-semibold leading-snug text-slate-950",
              titleClass
            )}
          >
            {getCoverTitle(title)}
          </h3>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
          <span>研途共享</span>
          <div className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            <span>资料预览</span>
          </div>
        </div>
      </div>
    </div>
  )
}
