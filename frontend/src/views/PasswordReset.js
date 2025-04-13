import React, { useState } from "react";
import { Form, Input, Button, Typography, notification } from "antd";
import { MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const openNotification = (type, msg) => {
    notification[type]({
      message: msg,
      placement: "top",
    });
  };

  const sendLink = async () => {
    if (email.trim() === "") {
      openNotification("error", "Email is required!");
      return;
    }

    if (!email.includes("@")) {
      openNotification("warning", "Email must include '@'");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/sendpasswordlink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.status === 201) {
        setEmail("");
        setMessage(true);
      } else {
        openNotification("error", "Invalid User");
      }
    } catch (error) {
      openNotification("error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 24,
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <Title level={3}>Reset Your Password</Title>
      {message && (
        <Text type="success" strong>
          Password reset link sent successfully to your email.
        </Text>
      )}
      <Form layout="vertical" onFinish={sendLink} style={{ marginTop: 24 }}>
        <Form.Item label="Email" name="email">
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Send Reset Link
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PasswordReset;
