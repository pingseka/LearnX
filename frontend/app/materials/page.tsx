"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MaterialCard } from "@/components/material-card"
import { getMaterials } from "@/api/materials"
import { materials as mockMaterials, categories, type Category } from "@/lib/mock-data"

function MaterialsContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") as Category | null

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(initialCategory || "all")
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "price-low" | "price-high">('popular')
  const [priceRange, setPriceRange] = useState([0, 100])
  const [materials, setMaterials] = useState(mockMaterials)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getMaterials()
        if (result?.materials?.length > 0) {
          // API data would need mapping; for now keep mock
        }
      } catch {
        // Keep mock data as fallback
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredMaterials = useMemo(() => {
    let filtered = [...materials]

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((m) => m.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Filter by price range
    filtered = filtered.filter((m) => m.price >= priceRange[0] && m.price <= priceRange[1])

    // Sort
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.salesCount - a.salesCount)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
    }

    return filtered
  }, [searchQuery, selectedCategory, sortBy, priceRange])

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="font-medium">资料分类</h4>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={`cursor-pointer transition-all ${
              selectedCategory === "all"
                ? "bg-primary hover:bg-blue-600"
                : "hover:bg-muted"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            全部
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary hover:bg-blue-600"
                  : "hover:bg-muted"
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="font-medium">价格区间</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={100}
          step={5}
          className="w-full"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>¥{priceRange[0]}</span>
          <span>¥{priceRange[1]}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-primary py-12 md:py-16 relative overflow-hidden">
          {/* Geometric decoration */}
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute top-1/3 right-1/4 h-32 w-32 rotate-45 bg-white/5 rounded-lg" />

          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">资料市场</h1>
            <p className="text-white/80 mb-6">发现优质考研资料，助你高效备考</p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="搜索资料标题、关键词..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 rounded-lg bg-white border-0 text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 bg-card rounded-lg p-6">
                <h3 className="font-semibold mb-4">筛选条件</h3>
                <FilterContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    共 <span className="font-medium text-foreground">{filteredMaterials.length}</span> 份资料
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden rounded-full">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        筛选
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>筛选条件</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort Select */}
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                    <SelectTrigger className="w-[140px] rounded-full">
                      <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">最受欢迎</SelectItem>
                      <SelectItem value="newest">最新上传</SelectItem>
                      <SelectItem value="price-low">价格从低到高</SelectItem>
                      <SelectItem value="price-high">价格从高到低</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category Tags - Mobile */}
              <div className="lg:hidden flex flex-wrap gap-2 mb-6">
                <Badge
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedCategory("all")}
                >
                  全部
                </Badge>
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>

              {/* Materials Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-lg" />
                  ))}
                </div>
              ) : filteredMaterials.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {filteredMaterials.map((material) => (
                    <MaterialCard key={material.id} material={material} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">未找到相关资料</h3>
                  <p className="text-muted-foreground">试试调整筛选条件或搜索关键词</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function MaterialsPage() {
  return (
    <Suspense fallback={null}>
      <MaterialsContent />
    </Suspense>
  )
}
