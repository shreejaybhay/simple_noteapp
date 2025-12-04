import React from 'react'
import { BookOpen } from "lucide-react"

const Loading = () => {
  return (
    <div className="min-h-[calc(100vh-69px)] bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <BookOpen className="h-16 w-16 text-primary animate-pulse" />
        </div>
        
        <h1 className="text-2xl font-light text-foreground mb-4">
          Daily Notes
        </h1>
        
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default Loading