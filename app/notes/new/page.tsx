"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Save, PenTool } from "lucide-react";
import { PageActions } from "@/components/page-actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NewNote = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveNote();
  };

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        router.push("/notes");
      } else {
        console.error("Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-69px)] bg-background">
      <PageActions
        title="Create New Note"
        backHref="/notes"
        backLabel="Back to Notes"
        actions={[
          {
            label: isLoading ? "Saving..." : "Save Note",
            icon: <Save className="h-4 w-4" />,
            onClick: saveNote,
            variant: "default",
            disabled: isLoading,
          },
        ]}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5 text-primary" />
                Create New Note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Note"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    asChild
                  >
                    <Link href="/notes">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-3">Writing Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Write freely without worrying about perfection</li>
              <li>• Include specific details to make memories more vivid</li>
              <li>• Reflect on what you learned or how you felt</li>
              <li>• Consider what you&apos;re grateful for today</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewNote;
