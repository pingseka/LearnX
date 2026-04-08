"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingBag, 
  TrendingUp, 
  Settings,
  Menu,
  Loader2
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const sidebarItems = [
  { href: "/dashboard", label: "概览", icon: LayoutDashboard },
  { href: "/dashboard/materials", label: "我的资料", icon: FileText },
  { href: "/dashboard/orders", label: "我的订单", icon: ShoppingBag },
  { href: "/dashboard/earnings", label: "收益管理", icon: TrendingUp },
  { href: "/dashboard/settings", label: "账户设置", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <div className="flex-1 flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          {/* Mobile Navigation */}
          <div className="lg:hidden sticky top-16 z-40 bg-background border-b-2 border-border px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="font-semibold">
                {sidebarItems.find((item) => item.href === pathname)?.label || "个人中心"}
              </h1>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <nav className="flex flex-col p-4 space-y-1">
                    {sidebarItems.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                            isActive
                              ? "bg-primary text-white"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      )
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
