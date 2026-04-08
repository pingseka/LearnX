"use client"

import { useState, useCallback } from "react"
import { Upload, FileText, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSize?: number // in MB
}

export function FileUpload({ onFileSelect, accept = ".pdf,.docx", maxSize = 50 }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    setError(null)

    // Check file type
    const allowedTypes = accept.split(",").map((t) => t.trim())
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
    if (!allowedTypes.includes(fileExtension)) {
      setError(`仅支持 ${accept} 格式的文件`)
      return false
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`文件大小不能超过 ${maxSize}MB`)
      return false
    }

    return true
  }

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [onFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    onFileSelect(null)
    setError(null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (selectedFile) {
    return (
      <div className="border-2 border-green-200 bg-green-50 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-green-100 flex items-center justify-center">
            <FileText className="h-7 w-7 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <p className="font-medium truncate">{selectedFile.name}</p>
            </div>
            <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={removeFile} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : error
            ? "border-red-300 bg-red-50"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-lg bg-blue-50 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-medium">
              {isDragging ? "松开鼠标上传文件" : "拖拽文件到此处或点击上传"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              支持 PDF、Word 文档，最大 {maxSize}MB
            </p>
          </div>
          <Button type="button" variant="outline" className="rounded-md">
            选择文件
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
