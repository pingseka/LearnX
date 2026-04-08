// 类型定义
export type Category = 'politics' | 'english' | 'math' | 'professional'

export interface User {
  id: string
  name: string
  avatar: string
  email: string
  balance: number
  totalEarnings: number
  totalWithdrawn: number
}

export interface Material {
  id: string
  title: string
  description: string
  category: Category
  price: number
  coverUrl: string
  fileType: 'pdf' | 'docx'
  pageCount: number
  fileSize: string
  uploaderId: string
  uploaderName: string
  uploaderAvatar: string
  salesCount: number
  rating: number
  reviewCount: number
  createdAt: string
  tags: string[]
}

export interface Order {
  id: string
  materialId: string
  materialTitle: string
  materialCover: string
  price: number
  status: 'pending' | 'completed' | 'refunded'
  createdAt: string
  sellerName: string
}

export interface Earning {
  id: string
  orderId: string
  materialId: string
  materialTitle: string
  buyerName: string
  originalAmount: number
  platformFee: number
  netAmount: number
  createdAt: string
}

export interface Withdrawal {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'rejected'
  createdAt: string
  completedAt?: string
  bankInfo: string
}

export interface Review {
  id: string
  materialId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  content: string
  createdAt: string
}

// 分类配置
export const categories: { id: Category; name: string; icon: string; color: string; count: number }[] = [
  { id: 'politics', name: '政治', icon: 'BookOpen', color: 'bg-red-500', count: 1256 },
  { id: 'english', name: '英语', icon: 'Globe', color: 'bg-blue-500', count: 2341 },
  { id: 'math', name: '数学', icon: 'Calculator', color: 'bg-emerald-500', count: 1893 },
  { id: 'professional', name: '专业课', icon: 'GraduationCap', color: 'bg-amber-500', count: 3567 },
]

// 当前登录用户
export const currentUser: User = {
  id: 'user-001',
  name: '张同学',
  avatar: '/avatars/user-1.jpg',
  email: 'zhangsan@example.com',
  balance: 2580.50,
  totalEarnings: 12680.00,
  totalWithdrawn: 10000.00,
}

