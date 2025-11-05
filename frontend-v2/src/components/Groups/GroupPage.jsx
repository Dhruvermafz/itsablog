// src/pages/GroupPage.jsx
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
  Card,
} from "antd";
import { UserOutlined, PlusOutlined, CommentOutlined } from "@ant-design/icons";
import axios from "axios";
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

  // ------------------------------------------------------------------ FETCH
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [grpRes, postsRes] = await Promise.all([
          axios.get(`/api/groups/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/groups/${groupId}/posts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setGroup(grpRes.data);
        setPosts(postsRes.data);
      } catch (e) {
        message.error(e.response?.data?.message || "Failed to load group");
      } finally {
        setLoading(false);
      }
    };
    fetchGroupData();
  }, [groupId]);

  // ------------------------------------------------------------------ POST
  const handlePostSubmit = async (values) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/groups/${groupId}/posts`,
        { content: values.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([res.data, ...posts]);
      postForm.resetFields();
      message.success("Post created!");
    } catch (e) {
      message.error(e.response?.data?.message || "Failed to post");
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------------------- JOIN/LEAVE
  const isMember = () =>
    group?.members?.some((m) => m.user._id === localStorage.getItem("userId"));

  const handleJoinLeave = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = isMember()
        ? `/api/groups/${groupId}/leave`
        : `/api/groups/${groupId}/join`;
      const res = await axios.post(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success(res.data.message);
      const grp = await axios.get(`/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroup(grp.data);
    } catch (e) {
      message.error(e.response?.data?.message || "Failed to update membership");
    }
  };

  // ------------------------------------------------------------------ RENDER
  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (!group) return <div className={styles.noResults}>Group not found.</div>;

  return (
    <Layout className={styles.groupPage}>
      {/* -------------------------- BANNER -------------------------- */}
      <div className={styles.banner}>
        <img
          src={group.banner || "https://via.placeholder.com/1200x200"}
          alt="banner"
          className={styles.bannerImg}
        />
      </div>

      <Content className={styles.content}>
        {/* -------------------------- HEADER -------------------------- */}
        <div className={styles.header}>
          <Avatar
            src={group.image || "https://via.placeholder.com/80"}
            size={80}
            className={styles.avatar}
          />
          <div className={styles.headerInfo}>
            <Title level={2} className={styles.name}>
              {group.name}
            </Title>
            <Text type="secondary">{group.category || "General"}</Text>
          </div>
          <Button
            type={isMember() ? "default" : "primary"}
            size="large"
            onClick={handleJoinLeave}
            className={styles.joinBtn}
          >
            {isMember() ? "Leave Club" : "Member"}
          </Button>
        </div>

        {/* -------------------------- DESCRIPTION & META -------------------------- */}
        <div className={styles.details}>
          <Paragraph className={styles.desc}>
            {group.description || "No description available."}
          </Paragraph>
          <Space size="large">
            <Text>
              <UserOutlined /> {group.members?.length?.toLocaleString()} members
            </Text>
            <Text>Created by {group.creator?.username || "Unknown"}</Text>
          </Space>
        </div>

        {/* -------------------------- RULES -------------------------- */}
        {group.rules?.length > 0 && (
          <Card className={styles.rulesCard}>
            <Title level={5}>Rules</Title>
            <List
              dataSource={group.rules}
              renderItem={(r, i) => (
                <List.Item className={styles.ruleItem}>
                  {i + 1}. {r}
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* -------------------------- CREATE POST -------------------------- */}
        <Card className={styles.createCard}>
          <Title level={4}>
            What's on your mind, {localStorage.getItem("username")}?
          </Title>
          <Form form={postForm} onFinish={handlePostSubmit}>
            <Form.Item
              name="content"
              rules={[{ required: true, message: "Content required" }]}
            >
              <TextArea
                rows={3}
                placeholder="Share something…"
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
        </Card>

        {/* -------------------------- POSTS -------------------------- */}
        <Title level={4}>Posts</Title>
        {posts.length === 0 ? (
          <Text className={styles.noResults}>No posts yet. Be the first!</Text>
        ) : (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {posts.map((p) => (
              <GroupPost
                key={p._id}
                post={p}
                groupId={groupId}
                setPosts={setPosts}
              />
            ))}
          </Space>
        )}
      </Content>
    </Layout>
  );
};

export default GroupPage;
