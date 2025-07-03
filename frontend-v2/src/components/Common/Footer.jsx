import React from "react";
import { Button, Input, Checkbox, Typography, Row, Col } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  PinterestOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { key: "about", label: "About me", link: "/about" },
    { key: "help", label: "Help & Support", link: "/help" },
    { key: "licensing", label: "Licensing Policy", link: "/licensing" },
    { key: "refund", label: "Refund Policy", link: "/refund" },
    { key: "hire", label: "Hire me", link: "/hire" },
    { key: "contact", label: "Contact", link: "/contact" },
  ];

  const socialLinks = [
    { key: "facebook", icon: <FacebookOutlined />, href: "#" },
    { key: "twitter", icon: <TwitterOutlined />, href: "#" },
    { key: "pinterest", icon: <PinterestOutlined />, href: "#" },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Add newsletter subscription logic here (e.g., API call)
    console.log("Newsletter subscription submitted");
  };

  return (
    <footer className="footer bg-grey pt-50 pb-20">
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} lg={6}>
            <div className="sidebar-widget">
              <Title level={5} className="mb-20">
                About ItsABlog
              </Title>
              <Paragraph className="text-muted">
                Start writing, no matter what. The water does not flow until the
                faucet is turned on.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <div className="sidebar-widget">
              <Title level={5} className="mb-20">
                Quick Links
              </Title>
              <ul
                className="quick-links"
                style={{ listStyle: "none", padding: 0 }}
              >
                {quickLinks.map((item) => (
                  <li key={item.key} style={{ marginBottom: 8 }}>
                    <a
                      href={item.link}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.link);
                      }}
                      style={{ color: "#666", textDecoration: "none" }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <div className="sidebar-widget">
              <Title level={5} className="mb-20">
                Contact Us
              </Title>
              <Paragraph className="text-muted">
                <a href="mailto:write@dhruvermafz.in" style={{ color: "#666" }}>
                  write@dhruvermafz.in
                </a>
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <div className="sidebar-widget">
              <Title level={5} className="mb-20">
                Stay Connected
              </Title>

              <ul className="header-social-network list-inline mt-20">
                {socialLinks.map((social) => (
                  <li key={social.key} className="list-inline-item">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                      style={{ fontSize: 20, marginRight: 12, color: "#666" }}
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
        <div className="footer-copy-right pt-30 mt-20">
          <Row justify="space-between" align="middle">
            <Col xs={24} md={12}>
              <Paragraph className="text-muted">
                © {currentYear}, ItsABlog
              </Paragraph>
            </Col>
            <Col xs={24} md={12}>
              <Paragraph className="text-muted">
                Designed and Developed by{" "}
                <a
                  href="https://dhruvermafz.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#666" }}
                >
                  Dhruvermafz
                </a>{" "}
                | All rights reserved
              </Paragraph>
            </Col>
          </Row>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
