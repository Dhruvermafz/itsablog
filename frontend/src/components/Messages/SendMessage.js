import React, { useState } from "react";
import { Button, Input, Row, Col, Space } from "antd";
import { sendMessage } from "../../api/messages";
import { isLoggedIn } from "../../helpers/authHelper";
import HorizontalStack from "../util/HorizontalStack"; // Assuming you have custom stack component (HorizontalStack)

const SendMessage = (props) => {
  const [content, setContent] = useState("");

  const handleSendMessage = () => {
    props.onSendMessage(content);
    setContent("");
  };

  return (
    <Row
      style={{
        margin: "16px",
        height: "40px",
      }}
      justify="center"
    >
      <Col span={20}>
        <Space style={{ width: "100%" }}>
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Send a message..."
            size="small"
            onPressEnter={() => {
              if (content.length > 0) {
                handleSendMessage();
              }
            }}
          />
          <Button
            type="primary"
            onClick={handleSendMessage}
            disabled={content.length === 0}
          >
            Send
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default SendMessage;
