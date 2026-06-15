"use client"

import { useState } from "react"
import { Check, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createOrder } from "@/api/orders"
import { formatPrice } from "@/lib/catalog"

interface PurchaseMaterial {
  id: number
  title: string
  price: number
}

interface PurchaseDialogProps {
  material: PurchaseMaterial
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PurchaseDialog({ material, open, onOpenChange, onSuccess }: PurchaseDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handlePurchase = async () => {
    setIsProcessing(true)
    setError("")

    try {
      await createOrder({
        materials: [{ materialId: material.id, quantity: 1 }],
      })
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onOpenChange(false)
        onSuccess()
      }, 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : "购买失败")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">支付成功</h3>
            <p className="text-muted-foreground text-center">
              订单已完成，可在个人中心查看订单并下载资料。
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>确认购买</DialogTitle>
          <DialogDescription>
            课程演示环境会完成订单并同步更新作者收益
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Info */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-2">
            <h4 className="font-medium line-clamp-2">{material.title}</h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">资料价格</span>
              <span className="font-bold text-lg text-primary">
                {formatPrice(material.price)}
              </span>
            </div>
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm leading-6 text-blue-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              当前课程项目无需提前充值。点击确认支付后，系统会生成已完成订单，并按 90% 记录作者收益。
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="bg-primary hover:bg-blue-600"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                支付中...
              </>
            ) : (
              `确认支付 ${formatPrice(material.price)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
