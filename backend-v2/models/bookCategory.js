import mongoose from "mongoose";

const bookCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: String,

    icon: String, // emoji or icon name

    color: String, // gradient string

    // Instead of storing books array → relation table later
  },
  { timestamps: true },
);

export default mongoose.model("BookCategory", bookCategorySchema);
