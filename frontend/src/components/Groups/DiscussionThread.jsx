import { List, Avatar, Typography, Button, Input, Space } from "antd";
import { LikeOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./Group.module.css";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

// Mock comment data
const comments = [
  {
    id: 1,
    author: "Ali Khan",
    avatar: "https://example.com/avatar.jpg",
    content: "Loved the latest Urdu poetry discussion!",
    datetime: "2 hours ago",
    likes: 12,
    children: [
      {
        id: 2,
        author: "Sara Ahmed",
        avatar: "https://example.com/avatar2.jpg",
        content: "Same! Any favorite poets?",
        datetime: "1 hour ago",
        likes: 5,
      },
    ],
  },
];

const CommentItem = ({ comment, level = 0 }) => (
  <div
    className={styles.commentItem}
    style={{ marginLeft: level * 20 }} // Indent nested comments
  >
    <Space align="start" size={12}>
      <Avatar
        src={comment.avatar}
        icon={<UserOutlined />}
        size={36}
        className={styles.commentAvatar}
      />
      <div className={styles.commentContent}>
        <Space direction="vertical" size={4}>
          <Space>
            <Text strong>{comment.author}</Text>
            <Text type="secondary">{comment.datetime}</Text>
          </Space>
          <Paragraph className={styles.commentText}>
            {comment.content}
          </Paragraph>
          <Space>
            <Button type="link" icon={<LikeOutlined />}>
              {comment.likes} Like
            </Button>
            <Button type="link">Reply</Button>
          </Space>
        </Space>
      </div>
    </Space>
    {comment.children && (
      <List
        dataSource={comment.children}
        renderItem={(child) => (
          <CommentItem comment={child} level={level + 1} />
        )}
      />
    )}
  </div>
);

const DiscussionThread = () => {
  return (
    <div className={styles.discussionThread}>
      <List
        dataSource={comments}
        renderItem={(item) => <CommentItem comment={item} />}
      />
      <div className={styles.replySection}>
        <TextArea rows={3} placeholder="Join the discussion..." />
        <Button
          type="primary"
          icon={<SendOutlined />}
          className={styles.replyButton}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default DiscussionThread;
