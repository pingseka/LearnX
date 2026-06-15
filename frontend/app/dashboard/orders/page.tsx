"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getAssetUrl } from "@/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getOrders } from "@/api/orders"
import { type Order } from "@/api/orders"
import { formatDate, formatPrice } from "@/lib/catalog"

const statusMap = {
  pending: { label: "待支付", variant: "outline" as const },
  completed: { label: "已完成", variant: "default" as const },
  cancelled: { label: "已取消", variant: "secondary" as const },
}

function getOrderMaterial(order: Order) {
  return order.items?.[0]?.material
}

function getSellerName(order: Order) {
  const author = getOrderMaterial(order)?.author
  return author?.name || "资料作者"
}

function getSellerId(order: Order) {
  return getOrderMaterial(order)?.author?.id
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getOrders()
        setOrders(result.orders || [])
        setError("")
      } catch (err) {
        setError(err instanceof Error ? err.message : "订单加载失败")
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
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">我的订单</h1>
        <p className="text-muted-foreground">查看你购买的所有资料</p>
      </div>

      {error && (
        <Card className="border-0">
          <CardContent className="p-8 text-center text-muted-foreground">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Orders Table - Desktop */}
      {!error && orders.length > 0 && (
      <Card className="border-0 hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">资料信息</TableHead>
                <TableHead>卖家</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>下单时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const material = getOrderMaterial(order)
                const fileUrl = getAssetUrl(material?.fileUrl)

                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[300px]">
                            {material?.title || `订单 #${order.id}`}
                          </p>
                          <p className="text-xs text-muted-foreground">订单号: {order.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {getSellerId(order) ? (
                        <Link
                          href={`/authors/${getSellerId(order)}`}
                          className="hover:text-primary hover:underline"
                        >
                          {getSellerName(order)}
                        </Link>
                      ) : (
                        getSellerName(order)
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={statusMap[order.status].variant}
                        className={order.status === "completed" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                      >
                        {statusMap[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {material && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/materials/${material.id}`} className="flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              查看
                            </Link>
                          </Button>
                        )}
                        {order.status === "completed" && fileUrl && (
                          <Button size="sm" className="bg-primary hover:bg-blue-600" asChild>
                            <a href={fileUrl} download>
                              <Download className="h-3 w-3 mr-1" />
                              下载
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}

      {/* Orders List - Mobile */}
      {!error && orders.length > 0 && (
      <div className="md:hidden space-y-4">
        {orders.map((order) => {
          const material = getOrderMaterial(order)
          const fileUrl = getAssetUrl(material?.fileUrl)

          return (
            <Card key={order.id} className="border-0">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-2 mb-1">
                      {material?.title || `订单 #${order.id}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      卖家:{" "}
                      {getSellerId(order) ? (
                        <Link
                          href={`/authors/${getSellerId(order)}`}
                          className="text-primary hover:underline"
                        >
                          {getSellerName(order)}
                        </Link>
                      ) : (
                        getSellerName(order)
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-muted-foreground">订单号: {order.id}</span>
                  <Badge
                    variant={statusMap[order.status].variant}
                    className={order.status === "completed" ? "bg-green-100 text-green-700" : ""}
                  >
                    {statusMap[order.status].label}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <p className="text-lg font-bold">{formatPrice(order.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    {material && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/materials/${material.id}`}>
                          查看
                        </Link>
                      </Button>
                    )}
                    {order.status === "completed" && fileUrl && (
                      <Button size="sm" className="bg-primary hover:bg-blue-600" asChild>
                        <a href={fileUrl} download>
                          <Download className="h-3 w-3 mr-1" />
                          下载
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      )}

      {!error && orders.length === 0 && (
        <Card className="border-0">
          <CardContent className="p-12 text-center">
            <div className="h-20 w-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">暂无订单</h3>
            <p className="text-muted-foreground mb-6">你还没有购买任何资料</p>
            <Button asChild className="bg-primary hover:bg-blue-600">
              <Link href="/materials">浏览资料市场</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
