import React, { useState } from "react";
import { Button, Card, Typography, Input, message } from "antd";
import { Box } from "@mui/system";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createComment } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import ErrorAlert from "../Extras/ErrorAlert";
import HorizontalStack from "../util/HorizontalStack";

const { TextArea } = Input;

const CommentEditor = ({ label, comment, addComment, setReplying }) => {
  const [formData, setFormData] = useState({
    content: "",
  });

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

  const handleFocus = (e) => {
    !isLoggedIn() && navigate("/login");
  };

  return (
    <Card>
      <div style={{ marginBottom: "16px" }}>
        <HorizontalStack justifyContent="space-between">
          <Typography.Title level={5}>
            {comment ? <>Reply</> : <>Comment</>}
          </Typography.Title>
          <Typography.Text>
            <a
              href="https://commonmark.org/help/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Markdown Help
            </a>
          </Typography.Text>
        </HorizontalStack>
      </div>

      <form onSubmit={handleSubmit}>
        <TextArea
          name="content"
          rows={5}
          placeholder={label}
          required
          onChange={handleChange}
          onFocus={handleFocus}
          value={formData.content}
          style={{ backgroundColor: "white", marginBottom: "16px" }}
        />

        {error && <ErrorAlert error={error} />}
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          style={{ marginTop: "16px" }}
        >
          {loading ? "Submitting" : "Submit"}
        </Button>
      </form>
    </Card>
  );
};

export default CommentEditor;
