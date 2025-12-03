"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Save, Edit3, Eye, Trash2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface EditNotePageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditNotePage = ({ params }: EditNotePageProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noteId, setNoteId] = useState<string | null>(null);

  // Unwrap params promise
  useEffect(() => {
    params.then(({ id }) => {
      setNoteId(id);
    });
  }, [params]);

  // Fetch note data
  const fetchNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`);

      if (response.status === 404) {
        setError("Note not found");
        return;
      }

      if (response.status === 403) {
        setError("You don't have permission to edit this note");
        return;
      }

      if (!response.ok) {
        setError("Failed to load note");
        return;
      }

      const data = await response.json();
      setNote(data);
      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      console.error("Error fetching note:", error);
      setError("Failed to load note");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!noteId || !title.trim() || !content.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNote(updatedNote);
        router.push(`/notes/${noteId}`);
      } else {
        console.error("Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
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
  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);

  // Fetch note when session and noteId are available
  useEffect(() => {
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
      {/* Page Actions */}
      <div className="container mx-auto px-4 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/notes/${note._id}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium">Edit Note</h2>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                #{note._id.slice(-6)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/notes/${note._id}`}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this note?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your note "{note.title}" and remove it from our servers.
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
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

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
                  Last updated: {format(updatedDate, "MMM d, yyyy 'at' h:mm a")}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
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
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving Changes..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    asChild
                  >
                    <Link href={`/notes/${note._id}`}>Cancel</Link>
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
                  <Badge variant="secondary">#{note._id.slice(-6)}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{format(createdDate, "MMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{format(updatedDate, "MMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Word Count:</span>
                  <span>
                    {
                      content.split(/\s+/).filter((word) => word.length > 0)
                        .length
                    }{" "}
                    words
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/notes/${note._id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Note
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/notes">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to All Notes
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Note
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this note?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your note "{note.title}" and remove it from our
                        servers.
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditNotePage;
