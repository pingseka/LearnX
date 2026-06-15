"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, Check, CreditCard, Loader2, Lock, Mail, User } from "lucide-react"
import { getAssetUrl } from "@/api"
import {
  changePassword,
  getProfile,
  updateProfile,
  uploadAvatar,
} from "@/api/auth"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notifications, setNotifications] = useState({
    orderNotify: true,
    earningsNotify: true,
    systemNotify: false,
    marketingNotify: false,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const profile = await getProfile()
        setFormData({
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatarUrl || "",
        })
      } catch {
        if (user) {
          setFormData({
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl || "",
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  async function handleSaveProfile() {
    setIsSavingProfile(true)
    setError("")
    setMessage("")

    try {
      const profile = await updateProfile({ name: formData.name.trim() })
      setFormData((current) => ({
        ...current,
        name: profile.name,
      }))
      await refreshUser()
      setMessage("个人信息已保存")
    } catch (err) {
      setError(err instanceof Error ? err.message : "个人信息保存失败")
    } finally {
      setIsSavingProfile(false)
    }
  }

  async function handleAvatarChange(file?: File) {
    if (!file) {
      return
    }

    setIsUploadingAvatar(true)
    setError("")
    setMessage("")

    try {
      const profile = await uploadAvatar(file)
      setFormData((current) => ({
        ...current,
        avatarUrl: profile.avatarUrl || "",
      }))
      await refreshUser()
      setMessage("头像已更新")
    } catch (err) {
      setError(err instanceof Error ? err.message : "头像上传失败")
    } finally {
      setIsUploadingAvatar(false)
      if (avatarInputRef.current) {
        avatarInputRef.current.value = ""
      }
    }
  }

  async function handleChangePassword() {
    setError("")
    setMessage("")

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("两次输入的新密码不一致")
      return
    }

    setIsChangingPassword(true)
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setPasswordDialogOpen(false)
      setMessage("密码已修改")
    } catch (err) {
      setError(err instanceof Error ? err.message : "密码修改失败")
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-48 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    )
  }

  const avatarUrl = getAssetUrl(formData.avatarUrl)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">账户设置</h1>
        <p className="text-muted-foreground">管理你的账户信息和偏好设置</p>
      </div>

      {(message || error) && (
        <div
          className={`rounded-lg p-3 text-sm ${
            error ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || message}
        </div>
      )}

      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-lg">个人信息</CardTitle>
          <CardDescription>更新你的头像和公开昵称</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={formData.name} />}
              <AvatarFallback className="bg-primary text-2xl text-white">
                {formData.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif"
                className="hidden"
                onChange={(event) => handleAvatarChange(event.target.files?.[0])}
              />
              <Button
                variant="outline"
                size="sm"
                disabled={isUploadingAvatar}
                onClick={() => avatarInputRef.current?.click()}
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    上传中...
                  </>
                ) : (
                  "更换头像"
                )}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                支持 PNG、JPG、GIF 图片，上传后会显示在你的账户中。
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                昵称
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
                placeholder="请输入昵称"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                邮箱
              </Label>
              <Input id="email" type="email" value={formData.email} readOnly />
              <p className="text-xs text-muted-foreground">
                邮箱作为登录账号，暂不支持在页面内修改。
              </p>
            </div>

            <Button
              onClick={handleSaveProfile}
              disabled={isSavingProfile || !formData.name.trim()}
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                "保存个人信息"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-lg">安全设置</CardTitle>
          <CardDescription>管理你的登录密码</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">登录密码</p>
                <p className="text-sm text-muted-foreground">
                  使用当前密码验证后可修改新密码
                </p>
              </div>
            </div>
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">修改密码</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>修改登录密码</DialogTitle>
                  <DialogDescription>
                    修改成功后，请使用新密码登录。
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">当前密码</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(event) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">新密码</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(event) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">确认新密码</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(event) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleChangePassword}
                    disabled={
                      isChangingPassword ||
                      !passwordForm.currentPassword ||
                      passwordForm.newPassword.length < 6 ||
                      !passwordForm.confirmPassword
                    }
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        修改中...
                      </>
                    ) : (
                      "确认修改"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-lg">结算设置</CardTitle>
          <CardDescription>查看作者收益结算说明</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">作者收益</p>
                <p className="text-sm text-muted-foreground">
                  用户购买资料后，平台按 10% 服务费、作者 90% 记录收益。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <p className="text-sm text-muted-foreground">
                  有人购买你的资料时通知
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.orderNotify}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, orderNotify: checked })
              }
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
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, earningsNotify: checked })
              }
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
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, systemNotify: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">活动通知</p>
                <p className="text-sm text-muted-foreground">优惠活动和推广信息</p>
              </div>
            </div>
            <Switch
              checked={notifications.marketingNotify}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, marketingNotify: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {message && (
        <span className="flex items-center gap-2 text-sm text-green-600">
          <Check className="h-4 w-4" />
          {message}
        </span>
      )}
    </div>
  )
}
