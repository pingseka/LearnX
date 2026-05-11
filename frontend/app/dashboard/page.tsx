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
import { getMyMaterials, type Material } from "@/api/materials"
import { getOrders, type Order } from "@/api/orders"
import {
  getEarningsDetails,
  getEarningsStats,
  type EarningsDetail,
} from "@/api/earnings"
import { formatCurrency, formatDate, formatPrice } from "@/lib/catalog"

function getOrderMaterial(order: Order) {
  return order.items?.[0]?.material
}

function getEarningMaterialTitle(earning: EarningsDetail) {
  return (
    earning.order?.items?.[0]?.material?.title ||
    `订单 #${earning.orderId}`
  )
}

function getEarningBuyerName(earning: EarningsDetail) {
  return (
    earning.order?.buyer?.name ||
    earning.order?.buyer?.email ||
    "购买用户"
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState(user?.name || "用户")
  const [balance, setBalance] = useState(0)
  const [totalEarningsAmount, setTotalEarningsAmount] = useState(0)
  const [materialsList, setMaterialsList] = useState<Material[]>([])
  const [ordersList, setOrdersList] = useState<Order[]>([])
  const [earningsList, setEarningsList] = useState<EarningsDetail[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          profile,
          materialsRes,
          ordersRes,
          earningsRes,
          statsRes,
        ] = await Promise.all([
          getProfile(),
          getMyMaterials(),
          getOrders(),
          getEarningsDetails(),
          getEarningsStats(),
        ])
        setUserName(profile.name)
        setMaterialsList(materialsRes.materials || [])
        setOrdersList(ordersRes.orders || [])
        setEarningsList(earningsRes.earnings || [])
        setBalance(statsRes.total || 0)
        setTotalEarningsAmount(statsRes.total || 0)
      } catch {
        if (user?.name) setUserName(user.name)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const recentEarnings = earningsList.slice(0, 5)
  const recentOrders = ordersList.slice(0, 3)
  const completedOrdersCount = ordersList.filter(
    (order) => order.status === "completed"
  ).length

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
          value={formatCurrency(balance)}
          description="可提现金额"
          icon={Wallet}
          color="bg-blue-500"
        />
        <StatsCard
          title="累计收益"
          value={formatCurrency(totalEarningsAmount)}
          icon={TrendingUp}
          description="沙盒订单收益"
          color="bg-emerald-500"
        />
        <StatsCard
          title="我的资料"
          value={`${materialsList.length} 份`}
          description="已上传资料"
          icon={FileText}
          color="bg-amber-500"
        />
        <StatsCard
          title="购买订单"
          value={`${completedOrdersCount} 笔`}
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
                      <p className="font-medium text-sm truncate">
                        {getEarningMaterialTitle(earning)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getEarningBuyerName(earning)} 购买 · {formatDate(earning.createdAt)}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600 shrink-0 ml-4">
                      +{formatCurrency(earning.amount)}
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
                {recentOrders.map((order) => {
                  const material = getOrderMaterial(order)

                  return (
                    <div key={order.id} className="flex items-center gap-4 py-2 border-b border-border/50 last:border-0">
                      <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {material?.title || `订单 #${order.id}`}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                      <span className="font-semibold shrink-0">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  )
                })}
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
