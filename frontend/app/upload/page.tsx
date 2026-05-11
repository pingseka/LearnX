"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
  Upload as UploadIcon,
  X,
} from "lucide-react"
import { createMaterial } from "@/api/materials"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { MaterialCover } from "@/components/material-cover"
import { categories, formatPrice, type Category } from "@/lib/catalog"

const publishSteps = [
  { id: 1, name: "文件", description: "上传资料原件" },
  { id: 2, name: "信息", description: "完善检索信息" },
  { id: 3, name: "定价", description: "设置收益规则" },
  { id: 4, name: "确认", description: "提交平台审核" },
]

const pricePresets = ["5.9", "9.9", "19.9", "29.9", "49.9"]

const reviewRules = [
  "平台会先做基础审核，审核通过后资料才会展示。",
  "沙盒阶段只记录订单和收益流水，不发起真实打款。",
  "后续接入真实支付前，需要补齐主体资质、结算和税务流程。",
]

function isValidPrice(value: string) {
  const price = Number(value)
  return Number.isFinite(price) && price >= 0.1 && price <= 999
}

function formatFileSize(file: File | null) {
  if (!file) return "未选择文件"
  if (file.size < 1024 * 1024) {
    return `${(file.size / 1024).toFixed(1)} KB`
  }
  return `${(file.size / (1024 * 1024)).toFixed(1)} MB`
}

