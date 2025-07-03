import React from "react";
import { Card, Typography } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  PinterestOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const AuthorWidget = () => {
  return (
    <Card className="author-widget">
      <img className="author-img" src="/images/author.jpg" alt="Author" />
      <Title level={5}>Hello, I'm Steven</Title>
      <Paragraph>
        Hi, I’m Steven, a Florida native, who left my career in corporate wealth
        management six years ago to embark on a summer of soul searching that
        would change the course of my life forever.
      </Paragraph>
      <strong>Follow me:</strong>
      <ul className="social-network">
        <li>
          <a href="#" target="_blank" title="Facebook">
            <FacebookOutlined />
          </a>
        </li>
        <li>
          <a href="#" target="_blank" title="Twitter">
            <TwitterOutlined />
          </a>
        </li>
        <li>
          <a href="#" target="_blank" title="Pinterest">
            <PinterestOutlined />
          </a>
        </li>
      </ul>
    </Card>
  );
};

export default AuthorWidget;
