"use client"

import { useState, useEffect } from "react"
import { 
  Wallet, 
  TrendingUp, 
  ArrowDownToLine, 
  History,
  Check,
  Loader2,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StatsCard } from "@/components/stats-card"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { getEarningsStats, getEarningsDetails } from "@/api/earnings"
import {
  currentUser,
  userEarnings,
  userWithdrawals,
  monthlyEarningsData,
  formatPrice,
  formatDate,
} from "@/lib/mock-data"

const withdrawalStatusMap = {
  pending: { label: "处理中", color: "bg-yellow-100 text-yellow-700" },
  completed: { label: "已完成", color: "bg-green-100 text-green-700" },
  rejected: { label: "已拒绝", color: "bg-red-100 text-red-700" },
}

export default function EarningsPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        await Promise.allSettled([
          getEarningsStats(),
          getEarningsDetails(),
        ])
      } catch {
        // Keep mock data as fallback
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleWithdraw = async () => {
    setIsWithdrawing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsWithdrawing(false)
    setWithdrawSuccess(true)
    setTimeout(() => {
      setWithdrawSuccess(false)
      setDialogOpen(false)
      setWithdrawAmount("")
    }, 2000)
  }

  const monthlyTotal = userEarnings.reduce((sum, e) => sum + e.netAmount, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[300px] rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">收益管理</h1>
          <p className="text-muted-foreground">查看收益详情和申请提现</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="self-start bg-primary hover:bg-blue-600 transition-all duration-200 hover:scale-105">
              <ArrowDownToLine className="h-4 w-4 mr-2" />
              申请提现
            </Button>
          </DialogTrigger>
          <DialogContent>
            {withdrawSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">提现申请已提交</h3>
                <p className="text-muted-foreground text-center">
                  预计 1-3 个工作日内到账
                </p>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>申请提现</DialogTitle>
                  <DialogDescription>
                    可提现余额: {formatPrice(currentUser.balance)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">提现金额</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">¥</span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="请输入提现金额"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="pl-8"
                        max={currentUser.balance}
                        min={10}
                      />
                    </div>
                    <div className="flex gap-2">
                      {[100, 500, 1000].map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setWithdrawAmount(String(Math.min(amount, currentUser.balance)))}
                        >
                          ¥{amount}
                        </Button>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setWithdrawAmount(String(currentUser.balance))}
                      >
                        全部
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>提现账户</Label>
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      工商银行 尾号 8888
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p>最低提现金额 10 元，预计 1-3 个工作日到账</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    取消
                  </Button>
                  <Button
                    onClick={handleWithdraw}
                    disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) < 10 || parseFloat(withdrawAmount) > currentUser.balance}
                    className="bg-primary hover:bg-blue-600"
                  >
                    {isWithdrawing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      "确认提现"
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="可提现余额"
          value={formatPrice(currentUser.balance)}
          icon={Wallet}
          color="bg-blue-500"
        />
        <StatsCard
          title="本月收益"
          value={formatPrice(monthlyTotal)}
          icon={TrendingUp}
          trend={{ value: 15.2, isPositive: true }}
          color="bg-emerald-500"
        />
        <StatsCard
          title="累计收益"
          value={formatPrice(currentUser.totalEarnings)}
          icon={TrendingUp}
          color="bg-amber-500"
        />
        <StatsCard
          title="已提现"
          value={formatPrice(currentUser.totalWithdrawn)}
          icon={ArrowDownToLine}
          color="bg-red-500"
        />
      </div>

      {/* Chart */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">收益趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEarningsData}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `¥${value}`} />
                <Tooltip
                  formatter={(value: number) => [formatPrice(value), "收益"]}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{ borderRadius: "8px", border: "none" }}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEarnings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="earnings" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="earnings">收益明细</TabsTrigger>
          <TabsTrigger value="withdrawals">提现记录</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="mt-4">
          <Card className="border-0">
            <CardContent className="p-0">
              <div className="divide-y">
                {userEarnings.map((earning) => (
                  <div key={earning.id} className="flex items-center justify-between p-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{earning.materialTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {earning.buyerName} 购买 · {formatDate(earning.createdAt)}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-semibold text-green-600">+{formatPrice(earning.netAmount)}</p>
                      <p className="text-xs text-muted-foreground">
                        原价 {formatPrice(earning.originalAmount)} · 平台费 {formatPrice(earning.platformFee)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="mt-4">
          <Card className="border-0">
            <CardContent className="p-0">
              <div className="divide-y">
                {userWithdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <ArrowDownToLine className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">提现到 {withdrawal.bankInfo}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(withdrawal.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(withdrawal.amount)}</p>
                      <Badge className={withdrawalStatusMap[withdrawal.status].color}>
                        {withdrawalStatusMap[withdrawal.status].label}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
