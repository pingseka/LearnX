"use client"

import { useEffect, useState } from "react"
import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
  XCircle,
} from "lucide-react"
import {
  approveMaterial,
  getPendingReviewMaterials,
  rejectMaterial,
  type Material,
} from "@/api/materials"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MaterialCover } from "@/components/material-cover"
import {
  formatPrice,
  getCategoryName,
  type Category,
} from "@/lib/mock-data"

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

function getAuthorName(material: Material) {
  return (
    material.author?.name ||
    material.author?.username ||
    material.author?.email ||
    "未知用户"
  )
}

export default function ReviewPage() {
  const { user } = useAuth()
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [reviewingId, setReviewingId] = useState<number | null>(null)

  const refresh = async () => {
    try {
      const result = await getPendingReviewMaterials()
      setMaterials(result.materials)
      setError("")
    } catch (err) {
      const message = err instanceof Error ? err.message : "审核列表加载失败"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleReview = async (
    materialId: number,
    action: "approve" | "reject"
  ) => {
    setReviewingId(materialId)
    try {
      if (action === "approve") {
        await approveMaterial(materialId)
      } else {
        await rejectMaterial(materialId)
      }
      setMaterials((currentMaterials) =>
        currentMaterials.filter((material) => material.id !== materialId)
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : "审核操作失败"
      setError(message)
    } finally {
      setReviewingId(null)
    }
  }

  if (user?.role !== "admin") {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-slate-400" />
          <h1 className="mt-4 text-xl font-semibold">需要管理员权限</h1>
          <p className="mt-2 text-sm text-slate-500">
            普通用户只能查看自己的资料，不能进入审核队列。
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">审核管理</h1>
        <p className="text-muted-foreground">
          审核用户上传的资料，通过后才会进入资料市场。
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Clock3 className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium">待审核资料</p>
              <p className="text-sm text-slate-500">
                当前共有 {materials.length} 份等待处理
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={refresh}>
            刷新
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="p-4 text-sm text-rose-700">
            {error}
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : materials.length > 0 ? (
        <div className="space-y-4">
          {materials.map((material) => {
            const category = asCategory(material.category)
            return (
              <Card key={material.id}>
                <CardContent className="p-4 md:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="h-36 w-full shrink-0 lg:w-48">
                      <MaterialCover
                        title={material.title}
                        category={category}
                        className="h-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap gap-2">
                        <Badge variant="outline">
                          {getCategoryName(category)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-amber-200 bg-amber-50 text-amber-700"
                        >
                          待审核
                        </Badge>
                      </div>
                      <h2 className="font-semibold text-slate-950">
                        {material.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                        {material.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                        <span>作者：{getAuthorName(material)}</span>
                        <span>定价：{formatPrice(Number(material.price))}</span>
                        <span>
                          上传：
                          {new Date(material.createdAt).toLocaleDateString(
                            "zh-CN"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 lg:w-32 lg:flex-col">
                      <Button
                        className="flex-1"
                        disabled={reviewingId === material.id}
                        onClick={() => handleReview(material.id, "approve")}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        通过
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        disabled={reviewingId === material.id}
                        onClick={() => handleReview(material.id, "reject")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        拒绝
                      </Button>
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
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <h2 className="mt-4 text-lg font-semibold">暂无待审核资料</h2>
            <p className="mt-2 text-sm text-slate-500">
              用户提交新资料后，会出现在这里。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
