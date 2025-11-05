import React from "react";
import { Typography, Space } from "antd";
import HorizontalStack from "../util/HorizontalStack";
import Moment from "react-moment";
import UserAvatar from "../UserModal/UserAvatar";
import { Link } from "react-router-dom";

const { Text } = Typography;

const ContentDetails = ({ username, createdAt, edited, preview }) => {
  return (
    <HorizontalStack style={{ alignItems: "center" }}>
      <UserAvatar width={30} height={30} username={username} />
      <Space direction="vertical" size={0} style={{ marginLeft: 8 }}>
        <Text style={{ fontWeight: 500, fontSize: 14 }}>
          <Link to={`/${username}`} style={{ color: "inherit" }}>
            {username}
          </Link>
        </Text>
        {!preview && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            <Moment fromNow>{createdAt}</Moment>
            {edited && " · Edited"}
          </Text>
        )}
      </Space>
    </HorizontalStack>
  );
};

export default ContentDetails;
