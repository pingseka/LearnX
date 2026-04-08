"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getOrders } from "@/api/orders"
import { userOrders, formatPrice, formatDate, type Order } from "@/lib/mock-data"

const statusMap = {
  pending: { label: "待支付", variant: "outline" as const },
  completed: { label: "已完成", variant: "default" as const },
  refunded: { label: "已退款", variant: "secondary" as const },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(userOrders)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        await getOrders()
      } catch {
        // Keep mock data as fallback
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

      {/* Orders Table - Desktop */}
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
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[300px]">{order.materialTitle}</p>
                        <p className="text-xs text-muted-foreground">订单号: {order.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.sellerName}</TableCell>
                  <TableCell className="font-semibold">{formatPrice(order.price)}</TableCell>
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
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/materials/${order.materialId}`} className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          查看
                        </Link>
                      </Button>
                      {order.status === "completed" && (
                        <Button size="sm" className="bg-primary hover:bg-blue-600">
                          <Download className="h-3 w-3 mr-1" />
                          下载
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Orders List - Mobile */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="border-0">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-2 mb-1">{order.materialTitle}</p>
                  <p className="text-xs text-muted-foreground">卖家: {order.sellerName}</p>
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
                  <p className="text-lg font-bold">{formatPrice(order.price)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/materials/${order.materialId}`}>
                      查看
                    </Link>
                  </Button>
                  {order.status === "completed" && (
                    <Button size="sm" className="bg-primary hover:bg-blue-600">
                      <Download className="h-3 w-3 mr-1" />
                      下载
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
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
