import React, { useState } from "react";
import { Layout, Typography, Divider, Tabs, Button } from "antd";
import {
  BookOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LockOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;

const Privacy = () => {
  // State for accordion items in the Help section
  const [expandedItems, setExpandedItems] = useState({
    "getting-started-1": false,
    "getting-started-2": false,
    "getting-started-3": false,
    "getting-started-4": false,
    "mobile-app-1": false,
    "mobile-app-2": false,
    "mobile-app-3": false,
    "mobile-app-4": false,
    "payments-1": false,
    "payments-2": false,
    "payments-3": false,
    "payments-4": false,
  });

  // Function to toggle accordion items
  const toggleAccordion = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const PrivacyPolicyContent = () => (
    <Typography className="terms-content">
      <Title level={2} className="section-title">
        <LockOutlined /> Privacy Policy
      </Title>
      <Paragraph className="intro-text">
        Welcome to <Text strong>ItsABlog</Text> and{" "}
        <Text strong>Cinenotes.com</Text>, platforms dedicated to free
        expression, creativity, and secure communication. This privacy policy
        outlines how we handle your data and your rights as a user of our
        platforms.
      </Paragraph>

      <Divider />

      <Title level={3} className="section-title">
        1. Information We Collect
      </Title>
      <Paragraph>
        When you use ItsABlog or Cinenotes.com, we may collect:
        <ul>
          <li>
            Your name, email address, and optional profile information upon
            registration.
          </li>
          <li>
            Content you create or interact with (e.g., blog posts, film reviews,
            comments, lists).
          </li>
          <li>
            Technical data such as IP address, browser type, and device
            information.
          </li>
          <li>
            Usage behavior and interaction logs to improve platform
            functionality.
          </li>
        </ul>
      </Paragraph>

      <Title level={3} className="section-title">
        2. How We Use Your Data
      </Title>
      <Paragraph>
        We use your data to:
        <ul>
          <li>Provide and enhance the blogging and cinema experience.</li>
          <li>Personalize content, recommendations, and group interactions.</li>
          <li>Ensure platform security and prevent abuse.</li>
          <li>Respond to user support requests and feedback.</li>
        </ul>
      </Paragraph>

      <Title level={3} className="section-title">
        3. Content Ownership
      </Title>
      <Paragraph>
        You retain full ownership of your content (e.g., blog posts, reviews,
        lists). By publishing, you grant ItsABlog and Cinenotes.com a
        non-exclusive, worldwide, royalty-free license to display and distribute
        your content solely for platform-related purposes.
      </Paragraph>

      <Title level={3} className="section-title">
        4. Cookies and Tracking
      </Title>
      <Paragraph>
        We use cookies to enhance your experience, including session management,
        analytics, and performance optimization. You can manage cookie
        preferences in your browser settings.
      </Paragraph>

      <Title level={3} className="section-title">
        5. Third-Party Services
      </Title>
      <Paragraph>
        We may use trusted third-party services (e.g., analytics, image hosting)
        that may access limited user data. These services comply with data
        protection standards equivalent to ours.
      </Paragraph>

      <Title level={3} className="section-title">
        6. Data Security
      </Title>
      <Paragraph>
        We implement industry-standard security measures, including encryption,
        access controls, and regular audits. However, no system is entirely
        immune to breaches, and users assume some risk.
      </Paragraph>

      <Title level={3} className="section-title">
        7. Your Rights
      </Title>
      <Paragraph>
        You have the right to:
        <ul>
          <li>Access the data we hold about you.</li>
          <li>Request corrections or deletion of your data.</li>
          <li>Opt out of communications or analytics tracking.</li>
        </ul>
        To exercise these rights, contact us at{" "}
        <Text code>privacy@itsablog.com</Text> or{" "}
        <Text code>privacy@cinenotes.com</Text>.
      </Paragraph>

      <Title level={3} className="section-title">
        8. Changes to This Policy
      </Title>
      <Paragraph>
        We may update this policy periodically. Changes will be communicated via
        email or a platform banner. Continued use of the Platforms after updates
        implies consent.
      </Paragraph>

      <Title level={3} className="section-title">
        9. Contact Us
      </Title>
      <Paragraph>
        For questions or concerns, contact us at{" "}
        <a href="mailto:privacy@itsablog.com">privacy@itsablog.com</a> or{" "}
        <a href="mailto:privacy@cinenotes.com">privacy@cinenotes.com</a>.
      </Paragraph>
    </Typography>
  );

  const TermsContent = () => (
    <Typography className="terms-content">
      <Paragraph className="intro-text">
        Welcome to <Text strong>ItsABlog</Text>, the parent company of{" "}
        <Text strong>Cinenotes.com</Text>. Our platforms provide a vibrant space
        for blogging, cinema, literature, and community engagement, designed
        with privacy and conscious creativity in mind. By accessing or using
        ItsABlog or Cinenotes.com, you agree to be bound by these terms, which
        govern both platforms.
      </Paragraph>

      <Title level={3} className="section-title">
        <UserOutlined /> 1. Acceptance of Terms
      </Title>
      <Paragraph>
        By using ItsABlog or Cinenotes.com (collectively, “the Platforms”), you
        agree to comply with these Terms and Conditions, our{" "}
        <a href="/privacy">Privacy Policy</a>, and any additional guidelines or
        rules posted on the Platforms. If you do not agree, please refrain from
        using our services.
      </Paragraph>

      <Title level={3} className="section-title">
        <UserOutlined /> 2. User Responsibilities
      </Title>
      <Paragraph>
        Users of ItsABlog and Cinenotes.com are expected to:
        <ul>
          <li>
            Maintain respectful and inclusive behavior in all interactions.
          </li>
          <li>
            Avoid posting harmful, offensive, or illegal content, including
            plagiarism, hate speech, or copyrighted material without permission.
          </li>
          <li>
            Take full responsibility for the content they post, including blogs,
            reviews, comments, and lists.
          </li>
        </ul>
        Violations may result in content removal, account suspension, or legal
        action as appropriate.
      </Paragraph>

      <Title level={3} className="section-title">
        <ExclamationCircleOutlined /> 3. Content Ownership and Licensing
      </Title>
      <Paragraph>
        You retain ownership of all content you create on the Platforms (e.g.,
        blog posts, film reviews, comments, lists). By posting, you grant
        ItsABlog and Cinenotes.com a non-exclusive, worldwide, royalty-free
        license to use, display, and distribute your content solely for
        operating and promoting the Platforms. You may remove your content at
        any time, subject to our data retention policies.
      </Paragraph>

      <Title level={3} className="section-title">
        <BookOutlined /> 4. Privacy and Data Protection
      </Title>
      <Paragraph>
        We are committed to protecting your privacy. Cinenotes.com, in
        particular, emphasizes a private, ad-free experience. Please review our{" "}
        <a href="/privacy">Privacy Policy</a> for details on data collection,
        use, and protection.
      </Paragraph>

      <Title level={3} className="section-title">
        <VideoCameraOutlined /> 5. Cinenotes-Specific Features
      </Title>
      <Paragraph>
        Cinenotes.com offers unique features like film reviews, curated lists,
        private groups, and box office insights. Users must:
        <ul>
          <li>
            Respect the privacy of private group discussions and editorial
            newsrooms.
          </li>
          <li>
            Ensure reviews and comments adhere to community guidelines, avoiding
            spoilers without proper tagging.
          </li>
          <li>
            Not misuse box office data or other proprietary information provided
            on the Platform.
          </li>
        </ul>
      </Paragraph>

      <Title level={3} className="section-title">
        <BookOutlined /> 6. Open-Source Contribution
      </Title>
      <Paragraph>
        ItsABlog is an open-source platform, and Cinenotes.com may incorporate
        open-source components. Contributors must:
        <ul>
          <li>
            Ensure submitted code or content is original and does not violate
            third-party licenses.
          </li>
          <li>
            Follow our <a href="/contributing">Contribution Guidelines</a> for
            code, documentation, or other contributions.
          </li>
        </ul>
        All contributions are subject to review and approval by our team.
      </Paragraph>

      <Title level={3} className="section-title">
        <ExclamationCircleOutlined /> 7. Account Termination
      </Title>
      <Paragraph>
        We reserve the right to suspend or terminate accounts that violate these
        terms, engage in harmful behavior, or misuse Platform features.
        Termination may occur without prior notice, though we strive to provide
        warnings where feasible.
      </Paragraph>

      <Title level={3} className="section-title">
        <ExclamationCircleOutlined /> 8. Intellectual Property
      </Title>
      <Paragraph>
        All Platform content, including designs, logos, and proprietary data
        (e.g., Cinenotes’ box office insights), is protected by copyright,
        trademark, or other intellectual property laws. Unauthorized use is
        prohibited.
      </Paragraph>

      <Title level={3} className="section-title">
        <ExclamationCircleOutlined /> 9. Limitation of Liability
      </Title>
      <Paragraph>
        ItsABlog and Cinenotes.com are provided “as is.” We are not liable for
        any damages arising from your use of the Platforms, including but not
        limited to content inaccuracies, service interruptions, or data loss.
        Users assume all risks associated with their activities on the
        Platforms.
      </Paragraph>

      <Title level={3} className="section-title">
        <BookOutlined /> 10. Changes to the Terms
      </Title>
      <Paragraph>
        We may update these Terms periodically to reflect changes in our
        services or legal requirements. The updated Terms will be posted on this
        page with a revised “Last Updated” date. Continued use of the Platforms
        constitutes acceptance of the revised Terms.
      </Paragraph>

      <Paragraph>
        For questions, feedback, or support, contact us via our{" "}
        <a href="/contact">Contact Page</a> or email us at{" "}
        <a href="mailto:support@itsablog.com">support@itsablog.com</a> or{" "}
        <a href="mailto:support@cinenotes.com">support@cinenotes.com</a>.
      </Paragraph>
    </Typography>
  );

  return (
    <Layout className="terms-layout">
      <Content className="terms-container">
        <div className="terms-header">
          <BookOutlined className="header-icon" />
          <Title level={2} className="terms-title">
            Terms & Conditions
          </Title>
          <Text type="secondary" className="terms-subtitle">
            Last Updated: May 28, 2025
          </Text>
        </div>

        <Divider />

        <Tabs defaultActiveKey="terms" className="terms-tabs">
          <TabPane tab="Terms & Conditions" key="terms">
            <TermsContent />
            <Button
              type="primary"
              size="large"
              href="/contact"
              className="contact-button"
            >
              Contact Us
            </Button>
          </TabPane>
          <TabPane tab="Privacy Policy" key="privacy">
            <PrivacyPolicyContent />
            <Button
              type="primary"
              size="large"
              href="/contact"
              className="contact-button"
            >
              Contact Us
            </Button>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default Privacy;
