"use client"

import { useEffect, useState, useRef } from "react"
import Header from "../nav"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const Onboarding = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState<number | null>(null) // analyzing progress
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const allowedTypes = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  const validateFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only .doc, .pdf, or .txt files are allowed ❌")
      return false
    }
    return true
  }

  // 🔹 Start analyzing (for PDFs only)
  const startAnalyzing = (file: File) => {
    if (file.type === "application/pdf") {
      const steps = [0, 1, 3, 10, 40, 70, 90, 95, 100]
      let i = 0

      setProgress(0) // show overlay
      const interval = setInterval(() => {
        setProgress(steps[i])
        if (steps[i] === 100) {
          clearInterval(interval)
          toast.success("Analysis Complete ✅")
          setTimeout(() => {
            router.push("/analyze") // navigate after complete
          }, 800)
        }
        i++
      }, 700) // step timing
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (validateFile(e.target.files[0])) {
        setFile(e.target.files[0])
        toast.success(`File uploaded: ${e.target.files[0].name} ✅`)
        startAnalyzing(e.target.files[0]) // 🔹 analysis here
      }
    }
  }

  // Handle paste (Ctrl + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files.length) {
        const file = e.clipboardData.files[0]
        if (validateFile(file)) {
          setFile(file)
          toast.success(`Pasted file: ${file.name} 📎`)
          startAnalyzing(file) // 🔹 analysis here
        }
      }
    }

    window.addEventListener("paste", handlePaste)
    return () => window.removeEventListener("paste", handlePaste)
  }, [])

  // Global Drag & Drop
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent) => {
      if (e.relatedTarget === null) {
        setIsDragging(false)
      }
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFile = e.dataTransfer?.files?.[0]
      if (droppedFile && validateFile(droppedFile)) {
        setFile(droppedFile)
        toast.success(`Dropped file: ${droppedFile.name} 📂`)
        startAnalyzing(droppedFile) // 🔹 analysis here
      }
    }

    window.addEventListener("dragover", handleDragOver)
    window.addEventListener("dragleave", handleDragLeave)
    window.addEventListener("drop", handleDrop)

    return () => {
      window.removeEventListener("dragover", handleDragOver)
      window.removeEventListener("dragleave", handleDragLeave)
      window.removeEventListener("drop", handleDrop)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      {/* 🔹 Fullscreen drag overlay */}
      {isDragging && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-2xl font-semibold text-blue-600">
            Drop your file here or click to upload
          </p>
        </div>
      )}

      {/* 🔹 Analyzing overlay */}
      {progress !== null && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md text-white">
          <h2 className="text-2xl font-semibold mb-4">Analyzing PDF...</h2>
          <div className="w-2/3 max-w-md bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-500 h-4 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-3">{progress}%</p>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-3xl font-bold mb-6">READY TO READ</h1>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <label
          className="border rounded-md px-6 py-3 cursor-pointer hover:bg-gray-100 transition active:scale-95 active:shadow-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          UPLOAD FILE
        </label>

        <p className="mt-3 text-gray-600">You can drag, drop, or paste a file</p>

        {file && (
          <p className="mt-4 text-green-600 font-medium">
            Selected: {file.name}
          </p>
        )}
      </main>
    </div>
  )
}

export default Onboarding;