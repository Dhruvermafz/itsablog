import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spin, Alert, List } from "antd";
import "../../css/book.css"; // Import the CSS file with improved classnames

function BookReviews() {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewReleases = async () => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/books/v1/volumes",
        {
          params: {
            q: "subject:literature", // Specify new releases in the literature category
            maxResults: 5,
          },
        }
      );

      const books = response.data.items;

      const formattedBooks = books.map((book) => {
        const title = book.volumeInfo.title || "Unknown Title";
        const rating = book.volumeInfo.averageRating || "N/A";
        const link = book.volumeInfo.canonicalVolumeLink || "#";

        return { title, rating, link };
      });

      setNewReleases(formattedBooks);
      setLoading(false);
      setError(null);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewReleases();
  }, []);

  return (
    <div className="book-reviews-container">
      {loading && (
        <div className="spinner-container">
          <Spin size="large" />
        </div>
      )}
      {error && <Alert message={`Error: ${error.message}`} type="error" />}
      {newReleases.length > 0 && (
        <List
          className="book-reviews-list"
          dataSource={newReleases}
          renderItem={(book, index) => (
            <List.Item className="book-item" key={index}>
              <h3 className="book-item-title">
                <a
                  className="book-item-link"
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {book.title}
                </a>
              </h3>
              <p className="book-item-rating">Rating: {book.rating}</p>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}

export default BookReviews;
