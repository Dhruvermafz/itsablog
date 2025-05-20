import React from "react";
import { Typography, Card, Divider } from "antd";

const { Title, Paragraph, Link } = Typography;

const AboutPage = () => {
  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <Card
        bordered={false}
        style={{ marginTop: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <Typography>
          <Title level={2}>ItsABlog - Multiuser Blogging Application</Title>
          <Paragraph type="secondary">
            ItsABlog is a multiuser blogging platform for people with a lot to
            say but no one to listen. Share your thoughts, stories, and opinions
            with the world — whether you're a seasoned writer or someone just
            looking to express themselves.
          </Paragraph>

          <Divider />

          <Title level={3}>🚀 Application Deployment</Title>
          <Paragraph>
            <Link
              href="https://itsablog.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              👉 Visit the live app here
            </Link>
          </Paragraph>

          <Divider />

          <Title level={3}>🧩 Features</Title>
          <Paragraph>
            <strong>1. CRUD Posts:</strong> Create, edit, and delete blog posts
            with ease.
          </Paragraph>
          <Paragraph>
            <strong>2. Like/Unlike Posts:</strong> Show appreciation or take it
            back — it’s your call.
          </Paragraph>
          <Paragraph>
            <strong>3. Nested Comments:</strong> Reply to comments, engage in
            discussions, and manage your conversations.
          </Paragraph>
          <Paragraph>
            <strong>4. Markdown Support:</strong> Format your content
            beautifully using Markdown.
          </Paragraph>
          {/* Add more feature blocks similarly if needed */}

          <Divider />

          <Title level={3}>🔰 Getting Started</Title>
          <Paragraph>
            Visit our{" "}
            <Link
              href="https://itsablog.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              deployed website
            </Link>{" "}
            and sign up or log in to begin your blogging journey.
          </Paragraph>

          <Divider />

          <Title level={3}>🤝 Contributing</Title>
          <Paragraph>
            Contributions are welcome! Please read our{" "}
            <Link
              href="CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              contribution guidelines
            </Link>{" "}
            to get started.
          </Paragraph>

          <Divider />

          <Title level={3}>📬 Feedback & Support</Title>
          <Paragraph>
            Reach out to us at{" "}
            <Link href="mailto:support@itsablog.com">support@itsablog.com</Link>{" "}
            for feedback, questions, or assistance.
          </Paragraph>

          <Divider />

          <Title level={3}>✍️ Happy Blogging!</Title>
          <Paragraph>The ItsABlog Team</Paragraph>
        </Typography>
      </Card>
    </div>
  );
};

export default AboutPage;
