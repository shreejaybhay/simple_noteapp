"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, BookOpen, Edit3, Trash2, Calendar, Clock, Share } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

// Mock data for demonstration - replace with actual data fetching
const mockNote = {
  id: "1",
  title: "Morning Reflections",
  content: `Started the day with meditation and coffee. There's something magical about those quiet morning moments before the world wakes up. The sun was just beginning to peek through the curtains, casting a warm golden glow across the room.

I've been thinking a lot about gratitude lately. It's easy to get caught up in the hustle and bustle of daily life and forget to appreciate the small things. Today I'm grateful for:

• The peaceful silence of early morning
• The rich aroma of freshly brewed coffee
• The comfortable warmth of my favorite blanket
• The opportunity to start fresh each day

I want to make more time for these reflective moments. There's something powerful about putting thoughts to paper - it helps clarify what's really important and what's just noise.

The day ahead looks promising. I have a few projects I'm excited to work on, and I'm feeling energized and focused. Sometimes the best productivity comes from taking time to be still first.`,
  date: new Date("2024-12-03"),
  time: "08:30 AM",
  createdAt: new Date("2024-12-03T08:30:00"),
  updatedAt: new Date("2024-12-03T08:35:00")
}

interface NotePageProps {
  params: {
    id: string
  }
}

const NotePage = ({ params }: NotePageProps) => {
  // In a real app, you'd fetch the note based on params.id
  const note = mockNote

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/notes">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <BookOpen className="h-8 w-8 text-primary" />
              <div className="hidden sm:block">
                <h1 className="text-2xl font-semibold">Daily Notes</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/notes/${note.id}/edit`}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="space-y-4">
              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {note.title}
                </h1>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(note.date, "EEEE, MMMM do, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{note.time}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Note #{note.id}
                </Badge>
              </div>

              {/* Timestamps */}
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                <span>Created: {format(note.createdAt, "MMM d, yyyy 'at' h:mm a")}</span>
                {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                  <span>Updated: {format(note.updatedAt, "MMM d, yyyy 'at' h:mm a")}</span>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {/* Content */}
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {note.content}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-1" asChild>
              <Link href={`/notes/${note.id}/edit`}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Note
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="flex-1" asChild>
              <Link href="/notes">
                Back to Notes
              </Link>
            </Button>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center p-4 bg-muted/50 rounded-lg">
            <Button variant="ghost" className="flex-1 justify-start">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Note
            </Button>
            <div className="text-sm text-muted-foreground px-4">
              1 of 4
            </div>
            <Button variant="ghost" className="flex-1 justify-end">
              Next Note
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NotePage