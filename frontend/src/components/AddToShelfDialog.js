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
import { mockBooks } from "@/data/mockData";
import { addToShelf, SHELF_TYPES } from "@/data/readingShelfData";

export const AddToShelfDialog = ({ userId, onBookAdded }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [shelfType, setShelfType] = useState(SHELF_TYPES.WANT_TO_READ);
  const [recommendedBy, setRecommendedBy] = useState("");

  const filteredBooks = mockBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAdd = () => {
    if (!selectedBook) {
      alert("Please select a book");
      return;
    }

    addToShelf(
      userId,
      selectedBook.id,
      shelfType,
      shelfType === SHELF_TYPES.RECOMMENDED ? recommendedBy : null,
    );

    // Reset form
    setOpen(false);
    setSearchQuery("");
    setSelectedBook(null);
    setShelfType(SHELF_TYPES.WANT_TO_READ);
    setRecommendedBy("");

    onBookAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="add-to-shelf-button">
          <Plus className="mr-2" size={18} />
          Add Book to Shelf
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl" data-testid="add-book-dialog">
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
              data-testid="search-book-input"
            />
          </div>

          {/* Book Results */}
          {searchQuery && (
            <div className="max-h-48 overflow-y-auto border rounded-lg">
              {filteredBooks.length > 0 ? (
                filteredBooks.slice(0, 5).map((book) => (
                  <button
                    key={book.id}
                    onClick={() => {
                      setSelectedBook(book);
                      setSearchQuery("");
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    data-testid={`book-option-${book.id}`}
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-sm">{book.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {book.author}
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
                  src={selectedBook.coverUrl}
                  alt={selectedBook.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{selectedBook.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedBook.author}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Shelf Type */}
          <div>
            <Label>Add to Shelf</Label>
            <Select value={shelfType} onValueChange={setShelfType}>
              <SelectTrigger data-testid="shelf-type-select">
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

          {/* Recommended By (conditional) */}
          {shelfType === SHELF_TYPES.RECOMMENDED && (
            <div>
              <Label>Recommended By</Label>
              <Input
                value={recommendedBy}
                onChange={(e) => setRecommendedBy(e.target.value)}
                placeholder="Who recommended this book?"
                data-testid="recommended-by-input"
              />
            </div>
          )}

          <Button
            onClick={handleAdd}
            className="w-full"
            data-testid="confirm-add-button"
          >
            Add to Shelf
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
