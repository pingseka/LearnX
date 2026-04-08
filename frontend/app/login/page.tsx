"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { login, saveToken } from "../../api/auth"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      })
      saveToken(response.token)
      await refreshUser()
      toast.success("登录成功")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "登录失败，请检查邮箱和密码")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-white">研</span>
            </div>
            <span className="text-2xl font-bold text-foreground">研途共享</span>
          </Link>

          <Card className="border-0">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl">欢迎回来</CardTitle>
              <CardDescription>登录你的账户继续使用</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="请输入邮箱地址"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 bg-muted border-0 focus-visible:bg-white focus-visible:border-2 focus-visible:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="请输入密码"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 bg-muted border-0 focus-visible:bg-white focus-visible:border-2 focus-visible:border-primary"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.remember}
                      onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })}
                    />
                    <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                      记住我
                    </Label>
                  </div>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    忘记密码？
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-blue-600 transition-all duration-200 hover:scale-105 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      登录中...
                    </>
                  ) : (
                    "登录"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">或者</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button" className="border-2">
                    微信登录
                  </Button>
                  <Button variant="outline" type="button" className="border-2">
                    QQ登录
                  </Button>
                </div>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                还没有账户？{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  立即注册
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Decorative (solid blue, no gradient) */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-8 relative overflow-hidden">
        {/* Geometric decoration */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-1/4 h-40 w-40 rotate-45 bg-white/5 rounded-lg" />

        <div className="max-w-md text-white text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">考研路上，资料先行</h2>
          <p className="text-white/80 mb-8">
            研途共享汇聚海量优质考研资料，政治、英语、数学、专业课应有尽有，助你高效备考，一战成硕
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-white/10">
              <div className="text-2xl font-bold">9000+</div>
              <div className="text-sm text-white/70">优质资料</div>
            </div>
            <div className="p-4 rounded-lg bg-white/10">
              <div className="text-2xl font-bold">50000+</div>
              <div className="text-sm text-white/70">活跃用户</div>
            </div>
            <div className="p-4 rounded-lg bg-white/10">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-white/70">好评率</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
