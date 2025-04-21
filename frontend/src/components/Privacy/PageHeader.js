import React from "react";
import { Typography, Row, Col, Image, Divider } from "antd";
import { FileProtectOutlined } from "@ant-design/icons";
import privacyBanner from "../../static/img/resources/baner-badges.png";

const { Title, Paragraph } = Typography;

const PageHeader = () => {
  return (
    <section className="privacy">
      <Row justify="center" align="middle" gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <Typography>
            <Title level={2}>
              <FileProtectOutlined style={{ marginRight: 10 }} />
              Privacy & Policy
            </Title>
            <Paragraph style={{ fontSize: "16px", color: "#555" }}>
              Here you’ll find all the Privacy, Policies, & user agreements etc.
              you can read and save to your computer.
            </Paragraph>
            <Divider />
          </Typography>
        </Col>
        <Col xs={24} md={10}>
          <Image
            src={privacyBanner}
            alt="Privacy and Policy Banner"
            preview={false}
            width="100%"
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />
        </Col>
      </Row>
    </section>
  );
};

export default PageHeader;
