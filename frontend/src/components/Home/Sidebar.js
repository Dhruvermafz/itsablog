import React from "react";
import { Row, Col, Space } from "antd"; // Ant Design's layout components
import FindUsers from "../Extras/FindUsers";
import Footer from "./NavLinks";
import Loading from "./Loading";
import PostCard from "../Post/PostCard";
import TopPosts from "../Post/TopPosts";
import StickyWidget from "../Extras/StickyWidget";
import { Card, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom"; // For navigation

const { Title } = Typography;
const Sidebar = () => {
  const history = useNavigate();

  const handleCardClick = (page) => {
    if (page === "newsroom") {
      history("/newsroom"); // Navigate to Newsroom page
    } else if (page === "groups") {
      history("/groups"); // Navigate to Groups page
    }
  };
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <TopPosts />
      <FindUsers />
      <Row gutter={16}>
        <Col span={12}>
          <Card
            hoverable
            cover={
              <img
                alt="Newsroom"
                src="https://via.placeholder.com/400x200?text=Newsroom"
              />
            }
            onClick={() => handleCardClick("newsroom")}
            style={{ cursor: "pointer" }}
          >
            <Card.Meta
              title="Newsroom"
              description="A space for writers to post detailed and sophisticated articles."
            />
            <Button type="primary" block style={{ marginTop: "10px" }}>
              Go to Newsroom
            </Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            cover={
              <img
                alt="Groups"
                src="https://via.placeholder.com/400x200?text=Groups"
              />
            }
            onClick={() => handleCardClick("groups")}
            style={{ cursor: "pointer" }}
          >
            <Card.Meta
              title="Groups"
              description="Join and engage with different groups. Share quick posts up to 50 characters."
            />
            <Button type="primary" block style={{ marginTop: "10px" }}>
              Go to Groups
            </Button>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Sidebar;
