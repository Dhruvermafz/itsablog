import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spin, Alert, List, Typography } from "antd";

const { Title, Text } = Typography;

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
    <div className="book-reviews-container" style={{ padding: "20px" }}>
      {loading && (
        <div className="spinner-container" style={{ textAlign: "center" }}>
          <Spin size="large" />
        </div>
      )}
      {error && (
        <Alert
          message={`Error: ${error.message}`}
          type="error"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      )}
      {newReleases.length > 0 && (
        <List
          className="book-reviews-list"
          itemLayout="horizontal"
          dataSource={newReleases}
          renderItem={(book, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                title={
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "18px", fontWeight: "bold" }}
                  >
                    {book.title}
                  </a>
                }
                description={
                  <>
                    <Text>Rating: {book.rating}</Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
}

export default BookReviews;
