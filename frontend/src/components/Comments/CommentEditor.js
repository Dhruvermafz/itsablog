import React, { useState } from "react";
import { Button, Card, Typography, Input, message, Row, Col } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createComment } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import ErrorAlert from "../Extras/ErrorAlert";

const { TextArea } = Input;

const CommentEditor = ({ label, comment, addComment, setReplying }) => {
  const [formData, setFormData] = useState({ content: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      ...formData,
      parentId: comment && comment._id,
    };

    setLoading(true);
    const data = await createComment(body, params, isLoggedIn());
    setLoading(false);

    if (data.error) {
      setError(data.error);
      message.error(data.error);
    } else {
      setFormData({ content: "" });
      setReplying && setReplying(false);
      addComment(data);
      message.success("Comment submitted successfully");
    }
  };

  const handleFocus = () => {
    if (!isLoggedIn()) navigate("/login");
  };

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Typography.Title level={5}>
            {comment ? "Reply" : "Comment"}
          </Typography.Title>
        </Col>
        <Col>
          <Typography.Text>
            <a
              href="https://commonmark.org/help/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Markdown Help
            </a>
          </Typography.Text>
        </Col>
      </Row>

      <form onSubmit={handleSubmit}>
        <TextArea
          name="content"
          rows={5}
          placeholder={label}
          required
          onChange={handleChange}
          onFocus={handleFocus}
          value={formData.content}
          style={{ backgroundColor: "white", marginBottom: 16 }}
        />

        {error && <ErrorAlert error={error} />}

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          style={{ marginTop: 16 }}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Card>
  );
};

export default CommentEditor;
