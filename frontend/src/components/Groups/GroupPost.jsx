import { useState } from "react";
import {
  Card,
  Typography,
  Avatar,
  Form,
  Input,
  Button,
  List,
  message,
} from "antd";
import { UserOutlined, CommentOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "./Group.module.css";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const GroupPost = ({ post, groupId, setPosts }) => {
  const [commentForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleCommentSubmit = async (values) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/posts/${post._id}/comments`,
        { content: values.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === post._id ? response.data : p))
      );
      commentForm.resetFields();
      message.success("Comment added successfully!");
    } catch (error) {
      console.error("Comment on post error:", error);
      message.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className={styles.postCard}>
      <div className={styles.postHeader}>
        <Avatar
          src={post.user?.avatar || "https://via.placeholder.com/40"}
          size={40}
        />
        <div>
          <Text strong>{post.user?.username || "Unknown"}</Text>
          <Text type="secondary" className={styles.postMeta}>
            {new Date(post.createdAt).toLocaleString()}
          </Text>
        </div>
      </div>
      <Paragraph className={styles.postContent}>{post.content}</Paragraph>
      <div className={styles.commentsSection}>
        <Text>
          <CommentOutlined /> {post.comments.length} comments
        </Text>
        <Form
          form={commentForm}
          onFinish={handleCommentSubmit}
          className={styles.commentForm}
        >
          <Form.Item
            name="content"
            rules={[{ required: true, message: "Comment content is required" }]}
          >
            <TextArea
              rows={2}
              placeholder="Add a comment..."
              showCount
              maxLength={500}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              size="small"
            >
              Comment
            </Button>
          </Form.Item>
        </Form>
        {post.comments.length > 0 && (
          <List
            dataSource={post.comments}
            renderItem={(comment) => (
              <List.Item className={styles.commentItem}>
                <div>
                  <Text strong>{comment.user?.username || "Unknown"}</Text>
                  <Text type="secondary" className={styles.commentMeta}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </Text>
                  <Paragraph>{comment.content}</Paragraph>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
    </Card>
  );
};

export default GroupPost;
