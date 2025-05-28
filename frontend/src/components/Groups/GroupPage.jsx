import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Layout,
  Typography,
  Button,
  Avatar,
  List,
  Space,
  Form,
  Input,
  message,
} from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import GroupPost from "./GroupPost";
import styles from "./Group.module.css";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const GroupPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Fetch group details and posts
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [groupResponse, postsResponse] = await Promise.all([
          axios.get(`/api/groups/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/groups/${groupId}/posts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setGroup(groupResponse.data);
        setPosts(postsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch group data error:", error);
        message.error(
          error.response?.data?.message || "Failed to load group data"
        );
        setLoading(false);
      }
    };
    fetchGroupData();
  }, [groupId]);

  // Handle new post submission
  const handlePostSubmit = async (values) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/groups/${groupId}/posts`,
        { content: values.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([response.data, ...posts]); // Prepend new post
      postForm.resetFields();
      message.success("Post created successfully!");
    } catch (error) {
      console.error("Post to group error:", error);
      message.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle join/leave group
  const handleJoinLeave = async () => {
    try {
      const token = localStorage.getItem("token");
      const isMember = group.members.some(
        (m) => m.user._id === localStorage.getItem("userId")
      ); // Adjust based on auth
      const endpoint = isMember
        ? `/api/groups/${groupId}/leave`
        : `/api/groups/${groupId}/join`;
      const response = await axios.post(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success(response.data.message);
      // Refresh group data
      const groupResponse = await axios.get(`/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroup(groupResponse.data);
    } catch (error) {
      console.error("Join/leave group error:", error);
      message.error(
        error.response?.data?.message || "Failed to join/leave group"
      );
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!group) {
    return <div className={styles.noResults}>Group not found.</div>;
  }

  return (
    <Layout className={styles.groupPage}>
      <Content className={styles.content}>
        <div className={styles.groupHeader}>
          <Avatar
            src={group.image || "https://via.placeholder.com/64"}
            size={80}
            className={styles.groupAvatar}
          />
          <div>
            <Title level={2} className={styles.groupName}>
              {group.name}
            </Title>
            <Text type="secondary">{group.category || "General"}</Text>
          </div>
          <Button
            type={
              group.members.some(
                (m) => m.user._id === localStorage.getItem("userId")
              )
                ? "default"
                : "primary"
            }
            onClick={handleJoinLeave}
            className={styles.joinButton}
          >
            {group.members.some(
              (m) => m.user._id === localStorage.getItem("userId")
            )
              ? "Leave"
              : "Join"}{" "}
            Community
          </Button>
        </div>
        <div className={styles.groupDetails}>
          <Paragraph>
            {group.description || "No description available."}
          </Paragraph>
          <div className={styles.meta}>
            <Text>
              <UserOutlined /> {group.members.length.toLocaleString()} members
            </Text>
            <Text>Created by {group.creator?.username || "Unknown"}</Text>
          </div>
          {group.rules.length > 0 && (
            <div className={styles.rules}>
              <Title level={5}>Rules</Title>
              <List
                dataSource={group.rules}
                renderItem={(rule, index) => (
                  <List.Item>{`${index + 1}. ${rule}`}</List.Item>
                )}
              />
            </div>
          )}
        </div>
        <div className={styles.postSection}>
          <Title level={4}>Create a Post</Title>
          <Form
            form={postForm}
            onFinish={handlePostSubmit}
            className={styles.postForm}
          >
            <Form.Item
              name="content"
              rules={[{ required: true, message: "Post content is required" }]}
            >
              <TextArea
                rows={4}
                placeholder="What's on your mind?"
                showCount
                maxLength={1000}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={submitting}
                size="large"
              >
                Post
              </Button>
            </Form.Item>
          </Form>
          <Title level={4}>Posts</Title>
          {posts.length > 0 ? (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {posts.map((post) => (
                <GroupPost
                  key={post._id}
                  post={post}
                  groupId={groupId}
                  setPosts={setPosts}
                />
              ))}
            </Space>
          ) : (
            <Text className={styles.noResults}>
              No posts yet. Be the first to post!
            </Text>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default GroupPage;
