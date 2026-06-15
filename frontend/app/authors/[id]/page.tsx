"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, FileText, Loader2, User } from "lucide-react"
import { getAuthorProfile, type PublicAuthorProfile } from "@/api/authors"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MaterialCard } from "@/components/material-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("zh-CN")
}

export default function AuthorProfilePage() {
  const params = useParams()
  const authorId = Array.isArray(params.id) ? params.id[0] : params.id
  const [profile, setProfile] = useState<PublicAuthorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let ignore = false

    async function fetchAuthor() {
      if (!authorId) {
        setError("作者不存在")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const result = await getAuthorProfile(Number(authorId))
        if (!ignore) {
          setProfile(result)
          setError("")
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "作者资料加载失败")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchAuthor()

    return () => {
      ignore = true
    }
  }, [authorId])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <div className="border-b bg-white">
          <div className="container mx-auto px-4 py-3">
            <Button variant="ghost" asChild>
              <Link href="/materials" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                返回资料市场
              </Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              正在加载作者主页...
            </div>
          ) : error || !profile ? (
            <Card>
              <CardContent className="p-12 text-center">
                <h1 className="text-xl font-semibold">作者主页加载失败</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {error || "作者不存在"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <Card className="border bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-primary text-xl text-white">
                          {profile.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-2xl font-bold text-slate-950">
                          {profile.author.name}
                        </h1>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          LearnX 创作者 · 入驻于 {formatDate(profile.author.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-blue-50 px-4 py-3 text-blue-700">
                      <p className="text-sm">公开上架资料</p>
                      <p className="mt-1 text-2xl font-bold">
                        {profile.materialCount} 份
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-slate-950">
                    作者公开资料
                  </h2>
                </div>
                {profile.materials.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {profile.materials.map((material) => (
                      <MaterialCard key={material.id} material={material} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center text-muted-foreground">
                      该作者暂无公开上架资料。
                    </CardContent>
                  </Card>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
