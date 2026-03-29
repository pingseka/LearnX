"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Mail, Lock, User, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { register, saveToken } from "../../api/auth"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error("两次输入的密码不一致")
      return
    }
    if (!formData.agreeTerms) {
      toast.error("请阅读并同意用户协议")
      return
    }
    setIsLoading(true)
    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      saveToken(response.token)
      toast.success("注册成功")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "注册失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = () => {
    const pwd = formData.password
    if (pwd.length === 0) return null
    if (pwd.length < 6) return { level: 1, text: "弱", color: "bg-red-500" }
    if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) {
      return { level: 2, text: "中", color: "bg-yellow-500" }
    }
    return { level: 3, text: "强", color: "bg-green-500" }
  }

  const strength = passwordStrength()

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 items-center justify-center p-8">
        <div className="max-w-md text-white text-center">
          <h2 className="text-3xl font-bold mb-4">加入研料库</h2>
          <p className="text-white/90 mb-8">
            开启你的知识变现之旅，分享考研资料获取收益，或发现优质资料助力备考。
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">上传即赚钱</p>
                <p className="text-sm text-white/80">每笔交易获得 90% 收益</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">海量优质资料</p>
                <p className="text-sm text-white/80">覆盖考研全科目</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">安全有保障</p>
                <p className="text-sm text-white/80">平台担保，不满意可退款</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <span className="text-xl font-bold text-white">研</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              研料库
            </span>
          </Link>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl">创建账户</CardTitle>
              <CardDescription>注册成为研料库会员</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">昵称</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="请输入昵称"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

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
                      className="pl-10"
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
                      placeholder="请设置密码（至少6位）"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10"
                      required
                      minLength={6}
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
                  {strength && (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full ${
                              level <= strength.level ? strength.color : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">密码强度: {strength.text}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="请再次输入密码"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500">两次输入的密码不一致</p>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                    我已阅读并同意{" "}
                    <Link href="#" className="text-primary hover:underline">
                      用户协议
                    </Link>{" "}
                    和{" "}
                    <Link href="#" className="text-primary hover:underline">
                      隐私政策
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={isLoading || !formData.agreeTerms}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      注册中...
                    </>
                  ) : (
                    "立即注册"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">或者</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button">
                    微信注册
                  </Button>
                  <Button variant="outline" type="button">
                    QQ注册
                  </Button>
                </div>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                已有账户？{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  立即登录
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
