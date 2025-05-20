import React from "react";
import { Layout, Typography, Divider } from "antd";
import {
  BookOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "../css/terms.css";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const TermsAndConditions = () => {
  return (
    <>
      <Layout className="terms-layout">
        <Content className="terms-container">
          <div className="terms-header">
            <BookOutlined style={{ fontSize: 32, color: "#4a90e2" }} />
            <Title level={2}>Terms & Conditions</Title>
            <Text type="secondary">Last Updated: April 16, 2025</Text>
          </div>

          <Divider />

          <Typography className="terms-content">
            <Paragraph>
              Welcome to <strong>ItsABlog</strong> — an open-source multi-user
              blogging platform built by a developer and writer for everyone who
              has a say, but no medium to start with. By accessing or using our
              platform, you agree to be bound by the following terms.
            </Paragraph>

            <Title level={4}>
              <UserOutlined /> 1. User Responsibilities
            </Title>
            <Paragraph>
              Users are expected to maintain respectful behavior, avoid harmful
              content, and take full responsibility for what they post.
              Plagiarism, hate speech, or illegal content is strictly
              prohibited.
            </Paragraph>

            <Title level={4}>
              <ExclamationCircleOutlined /> 2. Content Ownership
            </Title>
            <Paragraph>
              You retain full ownership of your content. By posting on ItsABlog,
              you grant us a non-exclusive license to distribute your content
              solely for platform-related purposes.
            </Paragraph>

            <Title level={4}>
              <BookOutlined /> 3. Open-Source Contribution
            </Title>
            <Paragraph>
              ItsABlog is open-source. Contributors must ensure submitted code
              is their own and doesn’t violate any licenses. All contributions
              are welcome, but subject to review and approval.
            </Paragraph>

            <Title level={4}>
              <ExclamationCircleOutlined /> 4. Termination
            </Title>
            <Paragraph>
              We reserve the right to suspend or terminate any user account that
              violates these terms without prior notice. We strive to keep
              ItsABlog safe for every voice.
            </Paragraph>

            <Title level={4}>
              <BookOutlined /> 5. Changes to the Terms
            </Title>
            <Paragraph>
              We may revise these Terms from time to time. Continued use of
              ItsABlog means you accept any updated terms.
            </Paragraph>

            <Divider />

            <Paragraph>
              If you have any questions or concerns, reach out to the creator
              via the <a href="/contact">Contact Page</a>.
            </Paragraph>

            <Paragraph type="secondary">
              Keep writing. Keep speaking. This is your voice, your medium. ✨
            </Paragraph>
          </Typography>
        </Content>
      </Layout>
    </>
  );
};

export default TermsAndConditions;
