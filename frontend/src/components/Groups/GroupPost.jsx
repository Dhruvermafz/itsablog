import React, { useState } from "react";
import { Input, Button, message, Tooltip } from "antd";
import { SendOutlined } from "@ant-design/icons";

const GroupPost = () => {
  const [postContent, setPostContent] = useState("");

  const handlePostSubmit = () => {
    if (postContent.length > 50) {
      message.error("Post cannot exceed 50 characters");
    } else {
      // Post submission logic
      message.success("Post submitted successfully!");
      setPostContent("");
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <Input.TextArea
        rows={4}
        placeholder="What's on your mind?"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        maxLength={50}
        showCount
        style={{ marginBottom: "10px" }}
      />
      <Tooltip title="Post your thoughts">
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handlePostSubmit}
          disabled={!postContent}
        >
          Post
        </Button>
      </Tooltip>
    </div>
  );
};

export default GroupPost;
