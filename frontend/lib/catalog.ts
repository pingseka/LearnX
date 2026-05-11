export type Category = 'politics' | 'english' | 'math' | 'professional'

export const categories: {
  id: Category
  name: string
  icon: string
  color: string
  count: number
}[] = [
  { id: 'politics', name: '政治', icon: 'BookOpen', color: 'bg-red-500', count: 0 },
  { id: 'english', name: '英语', icon: 'Globe', color: 'bg-blue-500', count: 0 },
  { id: 'math', name: '数学', icon: 'Calculator', color: 'bg-emerald-500', count: 0 },
  {
    id: 'professional',
    name: '专业课',
    icon: 'GraduationCap',
    color: 'bg-amber-500',
    count: 0,
  },
]

export function getCategoryName(category: string): string {
  return categories.find((item) => item.id === category)?.name || '其他'
}

export function formatPrice(price: number | string | null | undefined): string {
  const amount = Number(price || 0)
  return amount === 0 ? '免费' : `¥${amount.toFixed(2)}`
}

export function formatCurrency(price: number | string | null | undefined): string {
  return `¥${Number(price || 0).toFixed(2)}`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN')
}
