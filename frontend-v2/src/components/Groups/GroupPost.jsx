// src/components/GroupPost.jsx
import { useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Button,
  Form,
  Input,
  List,
  Space,
  message,
} from "antd";
import { UserOutlined, CommentOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "./Group.module.css";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const GroupPost = ({ post, groupId, setPosts }) => {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [commentForm] = Form.useForm();
  const [commenting, setCommenting] = useState(false);

  // --------------------------------------------------------------- COMMENT
  const submitComment = async (vals) => {
    setCommenting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/posts/${post._id}/comments`,
        { content: vals.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) => prev.map((p) => (p._id === post._id ? res.data : p)));
      commentForm.resetFields();
      message.success("Comment added");
    } catch (e) {
      message.error(e.response?.data?.message || "Failed to comment");
    } finally {
      setCommenting(false);
    }
  };

  // --------------------------------------------------------------- RENDER
  return (
    <Card className={styles.postCard}>
      {/* ---------- AUTHOR ---------- */}
      <div className={styles.postHeader}>
        <Avatar
          src={post.user?.avatar || "https://via.placeholder.com/40"}
          size={40}
          icon={<UserOutlined />}
        />
        <div>
          <Text strong>{post.user?.username || "Unknown"}</Text>
          <Text type="secondary" className={styles.time}>
            {new Date(post.createdAt).toLocaleString()}
          </Text>
        </div>
      </div>

      {/* ---------- CONTENT ---------- */}
      <Paragraph className={styles.postText}>{post.content}</Paragraph>

      {/* ---------- SPOILER IMAGE ---------- */}
      {post.spoilerImage && (
        <div className={styles.spoilerWrapper}>
          <div className={showSpoiler ? styles.spoilerImg : styles.spoilerBlur}>
            <img
              src={post.spoilerImage}
              alt="spoiler"
              className={styles.spoilerImg}
            />
          </div>
          {!showSpoiler && (
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => setShowSpoiler(true)}
              className={styles.showSpoilerBtn}
            >
              Show spoilers
            </Button>
          )}
        </div>
      )}

      {/* ---------- COMMENT SECTION ---------- */}
      <div className={styles.commentSection}>
        <Text>
          <CommentOutlined /> {post.comments?.length || 0} comments
        </Text>

        {/* comment form */}
        <Form
          form={commentForm}
          onFinish={submitComment}
          className={styles.commentForm}
        >
          <Form.Item
            name="content"
            rules={[{ required: true, message: "Write something" }]}
          >
            <TextArea rows={2} placeholder="Add a comment…" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={commenting}
              size="small"
            >
              Comment
            </Button>
          </Form.Item>
        </Form>

        {/* comment list */}
        {post.comments?.length > 0 && (
          <List
            dataSource={post.comments}
            renderItem={(c) => (
              <List.Item className={styles.commentItem}>
                <Space direction="vertical" size={0}>
                  <Text strong>{c.user?.username || "Anon"}</Text>
                  <Text type="secondary" className={styles.commentTime}>
                    {new Date(c.createdAt).toLocaleString()}
                  </Text>
                  <Paragraph className={styles.commentText}>
                    {c.content}
                  </Paragraph>
                </Space>
              </List.Item>
            )}
          />
        )}
      </div>
    </Card>
  );
};

export default GroupPost;
