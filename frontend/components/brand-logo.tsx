"use client"

import Image from "next/image"
import Link from "next/link"
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
      className={cn("flex min-w-0 items-center", className)}
    >
      <Image
        src={compact ? "/learnx-logo-mark.png" : "/learnx-logo-header.png"}
        alt=""
        width={compact ? 48 : 180}
        height={compact ? 48 : 60}
        priority
        className={cn(
          "shrink-0 object-contain",
          compact ? "h-11 w-11 rounded-md" : "h-12 w-[144px] sm:w-[168px]"
        )}
      />
    </Link>
  )
}
