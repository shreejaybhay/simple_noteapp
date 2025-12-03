"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Search,
  Calendar,
  BookOpen,
  Edit3,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/app/loading";

interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const Notes = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notes from API
  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else {
        console.error("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) router.push("/login");
  }, [session, status, router]);

  // Fetch notes when session is available
  React.useEffect(() => {
    if (session) {
      fetchNotes();
    }
  }, [session]);



  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-[calc(100vh-69px)] bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search your notes..." className="pl-10" />
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => {
            const createdDate = new Date(note.createdAt);
            const formattedDate = createdDate.toLocaleDateString();
            const formattedTime = createdDate.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            });

            return (
              <Card
                key={note._id}
                className="hover:shadow-md transition-shadow group relative"
              >
                <Link
                  href={`/notes/${note._id}`}
                  className="absolute inset-0 z-10"
                />
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
                      <Link href={`/notes/${note._id}/edit`}>
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span>{formattedTime}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                    {note.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State (when no notes) */}
        {notes.length === 0 && (
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
  );
};

export default Notes;
