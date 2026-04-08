"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, Menu, X, User, LogOut, Settings, Package, FileText, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo - solid blue icon, solid text */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-white">研</span>
          </div>
          <span className="text-xl font-bold text-foreground">
            研途共享
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/materials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            资料市场
          </Link>
          <Link href="/upload" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            上传资料
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            个人中心
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索考研资料..."
              className="pl-10 bg-muted border-0 focus-visible:bg-white focus-visible:border-2 focus-visible:border-primary rounded-lg"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-white">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>个人中心</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/materials" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    <span>我的资料</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/orders" className="flex items-center gap-2 cursor-pointer">
                    <Package className="h-4 w-4" />
                    <span>我的订单</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/earnings" className="flex items-center gap-2 cursor-pointer">
                    <TrendingUp className="h-4 w-4" />
                    <span>收益管理</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>账户设置</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">登录</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-blue-600 transition-all duration-200 hover:scale-105">
                <Link href="/register">注册</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t-2 border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索考研资料..."
                className="pl-10 bg-muted border-0 rounded-lg"
              />
            </div>
            <nav className="flex flex-col gap-2">
              <Link href="/materials" className="px-4 py-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setIsMenuOpen(false)}>
                资料市场
              </Link>
              <Link href="/upload" className="px-4 py-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setIsMenuOpen(false)}>
                上传资料
              </Link>
              <Link href="/dashboard" className="px-4 py-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setIsMenuOpen(false)}>
                个人中心
              </Link>
            </nav>
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/login">登录</Link>
                </Button>
                <Button className="flex-1 bg-primary hover:bg-blue-600" asChild>
                  <Link href="/register">注册</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
