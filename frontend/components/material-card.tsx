"use client"

import Link from "next/link"
import { Star, FileText, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Material, getCategoryName, formatPrice } from "@/lib/mock-data"

interface MaterialCardProps {
  material: Material
}

export function MaterialCard({ material }: MaterialCardProps) {
  return (
    <Link href={`/materials/${material.id}`}>
      <Card className="group overflow-hidden border-0 shadow-none bg-white rounded-lg hover:scale-[1.02] transition-all duration-200 w-full">
        {/* Cover */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="h-10 w-10 sm:h-16 sm:w-16 text-muted-foreground/40" />
          </div>
          {/* Overlay on hover - 仅桌面端 */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <Badge variant="secondary" className="bg-white/90 text-foreground text-xs">
                {getCategoryName(material.category)}
              </Badge>
              <div className="flex items-center gap-1 text-white text-xs sm:text-sm">
                <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>预览</span>
              </div>
            </div>
          </div>
          {/* File type badge */}
          <Badge
            className="absolute top-2 right-2 sm:top-3 sm:right-3 uppercase bg-primary text-white border-0 text-[10px] sm:text-xs px-1.5 sm:px-2"
          >
            {material.fileType}
          </Badge>
        </div>

        <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 group-hover:text-primary transition-colors min-h-[2rem] sm:min-h-[2.5rem]">
            {material.title}
          </h3>

          {/* Tags - 移动端只显示2个 */}
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {material.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0 h-4 sm:h-5 bg-muted border-transparent text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
            {material.tags.length > 2 && (
              <Badge
                variant="outline"
                className="hidden sm:inline-flex text-xs px-2 py-0 h-5 bg-muted border-transparent text-muted-foreground"
              >
                {material.tags[2]}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{material.rating}</span>
              <span className="hidden sm:inline">({material.reviewCount})</span>
            </div>
            <span>{material.salesCount} 人购买</span>
          </div>

          {/* Price & Uploader */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-sm sm:text-lg font-bold text-primary">
              {formatPrice(material.price)}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[60px] sm:max-w-[100px]">
              {material.uploaderName}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
