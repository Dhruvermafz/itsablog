import mongoose from "mongoose";

const listItemSchema = new mongoose.Schema(
  {
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
      index: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },

    note: String,

    position: {
      type: Number, // ordering inside list
    },
  },
  { timestamps: true },
);

// Prevent duplicate books in same list
listItemSchema.index({ list: 1, book: 1 }, { unique: true });

export default mongoose.model("ListItem", listItemSchema);
