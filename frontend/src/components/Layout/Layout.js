import React from "react";
import { Row, Col, Space } from "antd";
import "../../css/signup.css";

import {
  blueBook,
  blueBulb,
  blueRead,
  redBook,
  redBulb,
  redRead,
} from "../../static";

const images = [blueBook, blueBulb, blueRead, redBook, redBulb, redRead];

const Layout = (props) => {
  const image = images[Math.floor(Math.random() * images.length)];

  return (
    <div className="auth">
      <div className="auth-layout">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={12}>
            <div className="auth-left">
              <img src={image} className="auth-img" alt="Idea pen" />
            </div>
          </Col>

          <Col xs={24} sm={12} md={12}>
            <div className={`auth-right ${props.className}`}>
              {props.children}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Layout;
