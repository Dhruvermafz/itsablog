import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Flex,
  Avatar,
  Alert,
  Select,
  Tooltip,
} from "antd";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { motion } from "framer-motion";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { createPost } from "../../api/posts"; // API function for creating posts

const { Title, Text, Link } = Typography;

// Mock isLoggedIn function - replace with actual auth logic
const isLoggedIn = () => ({
  username: "JohnDoe",
  id: "mockUserId123", // Mock user ID for poster field
});

// Tiptap editor component
const TiptapEditor = ({ content, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit, // Basic formatting (bold, italic, headings, lists, etc.)
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: 6,
        padding: 12,
        minHeight: 250,
        background: "#fff",
        transition: "border-color 0.3s",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#1890ff")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#d9d9d9")}
    >
      <EditorContent editor={editor} />
    </div>
  );
};

const CreatePost = () => {
  const navigate = useNavigate();
  const user = isLoggedIn();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [serverError, setServerError] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Handle editor content change
  const handleEditorChange = (content) => {
    setEditorContent(content);
    form.setFieldsValue({ content });
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    setServerError("");

    const postData = {
      title: values.title,
      content: values.content,
      category: values.category,
      status: values.status,
      poster: user.id,
    };

    try {
      const data = await createPost(postData);
      if (data && data.error) {
        setServerError(data.error);
      } else {
        navigate(`/blog/${data._id}`);
      }
    } catch (error) {
      setServerError("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate(-1);
  };

  // Category options
  const categoryOptions = [
    { value: "technology", label: "Technology" },
    { value: "politics", label: "Politics" },
    { value: "travel", label: "Travel" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "food", label: "Food" },
    { value: "health", label: "Health" },
  ];

  // Status options
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ];

  // Animation variants for card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}
    >
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
          background: "#fff",
          padding: "24px",
        }}
      >
        <div className="blog-portal">
          {user && (
            <Flex align="center" gap={16} style={{ marginBottom: 24 }}>
              <Avatar
                size={48}
                style={{ backgroundColor: "#1890ff", flexShrink: 0 }}
                icon={
                  <Text style={{ color: "#fff" }}>
                    {user.username[0].toUpperCase()}
                  </Text>
                }
                aria-label={`Avatar for ${user.username}`}
              />
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: "#1a1a1a",
                  fontWeight: 600,
                }}
              >
                What's on your mind, {user.username}?
              </Title>
            </Flex>
          )}

          <Link
            href="https://commonmark.org/help/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginBottom: 24,
              display: "block",
              color: "#1890ff",
              fontSize: 14,
            }}
          >
            Markdown Help
          </Link>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{ status: "draft" }}
          >
            <Form.Item
              name="title"
              rules={[
                { required: true, message: "Please enter a title" },
                { max: 80, message: "Title must be 80 characters or less" },
              ]}
            >
              <Input
                placeholder="Enter post title"
                size="large"
                prefix={<EditOutlined />}
                style={{
                  borderRadius: 6,
                  padding: "10px 14px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder="Select category"
                size="large"
                style={{ width: "100%", borderRadius: 6 }}
                options={categoryOptions}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>

            <Form.Item
              name="status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select
                placeholder="Select status"
                size="large"
                style={{ width: "100%", borderRadius: 6 }}
                options={statusOptions}
              />
            </Form.Item>

            <Form.Item
              name="content"
              rules={[{ required: true, message: "Please enter content" }]}
            >
              <TiptapEditor
                content={editorContent}
                onChange={handleEditorChange}
                placeholder="Write your blog here..."
              />
            </Form.Item>

            {serverError && (
              <Alert
                message={serverError}
                type="error"
                showIcon
                style={{ marginBottom: 24, borderRadius: 6 }}
              />
            )}

            <Flex gap={12}>
              <Tooltip title="Save your post">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  icon={<SaveOutlined />}
                  style={{
                    flex: 1,
                    borderRadius: 6,
                    background: "#1890ff",
                    border: "none",
                    transition: "all 0.3s",
                  }}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </Tooltip>
              <Tooltip title="Cancel and go back">
                <Button
                  size="large"
                  onClick={handleCancel}
                  icon={<CloseOutlined />}
                  style={{ borderRadius: 6 }}
                >
                  Cancel
                </Button>
              </Tooltip>
            </Flex>
          </Form>
        </div>
      </Card>
    </motion.div>
  );
};

export default CreatePost;
