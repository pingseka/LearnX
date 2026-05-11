"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Clock3,
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react"
import { getMyMaterials, type Material } from "@/api/materials"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MaterialCover } from "@/components/material-cover"
import {
  formatPrice,
  getCategoryName,
  type Category,
} from "@/lib/catalog"

const statusConfig = {
  pending: {
    label: "待审核",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Clock3,
  },
  approved: {
    label: "已通过",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: Eye,
  },
  rejected: {
    label: "已拒绝",
    className: "bg-rose-100 text-rose-800 border-rose-200",
    icon: XCircle,
  },
}

function asCategory(category: string): Category {
  if (
    category === "politics" ||
    category === "english" ||
    category === "math" ||
    category === "professional"
  ) {
    return category
  }

  return "professional"
}

function getTags(material: Material) {
  return material.tags?.map((tag) => tag.name).filter(Boolean) ?? []
}

export default function MyMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getMyMaterials()
        setMaterials(result.materials)
      } catch (err) {
        const message = err instanceof Error ? err.message : "资料加载失败"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const summary = useMemo(() => {
    return materials.reduce(
      (acc, material) => {
        const status = material.status ?? "pending"
        acc[status] += 1
        return acc
      },
      { pending: 0, approved: 0, rejected: 0 }
    )
  }, [materials])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">我的资料</h1>
          <p className="text-muted-foreground">
            查看上传记录、审核状态和资料展示情况
          </p>
        </div>
        <Button asChild className="self-start">
          <Link href="/upload" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            发布新资料
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">待审核</p>
            <p className="mt-2 text-2xl font-semibold text-amber-700">
              {summary.pending}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">已通过</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-700">
              {summary.approved}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">已拒绝</p>
            <p className="mt-2 text-2xl font-semibold text-rose-700">
              {summary.rejected}
            </p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="font-semibold text-slate-950">资料加载失败</h3>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
          </CardContent>
        </Card>
      ) : materials.length > 0 ? (
        <div className="space-y-4">
          {materials.map((material) => {
            const category = asCategory(material.category)
            const status = material.status ?? "pending"
            const StatusIcon = statusConfig[status].icon

            return (
              <Card key={material.id}>
                <CardContent className="p-4 md:p-5">
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="h-32 w-full shrink-0 md:w-40">
                      <MaterialCover
                        title={material.title}
                        category={category}
                        className="h-full"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="mb-2 flex flex-wrap gap-2">
                            <Badge variant="outline">
                              {getCategoryName(category)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={statusConfig[status].className}
                            >
                              <StatusIcon className="mr-1 h-3.5 w-3.5" />
                              {statusConfig[status].label}
                            </Badge>
                          </div>
                          <h3 className="line-clamp-2 font-semibold text-slate-950">
                            {material.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                            {material.description}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/materials/${material.id}`}
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                查看详情
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Pencil className="h-4 w-4" />
                              编辑资料
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4" />
                              删除资料
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="font-semibold text-blue-700">
                          {formatPrice(Number(material.price))}
                        </span>
                        <span>
                          上传于：
                          {new Date(material.createdAt).toLocaleDateString(
                            "zh-CN"
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {getTags(material).length > 0 ? (
                          getTags(material).map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400">
                            暂无标签
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100">
              <Plus className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold">还没有上传资料</h3>
            <p className="mt-2 text-muted-foreground">
              发布第一份资料后，这里会显示审核状态和展示信息。
            </p>
            <Button asChild className="mt-6">
              <Link href="/upload">发布第一份资料</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
