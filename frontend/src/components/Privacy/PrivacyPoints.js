import React from "react";
import { Typography, Layout, Divider } from "antd";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const PrivacyPolicy = () => {
  return (
    <Layout className="theme-layout boxed">
      <Content className="tab-content central-meta">
        <Typography>
          <Title level={1}>Privacy Policy</Title>

          <Paragraph>
            Welcome to <Text strong>ItsABlog</Text>, a multi-user blogging
            platform dedicated to free expression, creativity, and secure
            communication. This privacy policy outlines how we handle your data
            and your rights as a user of the platform.
          </Paragraph>

          <Divider />

          <Title level={2}>1. Information We Collect</Title>
          <Paragraph>
            When you use ItsABlog, we may collect the following information:
          </Paragraph>
          <ul>
            <li>Your name and email address upon registration</li>
            <li>
              Content you create or interact with (posts, likes, comments)
            </li>
            <li>
              Technical data such as your IP address, browser type, and device
            </li>
            <li>
              Usage behavior and interaction logs (for improving the platform)
            </li>
          </ul>

          <Title level={2}>2. How We Use Your Data</Title>
          <Paragraph>We use your data to:</Paragraph>
          <ul>
            <li>Provide and improve the blogging experience</li>
            <li>Personalize content and suggestions</li>
            <li>Ensure platform security and integrity</li>
            <li>Respond to user support and feedback</li>
          </ul>

          <Title level={2}>3. Content Ownership</Title>
          <Paragraph>
            You retain full ownership of the content you publish. ItsABlog does
            not claim rights over your text, images, or media. However, by
            publishing, you grant us the right to display your content on the
            platform.
          </Paragraph>

          <Title level={2}>4. Cookies and Tracking</Title>
          <Paragraph>
            We use cookies to enhance your experience. These help remember your
            session, track analytics, and improve platform performance. You can
            manage cookie settings in your browser.
          </Paragraph>

          <Title level={2}>5. Third-Party Services</Title>
          <Paragraph>
            We may use trusted third-party services (like analytics or image
            hosting) which may access some user data. These services are
            required to uphold similar data protection standards.
          </Paragraph>

          <Title level={2}>6. Data Security</Title>
          <Paragraph>
            We employ industry-standard security measures including encrypted
            storage, access control, and regular audits. However, no system is
            fully immune from breaches.
          </Paragraph>

          <Title level={2}>7. Your Rights</Title>
          <Paragraph>You have the right to:</Paragraph>
          <ul>
            <li>Access the data we hold about you</li>
            <li>Request corrections or deletions</li>
            <li>Opt-out of communications or analytics tracking</li>
          </ul>

          <Title level={2}>8. Changes to This Policy</Title>
          <Paragraph>
            We may update this policy from time to time. When we do, we'll
            notify you via email or platform banner. Continued use of ItsABlog
            after updates implies consent.
          </Paragraph>

          <Title level={2}>9. Contact Us</Title>
          <Paragraph>
            For questions or concerns regarding this policy, contact us at:{" "}
            <Text code>privacy@itsablog.com</Text>
          </Paragraph>
        </Typography>
      </Content>
    </Layout>
  );
};

export default PrivacyPolicy;
