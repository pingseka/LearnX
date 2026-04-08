"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingBag, 
  TrendingUp, 
  Settings,
  Upload,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { currentUser, formatPrice } from "@/lib/mock-data"

const sidebarItems = [
  { href: "/dashboard", label: "概览", icon: LayoutDashboard },
  { href: "/dashboard/materials", label: "我的资料", icon: FileText },
  { href: "/dashboard/orders", label: "我的订单", icon: ShoppingBag },
  { href: "/dashboard/earnings", label: "收益管理", icon: TrendingUp },
  { href: "/dashboard/settings", label: "账户设置", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r-2 border-border bg-card">
      {/* User Info */}
      <div className="p-6 border-b-2 border-border">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-primary text-white">
              {currentUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">账户余额</p>
          <p className="text-xl font-bold text-primary">
            {formatPrice(currentUser.balance)}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
              {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Upload CTA */}
      <div className="p-4 border-t-2 border-border">
        <Button asChild className="w-full bg-primary hover:bg-blue-600 transition-all duration-200 hover:scale-105">
          <Link href="/upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            上传资料
          </Link>
        </Button>
      </div>
    </aside>
  )
}
