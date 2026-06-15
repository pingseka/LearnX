"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowDownToLine,
  FileText,
  Info,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StatsCard } from "@/components/stats-card"
import {
  getEarningsDetails,
  getEarningsStats,
  type EarningsDetail,
  type EarningsStats,
} from "@/api/earnings"
import { formatCurrency, formatDate } from "@/lib/catalog"

function getMaterialTitle(earning: EarningsDetail) {
  return (
    earning.order?.items?.[0]?.material?.title ||
    `订单 #${earning.orderId}`
  )
}

function getBuyerName(earning: EarningsDetail) {
  const buyer = earning.order?.buyer
  return buyer?.name || "购买用户"
}

function getMaterialId(earning: EarningsDetail) {
  return earning.order?.items?.[0]?.material?.id || earning.materialId
}

export default function EarningsPage() {
  const [stats, setStats] = useState<EarningsStats>({
    total: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  })
  const [earnings, setEarnings] = useState<EarningsDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsResult, detailsResult] = await Promise.all([
          getEarningsStats(),
          getEarningsDetails(),
        ])
        setStats(statsResult)
        setEarnings(detailsResult.earnings || [])
        setError("")
      } catch (err) {
        setError(err instanceof Error ? err.message : "收益加载失败")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">收益管理</h1>
          <p className="text-muted-foreground">
            查看订单结算后的作者收益记录
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="self-start bg-primary hover:bg-blue-600">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              结算说明
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>项目结算说明</DialogTitle>
              <DialogDescription>
                当前课程项目已实现订单和作者收益记录，暂未接入银行卡、微信或支付宝打款。
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-lg bg-blue-50 p-4 text-sm leading-6 text-blue-700">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <Info className="h-4 w-4" />
                收益是怎么计算的？
              </div>
              <p>
                例如用户购买 10 元资料，平台按 10% 作为服务费，作者收益记录为 9 元。
                验收时重点看订单是否完成、资料是否可下载、作者收益是否同步增加。
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error ? (
        <Card className="border-0">
          <CardContent className="p-8 text-center text-muted-foreground">
            {error}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="账户收益"
              value={formatCurrency(stats.total)}
              description="订单结算后累计金额"
              icon={Wallet}
              color="bg-blue-500"
            />
            <StatsCard
              title="本周收益"
              value={formatCurrency(stats.weekly)}
              icon={TrendingUp}
              color="bg-emerald-500"
            />
            <StatsCard
              title="本月收益"
              value={formatCurrency(stats.monthly)}
              icon={TrendingUp}
              color="bg-amber-500"
            />
            <StatsCard
              title="年度收益"
              value={formatCurrency(stats.yearly)}
              icon={ArrowDownToLine}
              color="bg-red-500"
            />
          </div>

          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">收益明细</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {earnings.length > 0 ? (
                <div className="divide-y">
                  {earnings.map((earning) => (
                    <div
                      key={earning.id}
                      className="flex items-center justify-between gap-4 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          {getMaterialId(earning) ? (
                            <Link
                              href={`/materials/${getMaterialId(earning)}`}
                              className="block truncate font-medium text-slate-950 hover:text-primary"
                            >
                              {getMaterialTitle(earning)}
                            </Link>
                          ) : (
                            <p className="truncate font-medium">
                              {getMaterialTitle(earning)}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            订单 #{earning.orderId} · {getBuyerName(earning)} 购买 · {formatDate(earning.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-semibold text-green-600">
                          +{formatCurrency(earning.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          平台服务费 10%，作者获得 90%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100">
                    <Wallet className="h-8 w-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-semibold">暂无收益记录</h3>
                  <p className="mt-2 text-muted-foreground">
                    有用户购买你的付费资料后，这里会出现真实收益。
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
