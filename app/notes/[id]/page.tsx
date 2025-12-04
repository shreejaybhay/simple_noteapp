"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, BookOpen, Edit3, Trash2, Calendar, Clock, Share } from "lucide-react"
import { PageActions } from "@/components/page-actions"
import Link from "next/link"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Loading from "@/app/loading"

interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface NotePageProps {
  params: Promise<{
    id: string
  }>
}

const NotePage = ({ params }: NotePageProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  // Unwrap params promise
  React.useEffect(() => {
    params.then(({ id }) => {
      setNoteId(id);
    });
  }, [params]);

  // Fetch all notes for navigation
  const fetchAllNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const notes = await response.json();
        setAllNotes(notes);
        return notes;
      }
    } catch (error) {
      console.error("Error fetching all notes:", error);
    }
    return [];
  };

  // Fetch note data
  const fetchNote = async (id: string) => {
    try {
      const [noteResponse, allNotesData] = await Promise.all([
        fetch(`/api/notes/${id}`),
        fetchAllNotes()
      ]);
      
      if (noteResponse.status === 404) {
        setError("Note not found");
        return;
      }
      
      if (noteResponse.status === 403) {
        setError("You don't have permission to view this note");
        return;
      }
      
      if (!noteResponse.ok) {
        setError("Failed to load note");
        return;
      }
      
      const noteData = await noteResponse.json();
      setNote(noteData);
      
      // Find current note index in the list
      const index = allNotesData.findIndex((n: Note) => n._id === id);
      setCurrentIndex(index);
    } catch (error) {
      console.error("Error fetching note:", error);
      setError("Failed to load note");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle note deletion
  const handleDelete = async () => {
    if (!noteId) return;
    
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        router.push("/notes");
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);

  // Fetch note when session and noteId are available
  React.useEffect(() => {
    if (session && noteId) {
      fetchNote(noteId);
    }
  }, [session, noteId]);

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {error || "Note not found"}
          </h2>
          <Button asChild>
            <Link href="/notes">Back to Notes</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const createdDate = new Date(note.createdAt);
  const updatedDate = new Date(note.updatedAt);

  return (
    <div className="min-h-[calc(100vh-69px)] bg-background">
      <PageActions
        title={note.title}
        subtitle={`Created ${format(createdDate, "MMM d, yyyy 'at' h:mm a")}`}
        badge={`#${note._id.slice(-6)}`}
        backHref="/notes"
        backLabel="Back to Notes"
        actions={[
          {
            label: "Share",
            icon: <Share className="h-4 w-4" />,
            onClick: () => {
              // TODO: Implement share functionality
              console.log("Share note");
            },
          },
          {
            label: "Edit",
            icon: <Edit3 className="h-4 w-4" />,
            href: `/notes/${note._id}/edit`,
          },
        ]}
        mobileActions={[
          {
            label: "Delete",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => {
              // We'll handle this with a separate AlertDialog component
              const deleteButton = document.querySelector('[data-delete-trigger]') as HTMLButtonElement;
              deleteButton?.click();
            },
            className: "text-destructive hover:text-destructive",
          },
        ]}
      />

      {/* Hidden delete trigger for mobile */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button data-delete-trigger className="hidden" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note
              "{note.title}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Note
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                  <span>{format(createdDate, "EEEE, MMMM do, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{format(createdDate, "h:mm a")}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Note #{note._id.slice(-6)}
                </Badge>
              </div>

              {/* Timestamps */}
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                <span>Created: {format(createdDate, "MMM d, yyyy 'at' h:mm a")}</span>
                {updatedDate.getTime() !== createdDate.getTime() && (
                  <span>Updated: {format(updatedDate, "MMM d, yyyy 'at' h:mm a")}</span>
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
              <Link href={`/notes/${note._id}/edit`}>
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
          {allNotes.length > 1 && (
            <div className="mt-8 flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <Button 
                variant="ghost" 
                className="flex-1 justify-start" 
                disabled={currentIndex <= 0}
                asChild={currentIndex > 0}
              >
                {currentIndex > 0 ? (
                  <Link href={`/notes/${allNotes[currentIndex - 1]._id}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous Note
                  </Link>
                ) : (
                  <>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous Note
                  </>
                )}
              </Button>
              <div className="text-sm text-muted-foreground px-4">
                {currentIndex >= 0 ? currentIndex + 1 : 1} of {allNotes.length}
              </div>
              <Button 
                variant="ghost" 
                className="flex-1 justify-end"
                disabled={currentIndex >= allNotes.length - 1}
                asChild={currentIndex < allNotes.length - 1}
              >
                {currentIndex < allNotes.length - 1 ? (
                  <Link href={`/notes/${allNotes[currentIndex + 1]._id}`}>
                    Next Note
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Link>
                ) : (
                  <>
                    Next Note
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default NotePage