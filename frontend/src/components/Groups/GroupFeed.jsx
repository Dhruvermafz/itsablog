import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout, Row, Col, Typography, Input, Space, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import GroupCard from "./GroupCard";
import GroupFilters from "./GroupFilters";
import styles from "./Group.module.css";

const { Content } = Layout;
const { Title } = Typography;

const GroupFeed = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("/api/groups"); // Adjust URL
        setGroups(response.data);
        setFilteredGroups(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch groups error:", error);
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  // Handle search
  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (!value) {
      setFilteredGroups(groups);
      return;
    }
    try {
      const response = await axios.get(
        `/api/groups/search?query=${encodeURIComponent(value)}`
      );
      setFilteredGroups(response.data);
    } catch (error) {
      console.error("Search groups error:", error);
    }
  };

  // Handle filter changes
  const handleFilterChange = ({ category, sort }) => {
    let filtered = [...groups];

    // Filter by category
    if (category !== "All") {
      filtered = filtered.filter((group) => group.category === category);
    }

    // Sort groups
    if (sort === "popular") {
      filtered.sort((a, b) => b.members.length - a.members.length);
    } else if (sort === "new") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "active") {
      filtered.sort((a, b) => b.posts.length - a.posts.length); // Sort by post count
    }

    setFilteredGroups(filtered);
  };

  return (
    <Layout className={styles.groupFeed}>
      <Content className={styles.content}>
        <div className={styles.header}>
          <Title level={2} className={styles.title}>
            Discover Communities
          </Title>
          <Link to="/groups/create">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className={styles.createButton}
            >
              Create Community
            </Button>
          </Link>
        </div>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Input
            placeholder="Search communities..."
            prefix={<SearchOutlined />}
            className={styles.search}
            onChange={(e) => handleSearch(e.target.value)}
            value={searchQuery}
            size="large"
          />
          <GroupFilters onFilterChange={handleFilterChange} />
          <Row gutter={[24, 24]}>
            {loading ? (
              <Col span={24}>
                <Typography.Text>Loading...</Typography.Text>
              </Col>
            ) : filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <Col xs={24} sm={12} md={8} lg={6} key={group._id}>
                  <GroupCard group={group} />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Typography.Text className={styles.noResults}>
                  No communities found.
                </Typography.Text>
              </Col>
            )}
          </Row>
        </Space>
      </Content>
    </Layout>
  );
};

export default GroupFeed;
