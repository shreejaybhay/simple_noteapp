import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Plus, Search, Calendar, BookOpen, Edit3 } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockNotes = [
  {
    id: 1,
    title: "Morning Reflections",
    content: "Started the day with meditation and coffee. Feeling grateful for the peaceful morning and excited about the projects ahead...",
    date: "2024-12-03",
    time: "08:30 AM"
  },
  {
    id: 2,
    title: "Project Ideas",
    content: "Brainstormed some new features for the app. Need to focus on user experience and simplicity. Less is more...",
    date: "2024-12-02",
    time: "02:15 PM"
  },
  {
    id: 3,
    title: "Weekend Plans",
    content: "Planning to visit the local farmers market and try that new hiking trail. Also want to finish reading the book I started...",
    date: "2024-12-01",
    time: "07:45 PM"
  },
  {
    id: 4,
    title: "Learning Notes",
    content: "Discovered some interesting concepts about design systems today. The importance of consistency and reusable components...",
    date: "2024-11-30",
    time: "11:20 AM"
  }
]

const Notes = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-semibold">Daily Notes</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button size="sm" asChild>
                <Link href="/notes/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search your notes..." 
              className="pl-10"
            />
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow group relative">
              <Link href={`/notes/${note.id}`} className="absolute inset-0 z-10" />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-medium line-clamp-1">
                    {note.title}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 relative z-20"
                    asChild
                  >
                    <Link href={`/notes/${note.id}/edit`}>
                      <Edit3 className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{note.date}</span>
                  <span>•</span>
                  <span>{note.time}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                  {note.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (when no notes) */}
        {mockNotes.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-6">
              Start your daily writing journey by creating your first note.
            </p>
            <Button asChild>
              <Link href="/notes/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Note
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Notes