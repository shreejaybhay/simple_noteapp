import React from 'react'
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { BookOpen } from "lucide-react"
import Link from "next/link"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="text-center max-w-lg mx-auto px-6">
        <div className="flex items-center justify-center mb-8">
          <BookOpen className="h-16 w-16 text-primary" />
        </div>
        
        <h1 className="text-8xl font-light text-muted-foreground mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-light text-foreground mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        
        <div className="space-y-3">
          <Button size="lg" className="w-full" asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="ghost" size="lg" className="w-full" asChild>
            <Link href="/notes">View Notes</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound