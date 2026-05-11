"use client"

import { useState, useEffect } from "react"
import { User, Mail, Lock, CreditCard, Bell, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { getProfile } from "@/api/auth"
import { useAuth } from "@/lib/auth-context"

export default function SettingsPage() {
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const profile = await getProfile()
        setFormData({
          name: profile.name,
          email: profile.email,
        })
      } catch {
        if (user) {
          setFormData({
            name: user.name,
            email: user.email,
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
    await new Promise((resolve) => setTimeout(resolve, 300))
    setIsSaving(false)
    setSaveSuccess(false)
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
              <Button variant="outline" size="sm" disabled>
                更换头像
              </Button>
              <p className="text-xs text-muted-foreground mt-2">暂未接入头像上传接口</p>
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
                readOnly
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
                readOnly
              />
            </div>

            <p className="rounded-lg bg-blue-50 p-3 text-sm leading-6 text-blue-700">
              当前后端只保存昵称和邮箱。手机号、头像上传等资料完善功能后续接入真实接口后再开放。
            </p>
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
                <p className="text-sm text-muted-foreground">暂未接入修改密码接口</p>
              </div>
            </div>
            <Button variant="outline" disabled>修改密码</Button>
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
                <p className="font-medium">收款账户</p>
                <p className="text-sm text-muted-foreground">
                  沙盒项目不保存真实银行卡或第三方收款账号
                </p>
              </div>
            </div>
            <Button variant="outline" disabled>暂不支持</Button>
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
          disabled
          className="bg-primary hover:bg-blue-600 transition-all duration-200 hover:scale-105"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              保存中...
            </>
          ) : (
            "暂未开放保存"
          )}
        </Button>
      </div>
      </>
      )}
    </div>
  )
}
