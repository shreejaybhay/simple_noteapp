"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, BookOpen, Save, Edit3, Eye, Trash2 } from "lucide-react"
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

I want to make more time for these reflective moments. There's something powerful about putting thoughts to paper - it helps clarify what's really important and what's just noise.`,
  date: new Date("2024-12-03"),
  time: "08:30",
  createdAt: new Date("2024-12-03T08:30:00"),
  updatedAt: new Date("2024-12-03T08:35:00")
}

interface EditNotePageProps {
  params: {
    id: string
  }
}

const EditNotePage = ({ params }: EditNotePageProps) => {
  // In a real app, you'd fetch the note based on params.id
  const note = mockNote

  const [title, setTitle] = React.useState(note.title)
  const [content, setContent] = React.useState(note.content)

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving note:', { title, content })
  }

  const handleDelete = () => {
    // Handle delete logic here
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      console.log('Deleting note:', note.id)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/notes/${note.id}`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <BookOpen className="h-8 w-8 text-primary" />
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">Edit Note</h1>
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  #{note.id}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" asChild>
                <Link href={`/notes/${note.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-primary" />
                  Edit Note
                </div>
                <div className="text-sm text-muted-foreground font-normal">
                  Last updated: {format(note.updatedAt, "MMM d, yyyy 'at' h:mm a")}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                {/* Title Field */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    type="text" 
                    placeholder="Enter note title..."
                    className="text-lg"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Content Field */}
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your thoughts here..."
                    className="min-h-[400px] resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>

                {/* Character Count */}
                <div className="text-right text-sm text-muted-foreground">
                  {content.length} characters
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" size="lg" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="lg" 
                    className="flex-1" 
                    asChild
                  >
                    <Link href={`/notes/${note.id}`}>
                      Cancel
                    </Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Note Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Note Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Note ID:</span>
                  <Badge variant="secondary">#{note.id}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{format(note.createdAt, "MMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{format(note.updatedAt, "MMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Word Count:</span>
                  <span>{content.split(/\s+/).filter(word => word.length > 0).length} words</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/notes/${note.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Note
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/notes">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to All Notes
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Note
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EditNotePage