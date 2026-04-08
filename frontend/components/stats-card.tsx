import { type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = "bg-primary"
}: StatsCardProps) {
  return (
    <Card className="border-0 shadow-none bg-white rounded-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl md:text-3xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <p className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-500"
              )}>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}% 较上月
              </p>
            )}
          </div>
          <div className={`h-12 w-12 rounded-lg ${color} flex items-center justify-center shrink-0`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
