// utils/googleBooks.js
import axios from "axios";

export const fetchBookFromGoogle = async (title) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: { q: title, maxResults: 1 },
      }
    );

    const book = response.data.items?.[0];
    if (!book) return null;

    return {
      googleBookId: book.id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.[0],
      bookLink: book.volumeInfo.infoLink,
    };
  } catch (err) {
    console.error("Google Books API Error:", err.message);
    return null;
  }
};
