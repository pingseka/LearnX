"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Wallet, 
  FileText, 
  ShoppingBag, 
  TrendingUp,
  ArrowRight,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsCard } from "@/components/stats-card"
import { useAuth } from "@/lib/auth-context"
import { getProfile } from "@/api/auth"
import { getMyMaterials } from "@/api/materials"
import { getOrders } from "@/api/orders"
import { getEarningsDetails } from "@/api/earnings"
import {
  currentUser,
  userMaterials,
  userOrders,
  userEarnings,
  formatPrice,
  formatDate,
  type Earning,
} from "@/lib/mock-data"

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState(currentUser.name)
  const [balance, setBalance] = useState(currentUser.balance)
  const [totalEarningsAmount, setTotalEarningsAmount] = useState(currentUser.totalEarnings)
  const [materialsList, setMaterialsList] = useState(userMaterials)
  const [ordersList, setOrdersList] = useState(userOrders)
  const [earningsList, setEarningsList] = useState<Earning[]>(userEarnings)

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, materialsRes, ordersRes, earningsRes] = await Promise.allSettled([
          getProfile(),
          getMyMaterials(),
          getOrders(),
          getEarningsDetails(),
        ])
        if (profileRes.status === 'fulfilled' && profileRes.value) {
          setUserName(profileRes.value.name)
        } else if (user?.name) {
          setUserName(user.name)
        }
      } catch {
        if (user?.name) setUserName(user.name)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const totalEarnings = earningsList.reduce((sum, e) => sum + e.netAmount, 0)
  const recentEarnings = earningsList.slice(0, 5)
  const recentOrders = ordersList.slice(0, 3)

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">欢迎回来，{userName}</h1>
          <p className="text-muted-foreground">这是你的账户概览</p>
        </div>
        <Button asChild className="self-start bg-primary hover:bg-blue-600 transition-all duration-200 hover:scale-105">
          <Link href="/upload" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            上传新资料
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="账户余额"
          value={formatPrice(balance)}
          description="可提现金额"
          icon={Wallet}
          color="bg-blue-500"
        />
        <StatsCard
          title="累计收益"
          value={formatPrice(totalEarningsAmount)}
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
          color="bg-emerald-500"
        />
        <StatsCard
          title="我的资料"
          value={`${materialsList.length} 份`}
          description={`总销量 ${materialsList.reduce((sum, m) => sum + m.salesCount, 0)} 份`}
          icon={FileText}
          color="bg-amber-500"
        />
        <StatsCard
          title="购买订单"
          value={`${ordersList.length} 笔`}
          description="已完成订单"
          icon={ShoppingBag}
          color="bg-red-500"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Earnings */}
        <Card className="border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">最近收益</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/earnings" className="flex items-center gap-1 text-muted-foreground">
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentEarnings.length > 0 ? (
              <div className="space-y-4">
                {recentEarnings.map((earning) => (
                  <div key={earning.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{earning.materialTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {earning.buyerName} 购买 · {formatDate(earning.createdAt)}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600 shrink-0 ml-4">
                      +{formatPrice(earning.netAmount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                暂无收益记录
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">最近订单</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/orders" className="flex items-center gap-1 text-muted-foreground">
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center gap-4 py-2 border-b border-border/50 last:border-0">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{order.materialTitle}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className="font-semibold shrink-0">{formatPrice(order.price)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                暂无订单记录
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">快捷操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/upload">
              <div className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:scale-[1.02] text-center">
                <div className="h-10 w-10 mx-auto rounded-xl bg-primary flex items-center justify-center mb-2">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">上传资料</span>
              </div>
            </Link>
            <Link href="/dashboard/earnings">
              <div className="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-all duration-200 hover:scale-[1.02] text-center">
                <div className="h-10 w-10 mx-auto rounded-xl bg-emerald-500 flex items-center justify-center mb-2">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">申请提现</span>
              </div>
            </Link>
            <Link href="/materials">
              <div className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:scale-[1.02] text-center">
                <div className="h-10 w-10 mx-auto rounded-xl bg-primary flex items-center justify-center mb-2">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">浏览资料</span>
              </div>
            </Link>
            <Link href="/dashboard/settings">
              <div className="p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-all duration-200 hover:scale-[1.02] text-center">
                <div className="h-10 w-10 mx-auto rounded-xl bg-amber-500 flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">数据统计</span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
