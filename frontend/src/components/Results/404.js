import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Row, Col, Typography } from "antd";

const { Title } = Typography;

export default function NotFound() {
  return (
    <div style={{ padding: "50px" }}>
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col>
          <Title level={1} style={{ textAlign: "center" }}>
            Page Not Found
          </Title>
          <Player
            autoplay
            loop
            style={{ height: "500px", display: "block", margin: "0 auto" }}
            src="https://assets1.lottiefiles.com/packages/lf20_zxliqmhr.json"
          />
        </Col>
      </Row>
    </div>
  );
}
