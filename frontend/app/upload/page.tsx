"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  FileText, 
  Info, 
  Sparkles,
  Upload as UploadIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FileUpload } from "@/components/file-upload"
import { categories, type Category, formatPrice } from "@/lib/mock-data"

const steps = [
  { id: 1, name: "上传文件" },
  { id: 2, name: "填写信息" },
  { id: 3, name: "设置价格" },
  { id: 4, name: "确认发布" },
]

export default function UploadPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form state
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<Category>("politics")
  const [tags, setTags] = useState("")
  const [price, setPrice] = useState("9.9")

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return file !== null
      case 2:
        return title.trim().length > 0 && description.trim().length > 0
      case 3:
        return parseFloat(price) >= 0.1 && parseFloat(price) <= 999
      default:
        return true
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // 模拟提交过程
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const priceNum = parseFloat(price) || 0
  const platformFee = priceNum * 0.1
  const earnings = priceNum * 0.9

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-0">
            <CardContent className="p-8 text-center">
              <div className="h-20 w-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">资料发布成功</h2>
              <p className="text-muted-foreground mb-6">
                您的资料已成功发布，审核通过后将在市场展示
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild className="bg-primary hover:bg-blue-600">
                  <Link href="/dashboard/materials">查看我的资料</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/materials">浏览资料市场</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-primary py-12 relative overflow-hidden">
          <div className="absolute top-4 right-12 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute bottom-2 left-8 w-16 h-16 rounded bg-white/5 rotate-12" />
          <div className="absolute top-1/2 right-1/3 w-10 h-10 rounded-full bg-white/5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
              <Link href="/" className="hover:text-white">首页</Link>
              <span>/</span>
              <span>上传资料</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">上传资料</h1>
            <p className="text-white/90">分享你的考研资料，帮助更多学子，同时获取收益</p>
          </div>
        </div>

        {/* Steps */}
        <div className="border-b border-border/40 bg-background">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex justify-center">
              <ol className="flex items-center gap-2 md:gap-4">
                {steps.map((step, index) => (
                  <li key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full transition-colors ${
                        currentStep === step.id
                          ? "bg-primary text-white"
                          : currentStep > step.id
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{step.id}</span>
                      )}
                      <span className="text-sm font-medium hidden md:inline">{step.name}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-8 md:w-12 h-0.5 bg-muted mx-2" />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>

        {/* Form Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0">
              <CardContent className="p-6 md:p-8">
                {/* Step 1: Upload File */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-2">上传资料文件</h2>
                      <p className="text-muted-foreground">选择你要分享的考研资料文件</p>
                    </div>
                    <FileUpload onFileSelect={setFile} />
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">上传须知</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-600">
                          <li>仅支持 PDF、Word 格式文件</li>
                          <li>文件大小不超过 50MB</li>
                          <li>请确保资料内容原创或有分享权限</li>
                          <li>禁止上传违规、侵权内容</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Fill Info */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-2">填写资料信息</h2>
                      <p className="text-muted-foreground">完善资料信息，让用户更好地了解你的资料</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">资料标题 *</Label>
                        <Input
                          id="title"
                          placeholder="例如：2025考研政治冲刺笔记"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          maxLength={50}
                        />
                        <p className="text-xs text-muted-foreground text-right">{title.length}/50</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">资料描述 *</Label>
                        <Textarea
                          id="description"
                          placeholder="详细介绍你的资料内容、特点、适用人群等..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                          maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground text-right">{description.length}/500</p>
                      </div>

                      <div className="space-y-2">
                        <Label>资料分类 *</Label>
                        <RadioGroup
                          value={category}
                          onValueChange={(v) => setCategory(v as Category)}
                          className="grid grid-cols-2 gap-3"
                        >
                          {categories.map((cat) => (
                            <div key={cat.id}>
                              <RadioGroupItem
                                value={cat.id}
                                id={cat.id}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={cat.id}
                                className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50"
                              >
                                <div className={`h-10 w-10 rounded-lg ${cat.color} flex items-center justify-center`}>
                                  <FileText className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-medium">{cat.name}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">标签（用空格分隔）</Label>
                        <Input
                          id="tags"
                          placeholder="例如：马原 冲刺 精华笔记"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">添加标签帮助用户更容易找到你的资料</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Set Price */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-2">设置价格</h2>
                      <p className="text-muted-foreground">为你的资料设定一个合理的价格</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">资料定价（元）</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">¥</span>
                          <Input
                            id="price"
                            type="number"
                            min="0.1"
                            max="999"
                            step="0.1"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="pl-8 text-2xl font-bold h-14"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">价格范围：0.1 - 999 元</p>
                      </div>

                      {/* Price Suggestions */}
                      <div className="flex flex-wrap gap-2">
                        {[5.9, 9.9, 19.9, 29.9, 49.9].map((p) => (
                          <Button
                            key={p}
                            type="button"
                            variant={price === String(p) ? "default" : "outline"}
                            size="sm"
                            className={`rounded-full ${price === String(p) ? "bg-primary" : ""}`}
                            onClick={() => setPrice(String(p))}
                          >
                            ¥{p}
                          </Button>
                        ))}
                      </div>

                      {/* Earnings Preview */}
                      <div className="p-6 bg-blue-50 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          <span className="font-semibold">收益预览</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">资料定价</span>
                            <span>{formatPrice(priceNum)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">平台服务费（10%）</span>
                            <span className="text-red-500">-{formatPrice(platformFee)}</span>
                          </div>
                          <div className="border-t border-blue-200 pt-3 flex justify-between">
                            <span className="font-medium">每笔收益</span>
                            <span className="text-xl font-bold text-primary">
                              {formatPrice(earnings)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirm */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-2">确认发布</h2>
                      <p className="text-muted-foreground">请确认以下信息无误后提交</p>
                    </div>

                    <div className="space-y-4">
                      {/* File Info */}
                      <div className="p-4 bg-muted/50 rounded-xl flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {file && `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                          </p>
                        </div>
                      </div>

                      {/* Info Summary */}
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">资料标题</span>
                          <span className="font-medium text-right max-w-[60%] truncate">{title}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">资料分类</span>
                          <Badge className="bg-primary">
                            {categories.find((c) => c.id === category)?.name}
                          </Badge>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">标签</span>
                          <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                            {tags.split(" ").filter(Boolean).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">定价</span>
                          <span className="font-bold text-lg text-primary">
                            {formatPrice(priceNum)}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">每笔收益</span>
                          <span className="font-bold text-green-600">{formatPrice(earnings)}</span>
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="p-4 bg-amber-50 rounded-xl text-sm text-amber-700">
                        <p>
                          点击"发布资料"即表示您已阅读并同意《资料上传协议》，确认上传内容不侵犯他人权益且符合平台规范。
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    上一步
                  </Button>

                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="gap-2 bg-primary hover:bg-blue-600 transition-all duration-200 hover:scale-105"
                    >
                      下一步
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="gap-2 bg-primary hover:bg-blue-600 transition-all duration-200 hover:scale-105"
                    >
                      {isSubmitting? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          发布中...
                        </>
                      ) : (
                        <>
                          <UploadIcon className="h-4 w-4" />
                          发布资料
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
