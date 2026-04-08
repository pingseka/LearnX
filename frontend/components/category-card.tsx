"use client"

import Link from "next/link"
import { BookOpen, Globe, Calculator, GraduationCap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  id: string
  name: string
  icon: string
  color: string
  count: number
}

const iconMap = {
  BookOpen,
  Globe,
  Calculator,
  GraduationCap,
}

export function CategoryCard({ id, name, icon, color, count }: CategoryCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || BookOpen

  return (
    <Link href={`/materials?category=${id}`}>
      <Card className="group overflow-hidden border-0 shadow-none bg-white rounded-lg hover:scale-[1.02] transition-all duration-200 w-full">
        <CardContent className="p-3 sm:p-6">
          {/* 移动端垂直居中布局，桌面端水平布局 */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <div className={`flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-lg ${color} group-hover:scale-110 transition-transform duration-200 shrink-0`}>
              <IconComponent className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-lg font-bold truncate">{name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{count.toLocaleString()} 份资料</p>
            </div>
            {/* 箭头仅在桌面端显示 */}
            <div className="hidden sm:flex h-8 w-8 rounded-full bg-muted items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
