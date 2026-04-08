"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Plus, 
  FileText, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Eye,
  EyeOff,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getMyMaterials } from "@/api/materials"
import { userMaterials, getCategoryName, formatPrice, formatDate } from "@/lib/mock-data"

export default function MyMaterialsPage() {
  const [materials, setMaterials] = useState(userMaterials)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        await getMyMaterials()
      } catch {
        // Keep mock data as fallback
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id))
    setDeleteId(null)
  }

  const handleToggleVisibility = (id: string) => {
    // 模拟下架/上架操作
    setMaterials(
      materials.map((m) =>
        m.id === id ? { ...m, salesCount: m.salesCount === 0 ? 100 : 0 } : m
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">我的资料</h1>
          <p className="text-muted-foreground">管理你上传的所有资料</p>
        </div>
        <Button asChild className="self-start bg-primary hover:bg-blue-600 transition-all duration-200 hover:scale-105">
          <Link href="/upload" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            上传新资料
          </Link>
        </Button>
      </div>

      {/* Materials List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : materials.length > 0 ? (
        <div className="space-y-4">
          {materials.map((material) => (
            <Card key={material.id} className="border-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Cover */}
                  <div className="w-full md:w-32 h-24 md:h-24 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge className="mb-2 bg-primary border-0">
                          {getCategoryName(material.category)}
                        </Badge>
                        <h3 className="font-semibold line-clamp-2">{material.title}</h3>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/materials/${material.id}`} className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              查看详情
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Pencil className="h-4 w-4" />
                            编辑资料
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="flex items-center gap-2"
                            onClick={() => handleToggleVisibility(material.id)}
                          >
                            <EyeOff className="h-4 w-4" />
                            下架资料
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="flex items-center gap-2 text-destructive focus:text-destructive"
                            onClick={() => setDeleteId(material.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            删除资料
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{formatPrice(material.price)}</span>
                      <span>销量: {material.salesCount}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{material.rating}</span>
                      </div>
                      <span>上传于: {formatDate(material.createdAt)}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {material.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0">
          <CardContent className="p-12 text-center">
            <div className="h-20 w-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">暂无资料</h3>
            <p className="text-muted-foreground mb-6">你还没有上传任何资料，开始分享你的考研笔记吧</p>
            <Button asChild className="bg-primary hover:bg-blue-600">
              <Link href="/upload" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                上传第一份资料
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              删除后资料将无法恢复，已购买的用户仍可下载。确定要删除这份资料吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
