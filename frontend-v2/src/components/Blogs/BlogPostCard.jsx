import React from "react";
import { Card, Tag, Typography, Space } from "antd";
import {
  ShareAltOutlined,
  FacebookOutlined,
  TwitterOutlined,
  PinterestOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const BlogPostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleShare = (platform) => {
    // Add share logic for the platform
    console.log(`Sharing on ${platform}`);
  };

  return (
    <Card
      className="blog-post-card"
      cover={
        <div className="post-thumb">
          <div
            className="img-hover-slide"
            style={{ backgroundImage: `url(${post.image})` }}
          >
            <a
              href={post.link}
              onClick={(e) => {
                e.preventDefault();
                navigate(post.link);
              }}
            ></a>
          </div>
          <ul className="social-share">
            <li>
              <a href="#" onClick={() => handleShare("general")}>
                <ShareAltOutlined />
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => handleShare("facebook")}
                title="Share on Facebook"
              >
                <FacebookOutlined />
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => handleShare("twitter")}
                title="Tweet now"
              >
                <TwitterOutlined />
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => handleShare("pinterest")}
                title="Pin it"
              >
                <PinterestOutlined />
              </a>
            </li>
          </ul>
        </div>
      }
    >
      <div className="post-content">
        <Tag color={post.categoryColor}>{post.category}</Tag>
        <Title level={5} className="post-title">
          <a
            href={post.link}
            onClick={(e) => {
              e.preventDefault();
              navigate(post.link);
            }}
          >
            {post.title}
          </a>
          {post.isFeatured && <ShareAltOutlined className="post-format-icon" />}
        </Title>
        <Space className="entry-meta">
          <Text>{post.date}</Text>
          <Text>{post.readTime}</Text>
          <Text>{post.views}</Text>
        </Space>
      </div>
    </Card>
  );
};

export default BlogPostCard;
