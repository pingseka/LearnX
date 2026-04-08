"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Star, 
  Clock, 
  User, 
  Tag,
  Eye,
  ShoppingCart,
  Share2,
  Heart,
  CheckCircle2,
  FileIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PurchaseDialog } from "@/components/purchase-dialog"
import { 
  materials, 
  reviews, 
  getCategoryName, 
  formatPrice, 
  formatDate 
} from "@/lib/mock-data"

export default function MaterialDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false)
  const [isPurchased, setIsPurchased] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const material = materials.find((m) => m.id === params.id)

  if (!material) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">资料不存在</h1>
            <Button asChild>
              <Link href="/materials">返回资料列表</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const materialReviews = reviews.filter((r) => r.materialId === material.id)
  const relatedMaterials = materials
    .filter((m) => m.category === material.category && m.id !== material.id)
    .slice(0, 4)

  const handlePurchaseSuccess = () => {
    setIsPurchased(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border/40 bg-muted/30">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                首页
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link href="/materials" className="text-muted-foreground hover:text-foreground">
                资料市场
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground truncate max-w-[200px]">{material.title}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Material Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Info Card */}
              <Card className="overflow-hidden border-0">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Cover */}
                    <div className="md:w-64 shrink-0 aspect-[4/3] md:aspect-auto bg-muted flex items-center justify-center">
                      <FileText className="h-20 w-20 text-muted-foreground" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <Badge className="bg-primary border-0">
                            {getCategoryName(material.category)}
                          </Badge>
                          <h1 className="text-xl md:text-2xl font-bold leading-tight">
                            {material.title}
                          </h1>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`shrink-0 ${isLiked ? "text-red-500" : ""}`}
                          onClick={() => setIsLiked(!isLiked)}
                        >
                          <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                        </Button>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {material.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-foreground">{material.rating}</span>
                          <span>({material.reviewCount} 评价)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="h-4 w-4" />
                          <span>{material.salesCount} 人购买</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(material.createdAt)}</span>
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                          <FileIcon className="h-4 w-4 text-primary" />
                          <span className="uppercase font-medium">{material.fileType}</span>
                        </div>
                        <span className="text-muted-foreground">{material.pageCount} 页</span>
                        <span className="text-muted-foreground">{material.fileSize}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 space-x-8">
                  <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3"
                  >
                    资料介绍
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3"
                  >
                    内容预览
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3"
                  >
                    用户评价 ({materialReviews.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <Card className="border-0 shadow-none">
                    <CardContent className="p-6">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {material.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview" className="mt-6">
                  <Card className="border-0 shadow-none">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            预览前 3 页内容，购买后可查看完整资料
                          </p>
                          <Badge variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            预览
                          </Badge>
                        </div>
                        {/* Preview Pages */}
                        <div className="space-y-4">
                          {[1, 2, 3].map((page) => (
                            <div
                              key={page}
                              className="aspect-[4/5] bg-muted rounded-lg flex items-center justify-center border"
                            >
                              <div className="text-center text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>第 {page} 页预览</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-center py-8 bg-muted/50 rounded-xl">
                          <p className="text-muted-foreground mb-4">
                            剩余 {material.pageCount - 3} 页内容需购买后查看
                          </p>
                          <Button
                            onClick={() => setIsPurchaseOpen(true)}
                            className="bg-primary hover:bg-blue-600 transition-all duration-200 hover:scale-105"
                          >
                            立即购买查看完整内容
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card className="border-0 shadow-none">
                    <CardContent className="p-6">
                      {materialReviews.length > 0 ? (
                        <div className="space-y-6">
                          {materialReviews.map((review) => (
                            <div key={review.id} className="space-y-3">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={review.userAvatar} />
                                  <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{review.userName}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(review.createdAt)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-0.5 mt-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3.5 w-3.5 ${
                                          i < review.rating
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-muted-foreground/30"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <p className="text-muted-foreground text-sm pl-13">
                                {review.content}
                              </p>
                              <Separator />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          暂无评价，购买后可发表评价
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Purchase Card & Uploader */}
            <div className="space-y-6">
              {/* Purchase Card */}
              <Card className="border-0 shadow-none sticky top-24">
                <CardContent className="p-6 space-y-6">
                  {/* Price */}
                  <div className="text-center">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(material.price)}
                    </span>
                  </div>

                  {/* Actions */}
                  {isPurchased ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-green-600 py-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">已购买</span>
                      </div>
                      <Button className="w-full" size="lg">
                        <Download className="mr-2 h-4 w-4" />
                        下载资料
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-primary hover:bg-blue-600 transition-all duration-200 hover:scale-105"
                        size="lg"
                        onClick={() => setIsPurchaseOpen(true)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        立即购买
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        <Share2 className="mr-2 h-4 w-4" />
                        分享资料
                      </Button>
                    </div>
                  )}

                  <Separator />

                  {/* Benefits */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>购买后永久有效</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>支持下载离线查看</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>不满意可申请退款</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Uploader Card */}
              <Card className="border-0 shadow-none">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">上传者</h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={material.uploaderAvatar} />
                      <AvatarFallback className="bg-primary text-white">
                        {material.uploaderName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{material.uploaderName}</p>
                      <p className="text-sm text-muted-foreground">
                        {materials.filter((m) => m.uploaderId === material.uploaderId).length} 份资料
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Materials */}
          {relatedMaterials.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6">相关推荐</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedMaterials.map((m) => (
                  <Link key={m.id} href={`/materials/${m.id}`}>
                    <Card className="overflow-hidden border-0 transition-all duration-200 hover:scale-[1.02]">
                      <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-sm line-clamp-2 mb-2">{m.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">{formatPrice(m.price)}</span>
                          <span className="text-xs text-muted-foreground">{m.salesCount} 人购买</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Purchase Dialog */}
      <PurchaseDialog
        material={material}
        open={isPurchaseOpen}
        onOpenChange={setIsPurchaseOpen}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  )
}
