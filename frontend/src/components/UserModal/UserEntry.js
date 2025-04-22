import React from "react";
import { Row, Col, Typography, Space } from "antd";
import UserAvatar from "./UserAvatar";
import { Link } from "react-router-dom";

const { Text } = Typography;

const UserEntry = ({ username }) => {
  return (
    <Link
      to={`/${username}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Row align="middle" gutter={8} wrap={false}>
        <Col>
          <UserAvatar size={32} username={username} />
        </Col>
        <Col>
          <Text strong>{username}</Text>
        </Col>
      </Row>
    </Link>
  );
};

export default UserEntry;