// 模拟资料数据
export const materials: Material[] = [
  {
    id: 'mat-001',
    title: '2025考研政治冲刺笔记-马原理论精华版',
    description: '浓缩马克思主义基本原理核心考点，配合历年真题解析，助你轻松应对政治大题。本资料包含思维导图、重点标注、易错点总结，适合考前冲刺复习使用。',
    category: 'politics',
    price: 19.90,
    coverUrl: '/covers/politics-1.jpg',
    fileType: 'pdf',
    pageCount: 68,
    fileSize: '15.2 MB',
    uploaderId: 'user-002',
    uploaderName: '考研政治王老师',
    uploaderAvatar: '/avatars/user-2.jpg',
    salesCount: 1256,
    rating: 4.8,
    reviewCount: 328,
    createdAt: '2024-09-15',
    tags: ['马原', '冲刺', '精华笔记'],
  },
  {
    id: 'mat-002',
    title: '考研英语一阅读理解技巧大全',
    description: '详解阅读理解各题型解题技巧，包含长难句分析、选项排除法、定位关键词等方法论，配合20篇真题精讲。',
    category: 'english',
    price: 29.90,
    coverUrl: '/covers/english-1.jpg',
    fileType: 'pdf',
    pageCount: 120,
    fileSize: '28.5 MB',
    uploaderId: 'user-003',
    uploaderName: '英语达人小李',
    uploaderAvatar: '/avatars/user-3.jpg',
    salesCount: 2089,
    rating: 4.9,
    reviewCount: 567,
    createdAt: '2024-08-20',
    tags: ['阅读理解', '技巧', '真题'],
  },
  {
    id: 'mat-003',
    title: '高等数学核心公式手册（数一数二通用）',
    description: '收录高等数学所有核心公式、定理、推导过程，便携式口袋书设计，随时随地复习。',
    category: 'math',
    price: 15.90,
    coverUrl: '/covers/math-1.jpg',
    fileType: 'pdf',
    pageCount: 45,
    fileSize: '8.3 MB',
    uploaderId: 'user-004',
    uploaderName: '数学小天才',
    uploaderAvatar: '/avatars/user-4.jpg',
    salesCount: 3421,
    rating: 4.7,
    reviewCount: 892,
    createdAt: '2024-07-10',
    tags: ['公式', '高数', '便携'],
  },
  {
    id: 'mat-004',
    title: '计算机408专业课历年真题详解',
    description: '2010-2024年计算机统考408完整真题解析，包含数据结构、操作系统、计算机网络、计算机组成原理四科详细答案。',
    category: 'professional',
    price: 49.90,
    coverUrl: '/covers/pro-1.jpg',
    fileType: 'pdf',
    pageCount: 280,
    fileSize: '65.8 MB',
    uploaderId: 'user-005',
    uploaderName: 'CS考研大神',
    uploaderAvatar: '/avatars/user-5.jpg',
    salesCount: 1567,
    rating: 4.9,
    reviewCount: 445,
    createdAt: '2024-06-25',
    tags: ['408', '真题', '计算机'],
  },
  {
    id: 'mat-005',
    title: '考研政治思修与法基重点知识汇总',
    description: '思想道德修养与法律基础全部考点整理，重点标记必考内容，附带记忆口诀和框架图。',
    category: 'politics',
    price: 12.90,
    coverUrl: '/covers/politics-2.jpg',
    fileType: 'pdf',
    pageCount: 52,
    fileSize: '11.6 MB',
    uploaderId: 'user-002',
    uploaderName: '考研政治王老师',
    uploaderAvatar: '/avatars/user-2.jpg',
    salesCount: 876,
    rating: 4.6,
    reviewCount: 234,
    createdAt: '2024-10-01',
    tags: ['思修', '法基', '重点'],
  },
  {
    id: 'mat-006',
    title: '考研英语作文模板万能句型100句',
    description: '精选大小作文高分句型，涵盖各类话题模板，背诵即用，提分神器。',
    category: 'english',
    price: 9.90,
    coverUrl: '/covers/english-2.jpg',
    fileType: 'docx',
    pageCount: 35,
    fileSize: '2.1 MB',
    uploaderId: 'user-006',
    uploaderName: '写作狂人',
    uploaderAvatar: '/avatars/user-6.jpg',
    salesCount: 4521,
    rating: 4.5,
    reviewCount: 1023,
    createdAt: '2024-09-28',
    tags: ['作文', '模板', '高分'],
  },
  {
    id: 'mat-007',
    title: '线性代数知识点全覆盖笔记',
    description: '线代全部章节知识点系统整理，配合例题讲解，从基础到提高一本搞定。',
    category: 'math',
    price: 22.90,
    coverUrl: '/covers/math-2.jpg',
    fileType: 'pdf',
    pageCount: 95,
    fileSize: '22.4 MB',
    uploaderId: 'user-004',
    uploaderName: '数学小天才',
    uploaderAvatar: '/avatars/user-4.jpg',
    salesCount: 2156,
    rating: 4.8,
    reviewCount: 612,
    createdAt: '2024-08-15',
    tags: ['线代', '系统', '全面'],
  },
  {
    id: 'mat-008',
    title: '金融学综合431核心考点速记',
    description: '金融硕士431专业课核心知识点速记本，涵盖货币银行学、国际金融、公司理财等内容。',
    category: 'professional',
    price: 35.90,
    coverUrl: '/covers/pro-2.jpg',
    fileType: 'pdf',
    pageCount: 130,
    fileSize: '31.2 MB',
    uploaderId: 'user-007',
    uploaderName: '金融考研通',
    uploaderAvatar: '/avatars/user-7.jpg',
    salesCount: 987,
    rating: 4.7,
    reviewCount: 278,
    createdAt: '2024-09-05',
    tags: ['431', '金融', '速记'],
  },
]

