'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Heart,
  Loader2,
  Share2,
  ShoppingCart,
  User,
} from 'lucide-react';
import { getAssetUrl } from '@/api';
import { getMaterialById, type Material } from '@/api/materials';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MaterialCover } from '@/components/material-cover';
import { PurchaseDialog } from '@/components/purchase-dialog';

const categoryNames: Record<string, string> = {
  politics: '政治',
  english: '英语',
  math: '数学',
  professional: '专业课',
  other: '其他',
};

const statusText: Record<string, string> = {
  pending: '待审核',
  approved: '已上架',
  rejected: '已拒绝',
};

function formatPrice(price: number) {
  return price === 0 ? '免费' : `¥${Number(price).toFixed(2)}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN');
}

function getFileType(fileUrl: string) {
  const cleanUrl = fileUrl.split('?')[0];
  const ext = cleanUrl.split('.').pop();
  return ext ? ext.toUpperCase() : 'FILE';
}

function isPdf(fileUrl: string) {
  return fileUrl.toLowerCase().split('?')[0].endsWith('.pdf');
}

export default function MaterialDetailPage() {
  const params = useParams();
  const materialId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadMaterial() {
      if (!materialId) {
        setError('资料不存在');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getMaterialById(Number(materialId));
        if (!ignore) {
          setMaterial(data);
          setError('');
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : '资料加载失败');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMaterial();

    return () => {
      ignore = true;
    };
  }, [materialId]);

  const fileUrl = useMemo(
    () => getAssetUrl(material?.fileUrl),
    [material?.fileUrl]
  );

  const authorName =
    material?.author?.name || material?.author?.username || material?.author?.email || '资料作者';

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            正在加载资料...
          </div>
        </main>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="text-center">
            <h1 className="mb-3 text-2xl font-bold">资料加载失败</h1>
            <p className="mb-6 text-muted-foreground">{error || '资料不存在'}</p>
            <Button asChild>
              <Link href="/materials">返回资料市场</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="border-b border-border/40 bg-muted/30">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/materials"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                返回资料市场
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="max-w-[240px] truncate text-foreground">
                {material.title}
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <Card className="overflow-hidden border">
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col gap-6 xl:flex-row">
                    <div className="w-full shrink-0 xl:w-72">
                      <MaterialCover
                        title={material.title}
                        category={material.category}
                        fileType={getFileType(material.fileUrl)}
                        size="lg"
                        className="h-64 w-full rounded-lg xl:h-80"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-6">
                      <div className="space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <Badge>
                                {categoryNames[material.category] || material.category}
                              </Badge>
                              {material.status && (
                                <Badge variant="outline">
                                  {statusText[material.status] || material.status}
                                </Badge>
                              )}
                              <Badge variant="secondary">
                                {getFileType(material.fileUrl)}
                              </Badge>
                            </div>
                            <h1 className="break-words text-2xl font-bold leading-tight md:text-3xl">
                              {material.title}
                            </h1>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`shrink-0 ${isLiked ? 'text-red-500' : ''}`}
                            onClick={() => setIsLiked(!isLiked)}
                          >
                            <Heart
                              className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
                            />
                          </Button>
                        </div>

                        <p className="max-w-3xl leading-7 text-muted-foreground">
                          {material.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {material.tags?.length ? (
                            material.tags.map((tag) => (
                              <Badge key={tag.id} variant="secondary">
                                {tag.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">暂无标签</span>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                        <div className="rounded-lg bg-muted/60 p-3">
                          <div className="text-xs">文件类型</div>
                          <div className="mt-1 font-medium text-foreground">
                            {getFileType(material.fileUrl)}
                          </div>
                        </div>
                        <div className="rounded-lg bg-muted/60 p-3">
                          <div className="text-xs">发布时间</div>
                          <div className="mt-1 font-medium text-foreground">
                            {formatDate(material.createdAt)}
                          </div>
                        </div>
                        <div className="rounded-lg bg-muted/60 p-3">
                          <div className="text-xs">作者</div>
                          <div className="mt-1 truncate font-medium text-foreground">
                            {authorName}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid h-auto w-full grid-cols-2 rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="preview"
                    className="h-12 rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 shadow-none focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-0 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    内容预览
                  </TabsTrigger>
                  <TabsTrigger
                    value="description"
                    className="h-12 rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 shadow-none focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-0 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    资料介绍
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="mt-6">
                  <Card className="border">
                    <CardContent className="p-4 md:p-6">
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="font-semibold">文件内容</h2>
                          <p className="mt-1 text-sm text-muted-foreground">
                            PDF 可直接预览，Word 文件需要下载后查看。
                          </p>
                        </div>
                        {fileUrl && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={fileUrl} target="_blank" rel="noreferrer">
                                <Eye className="mr-2 h-4 w-4" />
                                新窗口查看
                              </a>
                            </Button>
                            <Button size="sm" asChild>
                              <a href={fileUrl} download>
                                <Download className="mr-2 h-4 w-4" />
                                下载文件
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>

                      {fileUrl && isPdf(material.fileUrl) ? (
                        <div className="overflow-hidden rounded-lg border bg-muted">
                          <iframe
                            src={`${fileUrl}#toolbar=1&navpanes=0`}
                            title={`${material.title} 内容预览`}
                            className="h-[72vh] min-h-[520px] w-full bg-white"
                          />
                        </div>
                      ) : (
                        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border bg-muted/40 px-6 text-center">
                          <FileText className="mb-4 h-14 w-14 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">当前格式暂不支持网页内预览</h3>
                          <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            例如 DOC、DOCX 文件，浏览器无法像 PDF 一样直接展示内容。
                            请点击下载文件后用本地软件打开。
                          </p>
                          {fileUrl && (
                            <Button className="mt-5" asChild>
                              <a href={fileUrl} download>
                                <Download className="mr-2 h-4 w-4" />
                                下载后查看
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="description" className="mt-6">
                  <Card className="border">
                    <CardContent className="p-6">
                      <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
                        {material.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <aside className="space-y-6">
              <Card className="sticky top-24 border">
                <CardContent className="space-y-6 p-6">
                  <div>
                    <div className="text-sm text-muted-foreground">资料价格</div>
                    <div className="mt-1 text-3xl font-bold text-primary">
                      {formatPrice(material.price)}
                    </div>
                  </div>

                  {isPurchased ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-green-700">
                        <CheckCircle2 className="h-5 w-5" />
                        已购买，可查看完整资料
                      </div>
                      {fileUrl && (
                        <Button className="w-full" asChild>
                          <a href={fileUrl} download>
                            <Download className="mr-2 h-4 w-4" />
                            下载资料
                          </a>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        className="w-full"
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

                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      购买后可下载原文件
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      平台审核通过后公开展示
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      支持 PDF 在线预览
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border">
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold">上传者</h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-white">
                        {authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{authorName}</p>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        LearnX 创作者
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <PurchaseDialog
        material={material}
        open={isPurchaseOpen}
        onOpenChange={setIsPurchaseOpen}
        onSuccess={() => setIsPurchased(true)}
      />
    </div>
  );
}