function buildLocalDescription(title: string, categoryName: string) {
  return [
    `${title}，适用于考研${categoryName}复习场景。`,
    "内容围绕核心考点、易错点和复习顺序整理，适合冲刺复盘和查漏补缺。",
    "建议结合真题或课堂笔记使用，能帮助用户更快判断资料是否适合自己。",
  ].join("")
}

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<Category>("politics")
  const [tags, setTags] = useState<string[]>([])
  const [tagDraft, setTagDraft] = useState("")
  const [price, setPrice] = useState("9.9")
  const [hasAgreed, setHasAgreed] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [aiError, setAiError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const selectedCategory = categories.find((item) => item.id === category)
  const selectedCategoryName = selectedCategory?.name ?? "政治"
  const priceNumber = Number(price) || 0
  const platformFee = priceNumber * 0.1
  const authorIncome = priceNumber * 0.9
  const progressPercent = (currentStep / publishSteps.length) * 100

  const canProceed = () => {
    if (currentStep === 1) return Boolean(file)
    if (currentStep === 2) {
      return title.trim().length > 0 && description.trim().length > 0
    }
    if (currentStep === 3) return isValidPrice(price)
    return hasAgreed
  }

  const handleNext = () => {
    if (currentStep < publishSteps.length && canProceed()) {
      setCurrentStep((step) => step + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1)
    }
  }

  const handleGenerateDescription = async () => {
    if (!title.trim() || isGenerating) return

    setIsGenerating(true)
    setAiError("")

    try {
      const response = await fetch(
        "http://localhost:3001/api/ai/generate-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            category,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("AI 描述生成失败")
      }

      const data = await response.json()
      const generated = data?.data?.description

      if (typeof generated !== "string" || !generated.trim()) {
        throw new Error("AI 描述为空")
      }

      setDescription(generated)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "AI 描述生成失败"
      setAiError(message)
      setDescription(buildLocalDescription(title, selectedCategoryName))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddTag = () => {
    const nextTag = tagDraft.trim()
    if (!nextTag || tags.includes(nextTag) || tags.length >= 5) return

    setTags((currentTags) => [...currentTags, nextTag])
    setTagDraft("")
  }

  const handleRemoveTag = (tag: string) => {
    setTags((currentTags) =>
      currentTags.filter((currentTag) => currentTag !== tag)
    )
  }

  const handleSubmit = async () => {
    if (!file || !canProceed()) return

    setIsSubmitting(true)
    setSubmitError("")

    try {
      await createMaterial({
        title: title.trim(),
        description: description.trim(),
        category,
        price: priceNumber,
        tags,
        file,
      })
      setIsSuccess(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : "发布失败"
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <section className="w-full max-w-xl rounded-lg border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-950">
              资料已提交审核
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              审核通过后，用户可以在资料市场中看到这份资料。沙盒阶段会记录收益流水，
              不会发起真实提现打款。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href="/dashboard/materials">查看我的资料</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/materials">浏览资料市场</Link>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <section className="border-b bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                  <Link href="/" className="hover:text-slate-950">
                    首页
                  </Link>
                  <span>/</span>
                  <span>发布资料</span>
                </div>
                <h1 className="text-2xl font-semibold text-slate-950">
                  发布考研资料
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  按文件、信息、定价和确认四步提交资料。页面会先完成沙盒发布流程，
                  真实支付和作者提现后续单独接入。
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/dashboard/materials">我的资料</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <section className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <ol className="grid gap-3 md:grid-cols-4">
                  {publishSteps.map((step) => {
                    const isActive = currentStep === step.id
                    const isDone = currentStep > step.id

                    return (
                      <li
                        key={step.id}
                        className={`rounded-md border p-3 ${
                          isActive
                            ? "border-blue-600 bg-blue-50"
                            : isDone
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                              isDone
                                ? "bg-emerald-600 text-white"
                                : isActive
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {isDone ? <Check className="h-4 w-4" /> : step.id}
                          </span>
                          <span className="font-medium text-slate-950">
                            {step.name}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                          {step.description}
                        </p>
                      </li>
                    )
                  })}
                </ol>
              </section>

              <Card className="rounded-lg border shadow-sm">
                <CardContent className="p-5 md:p-6">
                  {currentStep === 1 && (
                    <section className="space-y-5">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-950">
                          上传资料文件
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                          支持 PDF、DOC、DOCX 文件，单个文件最大 50MB。
                        </p>
                      </div>

                      <FileUpload
                        accept=".pdf,.doc,.docx"
                        maxSize={50}
                        onFileSelect={setFile}
                      />

                      <Alert className="border-blue-200 bg-blue-50 text-blue-950">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          请确认资料来源合法。比如你上传自己的政治笔记可以；
                          直接上传他人付费课程讲义不可以。
                        </AlertDescription>
                      </Alert>
                    </section>
                  )}

                  {currentStep === 2 && (
                    <section className="space-y-5">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-950">
                          完善资料信息
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                          标题、描述和分类会直接影响用户搜索和购买判断。
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">资料标题 *</Label>
                        <Input
                          id="title"
                          maxLength={60}
                          placeholder="例如：2026考研政治马原核心考点笔记"
                          value={title}
                          onChange={(event) => setTitle(event.target.value)}
                        />
                        <p className="text-right text-xs text-slate-500">
                          {title.length}/60
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <Label htmlFor="description">资料描述 *</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={!title.trim() || isGenerating}
                            onClick={handleGenerateDescription}
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                生成中...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                AI 生成
                              </>
                            )}
                          </Button>
                        </div>
                        <Textarea
                          id="description"
                          maxLength={500}
                          rows={5}
                          placeholder="说明资料覆盖范围、适用阶段、使用建议和亮点。"
                          value={description}
                          onChange={(event) =>
                            setDescription(event.target.value)
                          }
                        />
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs text-slate-500">
                            {aiError || "建议写清楚适合基础、强化还是冲刺。"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {description.length}/500
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>资料分类 *</Label>
                        <RadioGroup
                          value={category}
                          onValueChange={(value) =>
                            setCategory(value as Category)
                          }
                          className="grid gap-3 sm:grid-cols-2"
                        >
                          {categories.map((item) => (
                            <div key={item.id}>
                              <RadioGroupItem
                                value={item.id}
                                id={item.id}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={item.id}
                                className="flex min-h-20 cursor-pointer items-center gap-3 rounded-md border bg-white p-4 transition-colors peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50"
                              >
                                <span
                                  className={`flex h-10 w-10 items-center justify-center rounded-md ${item.color}`}
                                >
                                  <FileText className="h-5 w-5 text-white" />
                                </span>
                                <span>
                                  <span className="block font-medium text-slate-950">
                                    {item.name}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    已收录 {item.count} 份
                                  </span>
                                </span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tagDraft">标签</Label>
                        <div className="flex gap-2">
                          <Input
                            id="tagDraft"
                            placeholder="输入一个标签，例如：马原"
                            value={tagDraft}
                            onChange={(event) =>
                              setTagDraft(event.target.value)
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault()
                                handleAddTag()
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={!tagDraft.trim() || tags.length >= 5}
                            onClick={handleAddTag}
                          >
                            添加
                          </Button>
                        </div>
                        <div className="flex min-h-7 flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                              <button
                                type="button"
                                aria-label={`删除标签 ${tag}`}
                                className="ml-1 rounded-full hover:text-rose-600"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          {tags.length === 0 && (
                            <span className="text-xs text-slate-500">
                              最多添加 5 个标签。
                            </span>
                          )}
                        </div>
                      </div>
                    </section>
                  )}

                  {currentStep === 3 && (
                    <section className="space-y-5">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-950">
                          设置价格和收益
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                          当前是沙盒结算模型：平台服务费 10%，作者收益 90%。
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">资料定价（元）</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            ¥
                          </span>
                          <Input
                            id="price"
                            type="number"
                            min="0.1"
                            max="999"
                            step="0.1"
                            className="h-12 pl-8 text-lg font-semibold"
                            value={price}
                            onChange={(event) => setPrice(event.target.value)}
                          />
                        </div>
                        <p className="text-xs text-slate-500">
                          允许范围：0.1 元到 999 元。
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {pricePresets.map((item) => (
                          <Button
                            key={item}
                            type="button"
                            variant={price === item ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPrice(item)}
                          >
                            ¥{item}
                          </Button>
                        ))}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-md border bg-white p-4">
                          <p className="text-sm text-slate-500">用户支付</p>
                          <p className="mt-2 text-xl font-semibold text-slate-950">
                            {formatPrice(priceNumber)}
                          </p>
                        </div>
                        <div className="rounded-md border bg-white p-4">
                          <p className="text-sm text-slate-500">平台服务费</p>
                          <p className="mt-2 text-xl font-semibold text-rose-600">
                            {formatPrice(platformFee)}
                          </p>
                        </div>
                        <div className="rounded-md border bg-white p-4">
                          <p className="text-sm text-slate-500">作者收益</p>
                          <p className="mt-2 text-xl font-semibold text-emerald-600">
                            {formatPrice(authorIncome)}
                          </p>
                        </div>
                      </div>

                      <Alert className="border-amber-200 bg-amber-50 text-amber-950">
                        <CircleDollarSign className="h-4 w-4" />
                        <AlertDescription>
                          例如一份资料定价 19.90 元，沙盒流水会记录平台服务费 1.99 元，
                          作者收益 17.91 元；真实提现需要后续接支付和结算能力。
                        </AlertDescription>
                      </Alert>
                    </section>
                  )}

                  {currentStep === 4 && (
                    <section className="space-y-5">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-950">
                          确认发布信息
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                          提交后进入审核流程，审核通过后才展示给用户。
                        </p>
                      </div>

                      <div className="rounded-lg border bg-slate-50 p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-24 shrink-0">
                            <MaterialCover
                              title={title}
                              category={category}
                              fileType={
                                file?.name.split(".").pop()?.toUpperCase() ||
                                "PDF"
                              }
                              size="sm"
                              className="min-h-24"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-slate-950">
                              {file?.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {formatFileSize(file)} · {selectedCategoryName}
                            </p>
                          </div>
                        </div>
                      </div>

                      <dl className="divide-y rounded-lg border bg-white">
                        <div className="grid gap-2 p-4 sm:grid-cols-[120px_1fr]">
                          <dt className="text-sm text-slate-500">标题</dt>
                          <dd className="text-sm font-medium text-slate-950">
                            {title}
                          </dd>
                        </div>
                        <div className="grid gap-2 p-4 sm:grid-cols-[120px_1fr]">
                          <dt className="text-sm text-slate-500">描述</dt>
                          <dd className="text-sm leading-6 text-slate-700">
                            {description}
                          </dd>
                        </div>
                        <div className="grid gap-2 p-4 sm:grid-cols-[120px_1fr]">
                          <dt className="text-sm text-slate-500">标签</dt>
                          <dd className="flex flex-wrap gap-2">
                            {tags.length > 0 ? (
                              tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                  {tag}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-slate-500">
                                未填写
                              </span>
                            )}
                          </dd>
                        </div>
                        <div className="grid gap-2 p-4 sm:grid-cols-[120px_1fr]">
                          <dt className="text-sm text-slate-500">定价</dt>
                          <dd className="font-semibold text-blue-700">
                            {formatPrice(priceNumber)}
                          </dd>
                        </div>
                      </dl>

                      <div className="flex items-start gap-3 rounded-lg border bg-white p-4">
                        <Checkbox
                          id="agreement"
                          checked={hasAgreed}
                          onCheckedChange={(value) =>
                            setHasAgreed(value === true)
                          }
                        />
                        <Label
                          htmlFor="agreement"
                          className="text-sm leading-6 text-slate-700"
                        >
                          我确认拥有该资料的上传和分享权限，内容不包含侵权、违法或泄露隐私的信息。
                        </Label>
                      </div>

                      {submitError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{submitError}</AlertDescription>
                        </Alert>
                      )}
                    </section>
                  )}

                  <div className="mt-8 flex items-center justify-between border-t pt-5">
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={currentStep === 1 || isSubmitting}
                      onClick={handlePrev}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      上一步
                    </Button>

                    {currentStep < publishSteps.length ? (
                      <Button
                        type="button"
                        disabled={!canProceed()}
                        onClick={handleNext}
                      >
                        下一步
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={!canProceed() || isSubmitting}
                        onClick={handleSubmit}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            提交中...
                          </>
                        ) : (
                          <>
                            <UploadIcon className="mr-2 h-4 w-4" />
                            提交审核
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-4">
              <section className="rounded-lg border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <h2 className="font-semibold text-slate-950">审核规则</h2>
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  {reviewRules.map((rule) => (
                    <li key={rule} className="flex gap-2">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-lg border bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-950">发布预览</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500">文件</p>
                    <p className="mt-1 truncate text-sm font-medium text-slate-950">
                      {file?.name || "尚未上传"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">标题</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">
                      {title || "尚未填写"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">分类与价格</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <Badge variant="outline">{selectedCategoryName}</Badge>
                      <span className="font-semibold text-blue-700">
                        {formatPrice(priceNumber)}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">预计每笔收益</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-600">
                      {formatPrice(authorIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs text-slate-500">资料展位图</p>
                    <MaterialCover
                      title={title}
                      category={category}
                      fileType={
                        file?.name.split(".").pop()?.toUpperCase() || "PDF"
                      }
                      className="aspect-[4/3] min-h-0"
                    />
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
