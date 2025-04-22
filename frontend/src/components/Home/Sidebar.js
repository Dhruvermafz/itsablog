import React from "react";
import { Row, Col, Space, Card, Button, Typography } from "antd";
import { ReadOutlined, TeamOutlined } from "@ant-design/icons"; // Icons from Ant Design
import FindUsers from "../Extras/FindUsers";
import Footer from "./NavLinks";
import Loading from "./Loading";
import PostCard from "../Post/PostCard";
import TopPosts from "../Post/TopPosts";
import StickyWidget from "../Extras/StickyWidget";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Sidebar = () => {
  const navigate = useNavigate();

  const handleCardClick = (page) => {
    if (page === "newsroom") {
      navigate("/newsroom");
    } else if (page === "groups") {
      navigate("/groups");
    }
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <TopPosts />
      <FindUsers />
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            hoverable
            onClick={() => handleCardClick("newsroom")}
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            <ReadOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
            <Title level={4} style={{ marginTop: "10px" }}>
              Newsroom
            </Title>
            <p>
              A space for writers to post detailed and sophisticated articles.
            </p>
            <Button type="primary" block>
              Go to Newsroom
            </Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            onClick={() => handleCardClick("groups")}
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            <TeamOutlined style={{ fontSize: "48px", color: "#52c41a" }} />
            <Title level={4} style={{ marginTop: "10px" }}>
              Groups
            </Title>
            <p>
              Join and engage with different groups. Share quick posts up to 50
              characters.
            </p>
            <Button type="primary" block>
              Go to Groups
            </Button>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Sidebar;
