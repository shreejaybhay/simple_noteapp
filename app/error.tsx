"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { BookOpen, RefreshCw } from "lucide-react"
import Link from "next/link"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="text-center max-w-lg mx-auto px-6">
        <div className="flex items-center justify-center mb-8">
          <BookOpen className="h-16 w-16 text-destructive" />
        </div>
        
        <h1 className="text-6xl font-light text-muted-foreground mb-4">
          Oops!
        </h1>
        
        <h2 className="text-2xl font-light text-foreground mb-4">
          Something went wrong
        </h2>
        
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
          We encountered an unexpected error. Don't worry, your notes are safe.
        </p>
        
        <div className="space-y-3">
          <Button size="lg" className="w-full" onClick={reset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="ghost" size="lg" className="w-full" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage