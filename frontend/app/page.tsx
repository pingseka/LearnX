import Link from "next/link"
import { Search, Upload, Shield, Award, ArrowRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MaterialCard } from "@/components/material-card"
import { CategoryCard } from "@/components/category-card"
import { materials, categories } from "@/lib/mock-data"

export default function HomePage() {
  const hotMaterials = materials.slice(0, 8)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section - solid blue bg with geometric decoration */}
        <section className="relative overflow-hidden bg-primary py-12 sm:py-20 md:py-32">
          {/* Background geometric shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute top-1/4 right-1/3 h-48 w-48 rotate-45 bg-white/5 rounded-lg" />
            <div className="absolute bottom-1/4 left-1/4 h-32 w-32 rounded-full bg-white/5" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 text-white text-xs sm:text-sm">
                <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>考研学子的专属资料平台</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white text-balance leading-tight tracking-tight">
                优质资料共享
                <br />
                <span className="text-amber-300">助力考研上岸</span>
              </h1>

              <p className="text-sm sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto text-pretty px-2">
                汇聚政治、英语、数学、专业课全品类考研资料，上传即可赚取收益，购买即可高效备考
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto px-2 sm:px-0">
                <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-lg">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 sm:left-4 top-1/2 h-4 sm:h-5 w-4 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="搜索你需要的考研资料..."
                      className="pl-10 sm:pl-12 h-10 sm:h-12 border-0 text-sm sm:text-base focus-visible:ring-0"
                    />
                  </div>
                  <Button size="lg" className="h-10 sm:h-12 px-6 sm:px-8 rounded-md bg-foreground text-background hover:bg-gray-800 text-sm sm:text-base w-full sm:w-auto transition-all duration-200 hover:scale-105">
                    搜索
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-8 md:gap-16 pt-4 sm:pt-8">
                <div className="text-center">
                  <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white">9000+</div>
                  <div className="text-xs sm:text-sm text-white/70">优质资料</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-amber-300">50000+</div>
                  <div className="text-xs sm:text-sm text-white/70">活跃用户</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-emerald-300">98%</div>
                  <div className="text-xs sm:text-sm text-white/70">好评率</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - white bg */}
        <section className="py-10 sm:py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">按分类浏览</h2>
              <p className="text-sm sm:text-base text-muted-foreground">覆盖考研全科目，精准定位你的需求</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  icon={category.icon}
                  color={category.color}
                  count={category.count}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Hot Materials Section - muted bg */}
        <section className="py-10 sm:py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-12 gap-3 sm:gap-4">
              <div>
                <div className="flex items-center gap-2 text-primary mb-1 sm:mb-2">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">热门推荐</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">最受欢迎的资料</h2>
              </div>
              <Button variant="outline" asChild className="self-start sm:self-auto border-2 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-white hover:border-primary">
                <Link href="/materials" className="flex items-center gap-1.5 sm:gap-2">
                  查看全部
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {hotMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - emerald bg */}
        <section className="py-10 sm:py-16 md:py-24 bg-emerald-500 relative overflow-hidden">
          {/* Geometric decoration */}
          <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/5" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-white">为什么选择研途共享</h2>
              <p className="text-sm sm:text-base text-white/80">专业、安全、高效的考研资料交易平台</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
              <div className="flex-1 text-center p-5 sm:p-8 rounded-lg bg-white/10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-white mb-4 sm:mb-6">
                  <Upload className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3 text-white">上传即可赚钱</h3>
                <p className="text-sm sm:text-base text-white/80">
                  分享你的考研资料，自主定价，每笔交易获得 90% 收益，知识变现从未如此简单
                </p>
              </div>

              <div className="flex-1 text-center p-5 sm:p-8 rounded-lg bg-white/10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-white mb-4 sm:mb-6">
                  <Shield className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3 text-white">安全有保障</h3>
                <p className="text-sm sm:text-base text-white/80">
                  平台担保交易，付款前可预览资料，不满意可申请退款，买卖双方权益有保障
                </p>
              </div>

              <div className="flex-1 text-center p-5 sm:p-8 rounded-lg bg-white/10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-white mb-4 sm:mb-6">
                  <Award className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3 text-white">优质精选资料</h3>
                <p className="text-sm sm:text-base text-white/80">
                  严格审核上传内容，用户真实评价体系，只推荐真正有价值的考研资料
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - amber bg */}
        <section className="py-10 sm:py-16 md:py-24 bg-amber-500 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-48 w-48 rotate-45 bg-white/5 rounded-lg" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              现在就开始你的考研之旅
            </h2>
            <p className="text-sm sm:text-lg text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
              无论是寻找优质资料还是分享你的笔记，研途共享都是你的最佳选择
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Button size="lg" className="rounded-md text-sm sm:text-base px-6 sm:px-8 h-10 sm:h-14 w-full sm:w-auto bg-white text-amber-600 hover:bg-gray-100 transition-all duration-200 hover:scale-105 font-semibold" asChild>
                <Link href="/materials">浏览资料</Link>
              </Button>
              <Button size="lg" className="rounded-md text-sm sm:text-base px-6 sm:px-8 h-10 sm:h-14 w-full sm:w-auto bg-amber-700 text-white hover:bg-amber-800 border-4 border-amber-600 transition-all duration-200 hover:scale-105 font-semibold" asChild>
                <Link href="/upload">上传资料</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
