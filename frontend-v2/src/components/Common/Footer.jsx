import React from "react";
import { Button, Input, Typography, Row, Col, Space } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  PinterestOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { key: "about", label: "About Groups", link: "/about-groups" },
    { key: "help", label: "Help & Support", link: "/help" },
    { key: "guidelines", label: "Community Guidelines", link: "/guidelines" },
    { key: "terms", label: "Terms of Service", link: "/terms" },
    { key: "privacy", label: "Privacy Policy", link: "/privacy" },
    { key: "contact", label: "Contact", link: "/contact" },
  ];

  const socialLinks = [
    {
      key: "facebook",
      icon: <FacebookOutlined className="text-xl" />,
      href: "https://facebook.com",
    },
    {
      key: "twitter",
      icon: <TwitterOutlined className="text-xl" />,
      href: "https://twitter.com",
    },
    {
      key: "pinterest",
      icon: <PinterestOutlined className="text-xl" />,
      href: "https://pinterest.com",
    },
  ];

  const handleNewsletter = (value) => {
    if (value.trim()) {
      console.log("Subscribed:", value);
      // Add your API call here
    }
  };

  return (
    <footer className="bg-slate-50 dark:bg-navy-800 border-t border-slate-200 dark:border-navy-700">
      <div className="container mx-auto px-6 py-12">
        <Row gutter={[32, 32]}>
          {/* Brand & Description */}
          <Col xs={24} md={6}>
            <div className="mb-6">
              <Title
                level={3}
                className="text-slate-800 dark:text-navy-50 font-bold mb-3"
              >
                ItsABlog
              </Title>
              <Paragraph className="text-slate-600 dark:text-navy-300 text-sm leading-relaxed">
                A community-driven platform for bloggers, creators, and thinkers
                to share ideas, connect in groups, and grow together.
              </Paragraph>
            </div>

            {/* Social Links */}
            <Space size={12}>
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-slate-200 dark:bg-navy-700 text-slate-600 dark:text-navy-200 hover:bg-primary hover:text-white dark:hover:bg-accent transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} md={6}>
            <Title
              level={4}
              className="text-slate-800 dark:text-navy-50 font-semibold mb-4"
            >
              Quick Links
            </Title>
            <ul className="space-y-2">
              {quickLinks.slice(0, 3).map((link) => (
                <li key={link.key}>
                  <a
                    href={link.link}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.link);
                    }}
                    className="text-slate-600 dark:text-navy-300 hover:text-primary dark:hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* More Links */}
          <Col xs={24} sm={12} md={6}>
            <Title
              level={4}
              className="text-slate-800 dark:text-navy-50 font-semibold mb-4"
            >
              Legal
            </Title>
            <ul className="space-y-2">
              {quickLinks.slice(3).map((link) => (
                <li key={link.key}>
                  <a
                    href={link.link}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.link);
                    }}
                    className="text-slate-600 dark:text-navy-300 hover:text-primary dark:hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Newsletter */}
          <Col xs={24} md={6}>
            <Title
              level={4}
              className="text-slate-800 dark:text-navy-50 font-semibold mb-4"
            >
              Stay Updated
            </Title>
            <Paragraph className="text-slate-600 dark:text-navy-300 text-sm mb-4">
              Subscribe to get the latest blogs, updates, and community
              highlights.
            </Paragraph>
            <Search
              placeholder="Enter your email"
              allowClear
              enterButton={
                <Button type="primary" icon={<MailOutlined />}>
                  Subscribe
                </Button>
              }
              size="large"
              onSearch={handleNewsletter}
              className="w-full"
              style={{ borderRadius: "8px" }}
            />
          </Col>
        </Row>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-navy-700">
          <Row justify="space-between" align="middle">
            <Col xs={24} md={12}>
              <Text className="text-slate-500 dark:text-navy-400 text-sm">
                © {currentYear} ItsABlog. All rights reserved.
              </Text>
            </Col>
            <Col xs={24} md={12} className="text-right">
              <Text className="text-slate-500 dark:text-navy-400 text-sm">
                Made with <span className="text-red-500">❤️</span> by{" "}
                <a
                  href="https://dhruvermafz.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary dark:text-accent hover:underline font-medium"
                >
                  Dhruv Verma
                </a>
              </Text>
            </Col>
          </Row>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
