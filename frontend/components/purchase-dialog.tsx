"use client"

import { useState } from "react"
import { Check, CreditCard, Wallet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { type Material, formatPrice } from "@/lib/mock-data"

interface PurchaseDialogProps {
  material: Material
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PurchaseDialog({ material, open, onOpenChange, onSuccess }: PurchaseDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("alipay")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePurchase = async () => {
    setIsProcessing(true)
    // 模拟支付过程
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsProcessing(false)
    setIsSuccess(true)
    // 延迟关闭并触发成功回调
    setTimeout(() => {
      setIsSuccess(false)
      onOpenChange(false)
      onSuccess()
    }, 1500)
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
              资料已添加到您的已购列表，可随时下载查看
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
          <DialogDescription>请选择支付方式完成购买</DialogDescription>
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

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label>支付方式</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
              <div className="flex items-center space-x-3 border rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="alipay" id="alipay" />
                <Label htmlFor="alipay" className="flex-1 cursor-pointer flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-white" />
                  </div>
                  <span>支付宝</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 border rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="wechat" id="wechat" />
                <Label htmlFor="wechat" className="flex-1 cursor-pointer flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-500 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <span>微信支付</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Notice */}
          <p className="text-xs text-muted-foreground">
            点击"立即支付"即表示您同意《用户购买协议》，购买后可在个人中心查看和下载资料。
          </p>
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
              `立即支付 ${formatPrice(material.price)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
