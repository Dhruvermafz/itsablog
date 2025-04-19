import React from "react";
import { List, Avatar, Typography } from "antd";
import moment from "moment";
import UserAvatar from "./UserAvatar";

const { Text } = Typography;

const UserMessengerEntry = (props) => {
  const recipient = props.conversation.recipient;
  const username = recipient.username;
  const selected = props.conservant && props.conservant.username === username;

  const handleClick = () => {
    props.setConservant(recipient);
  };

  return (
    <List.Item
      style={{
        padding: 16,
        backgroundColor: selected ? "#e6f7ff" : "white",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <List.Item.Meta
        avatar={<UserAvatar height={45} width={45} username={username} />}
        title={<Text strong>{username}</Text>}
        description={moment(props.conversation.lastMessageAt).fromNow()}
      />
    </List.Item>
  );
};

export default UserMessengerEntry;
