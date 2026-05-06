import mongoose from "mongoose";

const bookCategoryMapSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookCategory",
  },
});

bookCategoryMapSchema.index({ book: 1, category: 1 }, { unique: true });

export default mongoose.model("BookCategoryMap", bookCategoryMapSchema);
