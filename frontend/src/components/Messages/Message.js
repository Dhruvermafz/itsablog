import React from "react";
import { Avatar, Card, Typography } from "antd";
import HorizontalStack from "../util/HorizontalStack";
import UserAvatar from "../UserModal/UserAvatar"; // Assuming this is a custom component, we will keep it

const { Text } = Typography;

const Message = (props) => {
  const username = props.conservant.username;
  const message = props.message;

  let styles = {};
  if (message.direction === "to") {
    styles = {
      justifyContent: "flex-start",
    };
  } else if (message.direction === "from") {
    styles = {
      messageColor: "#f0f0f0", // Ant Design's light gray background color
      justifyContent: "flex-end",
    };
  }

  return (
    <HorizontalStack
      style={{ paddingY: 8, width: "100%" }}
      spacing={2}
      justifyContent={styles.justifyContent}
      alignItems="flex-end"
    >
      {message.direction === "to" && (
        <UserAvatar username={username} height={30} width={30} />
      )}

      <Card
        style={{
          borderRadius: 25,
          backgroundColor: styles.messageColor,
          borderWidth: 1,
          paddingY: 12,
          maxWidth: "70%",
          paddingX: 16,
        }}
      >
        <Text>{message.content}</Text>
      </Card>
    </HorizontalStack>
  );
};

export default Message;
