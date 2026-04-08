"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, Lock, CreditCard, Bell, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { getProfile } from "@/api/auth"
import { useAuth } from "@/lib/auth-context"
import { currentUser } from "@/lib/mock-data"

export default function SettingsPage() {
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: "138****8888",
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const profile = await getProfile()
        setFormData({
          name: profile.name,
          email: profile.email,
          phone: "138****8888",
        })
      } catch {
        if (user) {
          setFormData({
            name: user.name,
            email: user.email,
            phone: "138****8888",
          })
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const [notifications, setNotifications] = useState({
    orderNotify: true,
    earningsNotify: true,
    systemNotify: false,
    marketingNotify: false,
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">账户设置</h1>
        <p className="text-muted-foreground">管理你的账户信息和偏好设置</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      ) : (
      <>
      {/* Profile Section */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-lg">个人信息</CardTitle>
          <CardDescription>更新你的头像和个人资料</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-white text-2xl">
                {formData.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                更换头像
              </Button>
              <p className="text-xs text-muted-foreground mt-2">支持 JPG、PNG 格式，最大 2MB</p>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                昵称
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入昵称"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                邮箱
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="请输入邮箱"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                手机号
              </Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="请输入手机号"
                  className="flex-1"
                />
                <Button variant="outline">更换</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-lg">安全设置</CardTitle>
          <CardDescription>管理你的密码和安全选项</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">登录密码</p>
                <p className="text-sm text-muted-foreground">上次修改: 30 天前</p>
              </div>
            </div>
            <Button variant="outline">修改密码</Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-lg">收款设置</CardTitle>
          <CardDescription>设置你的收款账户信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">银行卡</p>
                <p className="text-sm text-muted-foreground">工商银行 尾号 8888</p>
              </div>
            </div>
            <Button variant="outline">更换</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Section */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-lg">通知设置</CardTitle>
          <CardDescription>管理你接收的通知类型</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">订单通知</p>
                <p className="text-sm text-muted-foreground">有人购买你的资料时通知</p>
              </div>
            </div>
            <Switch
              checked={notifications.orderNotify}
              onCheckedChange={(checked) => setNotifications({ ...notifications, orderNotify: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">收益通知</p>
                <p className="text-sm text-muted-foreground">收益变动时通知</p>
              </div>
            </div>
            <Switch
              checked={notifications.earningsNotify}
              onCheckedChange={(checked) => setNotifications({ ...notifications, earningsNotify: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">系统通知</p>
                <p className="text-sm text-muted-foreground">平台公告和系统消息</p>
              </div>
            </div>
            <Switch
              checked={notifications.systemNotify}
              onCheckedChange={(checked) => setNotifications({ ...notifications, systemNotify: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">营销通知</p>
                <p className="text-sm text-muted-foreground">优惠活动和推广信息</p>
              </div>
            </div>
            <Switch
              checked={notifications.marketingNotify}
              onCheckedChange={(checked) => setNotifications({ ...notifications, marketingNotify: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saveSuccess && (
          <span className="flex items-center gap-2 text-green-600">
            <Check className="h-4 w-4" />
            保存成功
          </span>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-blue-600 transition-all duration-200 hover:scale-105"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              保存中...
            </>
          ) : (
            "保存设置"
          )}
        </Button>
      </div>
      </>
      )}
    </div>
  )
}