// 用户上传的资料
export const userMaterials: Material[] = [
  {
    id: 'mat-009',
    title: '我的考研英语词汇笔记整理',
    description: '个人整理的考研核心词汇，按频率分类，配合例句记忆。',
    category: 'english',
    price: 8.90,
    coverUrl: '/covers/english-3.jpg',
    fileType: 'pdf',
    pageCount: 60,
    fileSize: '5.2 MB',
    uploaderId: 'user-001',
    uploaderName: '张同学',
    uploaderAvatar: '/avatars/user-1.jpg',
    salesCount: 156,
    rating: 4.4,
    reviewCount: 45,
    createdAt: '2024-10-10',
    tags: ['词汇', '笔记', '记忆'],
  },
  {
    id: 'mat-010',
    title: '概率论与数理统计重难点突破',
    description: '概率论核心考点详解，附带历年真题分析。',
    category: 'math',
    price: 18.90,
    coverUrl: '/covers/math-3.jpg',
    fileType: 'pdf',
    pageCount: 78,
    fileSize: '18.6 MB',
    uploaderId: 'user-001',
    uploaderName: '张同学',
    uploaderAvatar: '/avatars/user-1.jpg',
    salesCount: 289,
    rating: 4.6,
    reviewCount: 87,
    createdAt: '2024-09-20',
    tags: ['概率论', '重难点', '真题'],
  },
]

// 用户订单
export const userOrders: Order[] = [
  {
    id: 'order-001',
    materialId: 'mat-001',
    materialTitle: '2025考研政治冲刺笔记-马原理论精华版',
    materialCover: '/covers/politics-1.jpg',
    price: 19.90,
    status: 'completed',
    createdAt: '2024-10-12 14:32:00',
    sellerName: '考研政治王老师',
  },
  {
    id: 'order-002',
    materialId: 'mat-002',
    materialTitle: '考研英语一阅读理解技巧大全',
    materialCover: '/covers/english-1.jpg',
    price: 29.90,
    status: 'completed',
    createdAt: '2024-10-10 09:15:00',
    sellerName: '英语达人小李',
  },
  {
    id: 'order-003',
    materialId: 'mat-003',
    materialTitle: '高等数学核心公式手册（数一数二通用）',
    materialCover: '/covers/math-1.jpg',
    price: 15.90,
    status: 'completed',
    createdAt: '2024-10-08 18:45:00',
    sellerName: '数学小天才',
  },
  {
    id: 'order-004',
    materialId: 'mat-004',
    materialTitle: '计算机408专业课历年真题详解',
    materialCover: '/covers/pro-1.jpg',
    price: 49.90,
    status: 'completed',
    createdAt: '2024-10-05 11:20:00',
    sellerName: 'CS考研大神',
  },
]

// 收益记录
export const userEarnings: Earning[] = [
  {
    id: 'earn-001',
    orderId: 'order-101',
    materialId: 'mat-009',
    materialTitle: '我的考研英语词汇笔记整理',
    buyerName: '李**',
    originalAmount: 8.90,
    platformFee: 0.89,
    netAmount: 8.01,
    createdAt: '2024-10-15 10:30:00',
  },
  {
    id: 'earn-002',
    orderId: 'order-102',
    materialId: 'mat-010',
    materialTitle: '概率论与数理统计重难点突破',
    buyerName: '王**',
    originalAmount: 18.90,
    platformFee: 1.89,
    netAmount: 17.01,
    createdAt: '2024-10-14 16:45:00',
  },
  {
    id: 'earn-003',
    orderId: 'order-103',
    materialId: 'mat-009',
    materialTitle: '我的考研英语词汇笔记整理',
    buyerName: '赵**',
    originalAmount: 8.90,
    platformFee: 0.89,
    netAmount: 8.01,
    createdAt: '2024-10-13 09:20:00',
  },
  {
    id: 'earn-004',
    orderId: 'order-104',
    materialId: 'mat-010',
    materialTitle: '概率论与数理统计重难点突破',
    buyerName: '刘**',
    originalAmount: 18.90,
    platformFee: 1.89,
    netAmount: 17.01,
    createdAt: '2024-10-12 20:10:00',
  },
  {
    id: 'earn-005',
    orderId: 'order-105',
    materialId: 'mat-009',
    materialTitle: '我的考研英语词汇笔记整理',
    buyerName: '陈**',
    originalAmount: 8.90,
    platformFee: 0.89,
    netAmount: 8.01,
    createdAt: '2024-10-11 14:55:00',
  },
]

