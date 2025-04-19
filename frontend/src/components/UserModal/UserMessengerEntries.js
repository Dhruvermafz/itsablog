import React from "react";
import { AiFillMessage } from "react-icons/ai";
import { BiSad } from "react-icons/bi";
import { Typography, Divider, List, Space, Spin } from "antd";
import UserMessengerEntry from "./UserMessengerEntry";
import HorizontalStack from "../util/HorizontalStack";

const { Text, Title } = Typography;

const UserMessengerEntries = (props) => {
  return !props.loading ? (
    <>
      {props.conversations.length > 0 ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <HorizontalStack
            alignItems="center"
            spacing={2}
            style={{ padding: "0 16px", height: "60px" }}
          >
            <AiFillMessage size={30} />
            <Text strong>Your Conversations</Text>
          </HorizontalStack>
          <Divider style={{ margin: 0 }} />
          <div style={{ height: "calc(100vh - 171px)" }}>
            <div style={{ height: "100%" }}>
              <div
                style={{
                  padding: 0,
                  maxHeight: "100%",
                  overflowY: "auto",
                }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={props.conversations}
                  renderItem={(conversation) => (
                    <UserMessengerEntry
                      conservant={props.conservant}
                      conversation={conversation}
                      key={conversation.recipient.username}
                      setConservant={props.setConservant}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </Space>
      ) : (
        <Space
          direction="vertical"
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
          size={16}
        >
          <BiSad size={60} />
          <Title level={4}>No Conversations</Title>
          <Text type="secondary" style={{ maxWidth: "70%" }}>
            Click 'Message' on another user's profile to start a conversation
          </Text>
        </Space>
      )}
    </>
  ) : (
    <Space style={{ height: "100%", width: "100%", justifyContent: "center" }}>
      <Spin size="large" />
    </Space>
  );
};

export default UserMessengerEntries;
