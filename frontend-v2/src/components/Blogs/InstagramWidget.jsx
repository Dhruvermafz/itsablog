import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

const InstagramWidget = ({ images }) => {
  return (
    <Card className="instagram-widget">
      <Title level={5}>Instagram</Title>
      <ul className="insta-feed">
        {images.map((img, index) => (
          <li key={index}>
            <a href={img.link} className="play-video">
              <img className="insta-img" src={img.src} alt="" />
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default InstagramWidget;
