import React from "react";
import { Row, Col, Typography, Image, Space } from "antd";
import logo from "../static/img/icon.png";
import gif from "../static/img/resources/error500.gif";
import "../css/error500.css";

const { Title, Paragraph } = Typography;

const Error500 = () => {
  return (
    <div className="www-layout">
      <section>
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
          <Col xs={24} sm={18} md={16} lg={12} xl={8}>
            <div className="error-page500">
              <Row justify="center">
                <Col>
                  <div className="big-font">
                    <Title
                      level={1}
                      style={{ fontSize: "100px", color: "#ff4d4f" }}
                    >
                      500
                    </Title>
                  </div>
                </Col>
              </Row>
              <div className="error-meta" style={{ textAlign: "center" }}>
                <a href="#" title="">
                  <Image width={100} src={logo} alt="Logo" />
                </a>
                <Title level={3}>Unexpected Internal Server Error 500</Title>
                <Paragraph>
                  The server has been deserted for a while. Please be patient or
                  try again later.
                </Paragraph>
                <Image width={400} src={gif} alt="Error Image" />
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </div>
  );
};

export default Error500;
