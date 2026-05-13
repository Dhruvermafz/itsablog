"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { useGetBooksQuery } from "@/api/bookApi";

import { useUpsertReadingLogMutation } from "@/api/userApi";

const SHELF_TYPES = {
  CURRENTLY_READING: "currently_reading",
  WANT_TO_READ: "want_to_read",
  RECOMMENDED: "recommended",
  FINISHED: "finished",
};

export const AddToShelfDialog = ({ userId, onBookAdded }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [shelfType, setShelfType] = useState(SHELF_TYPES.WANT_TO_READ);
  const [recommendedBy, setRecommendedBy] = useState("");

  const [upsertReadingLog, { isLoading: isAdding }] =
    useUpsertReadingLogMutation();

  // Search books using real API
  const { data: booksResponse, isFetching } = useGetBooksQuery(
    { search: searchQuery, limit: 10 },
    { skip: !searchQuery },
  );

  const filteredBooks = booksResponse?.books || [];

  const handleAdd = async () => {
    if (!selectedBook) {
      alert("Please select a book");
      return;
    }

    try {
      await upsertReadingLog({
        bookId: selectedBook._id || selectedBook.id,
        shelfType: shelfType,
        recommendedBy:
          shelfType === SHELF_TYPES.RECOMMENDED ? recommendedBy : null,
      }).unwrap();

      // Reset form
      setOpen(false);
      setSearchQuery("");
      setSelectedBook(null);
      setShelfType(SHELF_TYPES.WANT_TO_READ);
      setRecommendedBy("");

      alert("Book added to shelf successfully!");
      onBookAdded();
    } catch (error) {
      console.error(error);
      alert(error?.data?.message || "Failed to add book to shelf");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" size={18} />
          Add Book to Shelf
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Add Book to Your Shelf
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Search Books */}
          <div>
            <Label>Search Book</Label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
            />
          </div>

          {/* Book Results */}
          {searchQuery && (
            <div className="max-h-48 overflow-y-auto border rounded-lg">
              {isFetching ? (
                <p className="p-4 text-sm text-center">Searching...</p>
              ) : filteredBooks.length > 0 ? (
                filteredBooks.slice(0, 6).map((book) => (
                  <button
                    key={book._id || book.id}
                    onClick={() => {
                      setSelectedBook(book);
                      setSearchQuery("");
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left border-b last:border-none"
                  >
                    <img
                      src={book.coverUrl || book.coverImage}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-sm">{book.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {book.author?.name || book.author}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="p-4 text-sm text-slate-600 dark:text-slate-400 text-center">
                  No books found
                </p>
              )}
            </div>
          )}

          {/* Selected Book */}
          {selectedBook && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Selected Book:
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={selectedBook.coverUrl || selectedBook.coverImage}
                  alt={selectedBook.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{selectedBook.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedBook.author?.name || selectedBook.author}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Shelf Type */}
          <div>
            <Label>Add to Shelf</Label>
            <Select value={shelfType} onValueChange={setShelfType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SHELF_TYPES.CURRENTLY_READING}>
                  Currently Reading
                </SelectItem>
                <SelectItem value={SHELF_TYPES.WANT_TO_READ}>
                  Want to Read
                </SelectItem>
                <SelectItem value={SHELF_TYPES.RECOMMENDED}>
                  Recommended by Someone
                </SelectItem>
                <SelectItem value={SHELF_TYPES.FINISHED}>Finished</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recommended By */}
          {shelfType === SHELF_TYPES.RECOMMENDED && (
            <div>
              <Label>Recommended By</Label>
              <Input
                value={recommendedBy}
                onChange={(e) => setRecommendedBy(e.target.value)}
                placeholder="Who recommended this book?"
              />
            </div>
          )}

          <Button
            onClick={handleAdd}
            className="w-full"
            disabled={isAdding || !selectedBook}
          >
            {isAdding ? "Adding..." : "Add to Shelf"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
