import React, { useState } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Rate,
  message,
  Card,
  AutoComplete,
  Space,
  Modal,
} from "antd";
import { StarOutlined, CloseCircleOutlined } from "@ant-design/icons";

const AddBookReviewModal = ({ visible, onClose }) => {
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = async (query) => {
    if (!query) {
      setBooks([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5`
      );
      const bookList = response.data.items || [];
      setBooks(
        bookList.map((book) => ({
          value: book.volumeInfo.title,
          ...book.volumeInfo,
        }))
      );
    } catch (err) {
      message.error("Failed to fetch book suggestions");
    }
  };

  const handleBookSelect = (value) => {
    const book = books.find((book) => book.title === value);
    setSelectedBook(book);
    setTitle(value);
  };

  const handleRemoveBook = () => {
    setSelectedBook(null);
    setTitle("");
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        "/api/book-reviews",
        { title, review, rating },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      message.success("Review posted!");
      // Reset fields
      setTitle("");
      setReview("");
      setRating(0);
      setSelectedBook(null);
      onClose(); // Close the modal
    } catch (err) {
      message.error(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Modal
      title="Add a Book Review"
      visible={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Post Review"
      okButtonProps={{ icon: <StarOutlined /> }}
    >
      {/* Book Title Search with Autocomplete */}
      <AutoComplete
        style={{ width: "100%", marginBottom: 16 }}
        options={books.map((book) => ({
          label: book.title,
          value: book.title,
        }))}
        onSearch={fetchBooks}
        onSelect={handleBookSelect}
        value={title}
      >
        <Input placeholder="Search for a Book" />
      </AutoComplete>

      {/* Remove Book */}
      {selectedBook && (
        <Space style={{ marginBottom: 16 }}>
          <Button
            icon={<CloseCircleOutlined />}
            onClick={handleRemoveBook}
            style={{ color: "red", borderColor: "red" }}
          >
            Remove Book
          </Button>
        </Space>
      )}

      {/* Book Details Card */}
      {selectedBook && (
        <Card
          title={selectedBook.title}
          cover={
            selectedBook.imageLinks?.thumbnail ? (
              <img
                alt={selectedBook.title}
                src={selectedBook.imageLinks.thumbnail}
              />
            ) : null
          }
          style={{ marginBottom: 16 }}
        >
          <p>
            <strong>Author(s):</strong>{" "}
            {selectedBook.authors?.join(", ") || "N/A"}
          </p>
          <p>
            <strong>Publisher:</strong> {selectedBook.publisher || "N/A"}
          </p>
          <p>
            <strong>Published Date:</strong>{" "}
            {selectedBook.publishedDate || "N/A"}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {selectedBook.description || "No description available."}
          </p>
        </Card>
      )}

      {/* Review Textarea */}
      <Input.TextArea
        placeholder="Write your review"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows={4}
        required
        style={{ marginBottom: 16 }}
      />

      {/* Rating */}
      <div style={{ marginBottom: 16 }}>
        <Rate
          allowClear
          allowHalf
          value={rating}
          onChange={(value) => setRating(value)}
          style={{ fontSize: 24 }}
          character={<StarOutlined />}
        />
      </div>
    </Modal>
  );
};

export default AddBookReviewModal;