// 提现记录
export const userWithdrawals: Withdrawal[] = [
  {
    id: 'withdraw-001',
    amount: 5000.00,
    status: 'completed',
    createdAt: '2024-09-25 10:00:00',
    completedAt: '2024-09-26 15:30:00',
    bankInfo: '工商银行 尾号 8888',
  },
  {
    id: 'withdraw-002',
    amount: 3000.00,
    status: 'completed',
    createdAt: '2024-08-15 14:20:00',
    completedAt: '2024-08-16 09:45:00',
    bankInfo: '工商银行 尾号 8888',
  },
  {
    id: 'withdraw-003',
    amount: 2000.00,
    status: 'completed',
    createdAt: '2024-07-20 11:30:00',
    completedAt: '2024-07-21 16:00:00',
    bankInfo: '工商银行 尾号 8888',
  },
]

// 评价数据
export const reviews: Review[] = [
  {
    id: 'review-001',
    materialId: 'mat-001',
    userId: 'user-010',
    userName: '考研加油鸭',
    userAvatar: '/avatars/user-10.jpg',
    rating: 5,
    content: '非常棒的资料！马原部分总结得很到位，重点突出，配合真题解析理解更深刻了。强烈推荐给政治基础薄弱的同学！',
    createdAt: '2024-10-14',
  },
  {
    id: 'review-002',
    materialId: 'mat-001',
    userId: 'user-011',
    userName: '努力上岸',
    userAvatar: '/avatars/user-11.jpg',
    rating: 5,
    content: '物超所值，笔记很清晰，思维导图帮助很大。',
    createdAt: '2024-10-12',
  },
  {
    id: 'review-003',
    materialId: 'mat-001',
    userId: 'user-012',
    userName: '小明同学',
    userAvatar: '/avatars/user-12.jpg',
    rating: 4,
    content: '内容不错，但希望能再多一些例题。',
    createdAt: '2024-10-10',
  },
]

// 月度收益数据（用于图表）
export const monthlyEarningsData = [
  { month: '5月', earnings: 580 },
  { month: '6月', earnings: 1200 },
  { month: '7月', earnings: 1850 },
  { month: '8月', earnings: 2100 },
  { month: '9月', earnings: 3200 },
  { month: '10月', earnings: 3750 },
]

// 分类销售数据（用于图表）
export const categorySalesData = [
  { category: '政治', sales: 2132 },
  { category: '英语', sales: 3610 },
  { category: '数学', sales: 2577 },
  { category: '专业课', sales: 2554 },
]

// 工具函数
export function getCategoryName(category: Category): string {
  const map: Record<Category, string> = {
    politics: '政治',
    english: '英语',
    math: '数学',
    professional: '专业课',
  }
  return map[category]
}

export function getCategoryColor(category: Category): string {
  const map: Record<Category, string> = {
    politics: 'bg-red-500',
    english: 'bg-blue-500',
    math: 'bg-emerald-500',
    professional: 'bg-amber-500',
  }
  return map[category]
}

export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
