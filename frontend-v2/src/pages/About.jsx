import React from "react";
import { Typography, Card, Divider, Row, Col, Button } from "antd";
import {
  BookOutlined,
  VideoCameraOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Link } = Typography;

const AboutPage = () => {
  return (
    <div className="about-container">
      <Card className="about-card">
        <Row gutter={[16, 24]} justify="center">
          <Col xs={24} md={16}>
            <Title level={2} className="about-title">
              Welcome to ItsABlog
            </Title>
            <Paragraph className="about-subtitle">
              The Parent Company of Cinenotes.com
            </Paragraph>
            <Paragraph type="secondary" className="about-description">
              ItsABlog is a vibrant multiuser blogging platform where voices
              find their echo. Whether you're a writer, thinker, or dreamer,
              share your stories, ideas, and passions with a global community.
              As the proud parent of <strong>Cinenotes.com</strong>, we foster a
              private, conscious space for cinema, books, literature, and
              everything in between — celebrating creativity with purpose.
            </Paragraph>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 24]}>
          <Col xs={24} sm={12}>
            <Title level={3} className="section-title">
              <BookOutlined /> Our Mission
            </Title>
            <Paragraph>
              At ItsABlog, we believe in the power of storytelling. Our mission
              is to provide a platform where authentic voices can connect,
              inspire, and engage. Through our subsidiary,{" "}
              <Link
                href="https://cinenotes.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cinenotes.com
              </Link>
              , we extend this vision to cinema and literature enthusiasts,
              offering a curated, private community to discuss films, books, and
              more with mindfulness and respect.
            </Paragraph>
          </Col>
          <Col xs={24} sm={12}>
            <Title level={3} className="section-title">
              <VideoCameraOutlined /> About Cinenotes
            </Title>
            <Paragraph>
              Cinenotes.com is our dedicated platform for cinema and literature
              lovers. It’s a space to explore films, share reviews, create
              curated lists, and engage in meaningful discussions. With features
              like private groups, editorial newsrooms, and box office insights,
              Cinenotes ensures a thoughtful, ad-free experience for conscious
              creators and consumers.
            </Paragraph>
          </Col>
        </Row>

        <Divider />

        <Title level={3} className="section-title">
          <TeamOutlined /> Why Choose Us?
        </Title>
        <Row gutter={[16, 16]} className="features-grid">
          <Col xs={24} sm={12} md={8}>
            <Card hoverable className="feature-card">
              <Title level={4}>Blogging Freedom</Title>
              <Paragraph>
                Create, edit, and share blog posts with Markdown support for
                rich, beautiful content.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable className="feature-card">
              <Title level={4}>Cinema & Literature Hub</Title>
              <Paragraph>
                Explore films, write reviews, and curate lists on Cinenotes.com
                with a focus on privacy.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable className="feature-card">
              <Title level={4}>Community Engagement</Title>
              <Paragraph>
                Join groups, comment, and connect with like-minded creators in a
                respectful space.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Title level={3} className="section-title">
          🚀 Get Started
        </Title>
        <Paragraph>
          Ready to share your voice? Visit{" "}
          <Link
            href="https://itsablog.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ItsABlog
          </Link>{" "}
          or{" "}
          <Link
            href="https://cinenotes.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cinenotes
          </Link>{" "}
          to sign up and start your creative journey.
        </Paragraph>
        <Button
          type="primary"
          size="large"
          href="https://itsablog.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button"
        >
          Join Now
        </Button>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Title level={3} className="section-title">
              🤝 Contribute
            </Title>
            <Paragraph>
              Want to help shape our platforms? Check out our{" "}
              <Link
                href="CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                contribution guidelines
              </Link>{" "}
              and join our community of creators.
            </Paragraph>
          </Col>
          <Col xs={24} sm={12}>
            <Title level={3} className="section-title">
              📬 Contact Us
            </Title>
            <Paragraph>
              Have feedback or need support? Reach out at{" "}
              <Link href="mailto:support@itsablog.com">
                support@itsablog.com
              </Link>{" "}
              or{" "}
              <Link href="mailto:support@cinenotes.com">
                support@cinenotes.com
              </Link>
              .
            </Paragraph>
          </Col>
        </Row>

        <Divider />

        <Paragraph className="footer-text">
          ✍️ Happy Blogging & Creating! <br />
          The ItsABlog & Cinenotes Team
        </Paragraph>
      </Card>
    </div>
  );
};

export default AboutPage;
