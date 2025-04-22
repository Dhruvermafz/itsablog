import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Row, Col, Typography, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../../css/error500.css";

const { Title, Paragraph } = Typography;

export default function NotFound() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        padding: "50px 20px",
        minHeight: "100vh",
        background: "linear-gradient(to right, #f9f9fa, #ffffff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Row
        gutter={[32, 32]}
        justify="center"
        align="middle"
        style={{ maxWidth: 1000, width: "100%" }}
      >
        <Col xs={24} md={12} style={{ textAlign: "center" }}>
          <Player
            autoplay
            loop
            style={{ height: "350px", maxWidth: "100%" }}
            src="../../static/error/ERROR.png"
          />
        </Col>

        <Col xs={24} md={12} style={{ textAlign: "center" }}>
          <Title
            level={1}
            style={{
              background: "linear-gradient(90deg, #1890ff, #722ed1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Oops! 404
          </Title>
          <Paragraph style={{ fontSize: "18px", color: "#555" }}>
            The page you're looking for doesn't exist or has been moved.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={handleBackHome}
            style={{
              marginTop: "20px",
              background: "#722ed1",
              borderColor: "#722ed1",
              boxShadow: "0 4px 12px rgba(114, 46, 209, 0.3)",
            }}
          >
            Go to Homepage
          </Button>
        </Col>
      </Row>
    </div>
  );
}
