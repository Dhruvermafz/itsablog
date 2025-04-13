import React from "react";
import { Avatar, Typography, Space } from "antd";
import HorizontalStack from "../util/HorizontalStack";
import Moment from "react-moment";
import UserAvatar from "../UserModal/UserAvatar";
import { Link } from "react-router-dom";

const ContentDetails = ({ username, createdAt, edited, preview }) => {
  return (
    <HorizontalStack>
      <UserAvatar width={30} height={30} username={username} />
      <Space direction="vertical" style={{ marginLeft: 8 }}>
        <Typography.Text style={{ fontWeight: 500 }}>
          <Link to={"/" + username} style={{ color: "inherit" }}>
            {username}
          </Link>
          {!preview && (
            <>
              {" "}
              · <Moment fromNow>{createdAt}</Moment> {edited && <>(Edited)</>}
            </>
          )}
        </Typography.Text>
      </Space>
    </HorizontalStack>
  );
};

export default ContentDetails;
