"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Trash2, StickyNote, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import {
  removeFromShelf,
  getBookNote,
  saveNote,
  deleteNote,
} from "@/data/readingShelfData";

export const BookShelfItem = ({
  book,
  shelfType,
  recommendedBy,
  userId,
  onRemove,
}) => {
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState(() => {
    const existingNote = getBookNote(userId, book.id);
    return existingNote ? existingNote.content : "";
  });
  const [hasNote, setHasNote] = useState(() => {
    const existingNote = getBookNote(userId, book.id);
    return !!existingNote;
  });

  const handleSaveNote = () => {
    if (noteContent.trim()) {
      saveNote(userId, book.id, noteContent);
      setHasNote(true);
      setNoteDialogOpen(false);
    }
  };

  const handleDeleteNote = () => {
    deleteNote(userId, book.id);
    setNoteContent("");
    setHasNote(false);
  };

  const handleRemove = () => {
    removeFromShelf(userId, book.id);
    onRemove();
  };

  const getShelfLabel = (type) => {
    const labels = {
      currently_reading: "Reading",
      want_to_read: "Want to Read",
      recommended: "Recommended",
      finished: "Finished",
    };
    return labels[type] || type;
  };

  return (
    <div className="group relative" data-testid={`shelf-book-${book.id}`}>
      {/* Book Cover */}
      <Link
        href={`/book/${book.id}`}
        className="block relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 transition-all duration-300 hover:shadow-2xl hover:scale-105"
        style={{ aspectRatio: "2/3" }}
      >
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-serif font-semibold text-sm mb-1 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-xs opacity-90">{book.author}</p>
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {getShelfLabel(shelfType)}
          </Badge>
          {hasNote && (
            <Badge variant="outline" className="text-xs">
              <StickyNote size={12} className="mr-1" />
              Note
            </Badge>
          )}
        </div>

        {recommendedBy && (
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Recommended by {recommendedBy}
          </p>
        )}

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8"
                data-testid={`note-button-${book.id}`}
              >
                <StickyNote size={14} className="mr-1" />
                {hasNote ? "Edit" : "Note"}
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="note-dialog">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">
                  Private Note
                </DialogTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {book.title}
                </p>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write your private thoughts, favorite quotes, or reminders about this book..."
                  rows={8}
                  className="resize-none"
                  data-testid="note-textarea"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveNote}
                    className="flex-1"
                    data-testid="save-note-button"
                  >
                    Save Note
                  </Button>
                  {hasNote && (
                    <Button
                      variant="destructive"
                      onClick={handleDeleteNote}
                      data-testid="delete-note-button"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="text-xs h-8"
            data-testid={`remove-button-${book.id}`}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};
