import React from "react";
import { AiFillMessage } from "react-icons/ai";
import { BiSad } from "react-icons/bi";
import { Typography, Divider, List, Space, Spin } from "antd";
import UserMessengerEntry from "./UserMessengerEntry";
import HorizontalStack from "../util/HorizontalStack";

const { Text, Title } = Typography;

const UserMessengerEntries = ({
  conversations,
  loading,
  conservant,
  setConservant,
}) => {
  if (loading) {
    return (
      <Space
        align="center"
        justify="center"
        style={{ height: "100%", width: "100%" }}
      >
        <Spin size="large" />
      </Space>
    );
  }

  if (conversations.length === 0) {
    return (
      <Space
        direction="vertical"
        align="center"
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          textAlign: "center",
        }}
        size={16}
      >
        <BiSad size={60} />
        <Title level={4}>No Conversations</Title>
        <Text type="secondary" style={{ maxWidth: "70%" }}>
          Click 'Message' on another user's profile to start a conversation.
        </Text>
      </Space>
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <HorizontalStack
        style={{
          padding: "0 16px",
          height: 60,
          display: "flex",
          alignItems: "center",
        }}
      >
        <AiFillMessage size={26} />
        <Text strong style={{ marginLeft: 8 }}>
          Your Conversations
        </Text>
      </HorizontalStack>

      <Divider style={{ margin: 0 }} />

      <div style={{ height: "calc(100vh - 171px)", overflow: "hidden" }}>
        <div style={{ height: "100%", overflowY: "auto" }}>
          <List
            itemLayout="horizontal"
            dataSource={conversations}
            renderItem={(conversation) => (
              <UserMessengerEntry
                conservant={conservant}
                conversation={conversation}
                key={conversation.recipient.username}
                setConservant={setConservant}
              />
            )}
          />
        </div>
      </div>
    </Space>
  );
};

export default UserMessengerEntries;
