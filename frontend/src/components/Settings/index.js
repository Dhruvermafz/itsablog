import React from "react";
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Typography,
  Modal,
  message,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  DeleteOutlined,
  LockOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { confirm } = Modal;

const Settings = () => {
  const [form] = Form.useForm();

  const handleProfileUpdate = (values) => {
    console.log("Profile Updated:", values);
    message.success("Profile updated successfully!");
  };

  const handleAccountUpdate = (values) => {
    console.log("Account Settings Updated:", values);
    message.success("Account settings updated!");
  };

  const handleDeactivateAccount = () => {
    message.info("Account has been deactivated.");
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to delete your account?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        message.success("Your account has been permanently deleted.");
        // Trigger backend deletion here
      },
    });
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Account Settings
      </Title>

      <Card>
        <Tabs defaultActiveKey="1" tabPosition="top" type="line">
          {/* Profile Settings */}
          <Tabs.TabPane
            tab={
              <span>
                <UserOutlined />
                Profile
              </span>
            }
            key="1"
          >
            <Form form={form} layout="vertical" onFinish={handleProfileUpdate}>
              <Form.Item label="Full Name" name="name">
                <Input placeholder="Enter your name" />
              </Form.Item>
              <Form.Item label="Bio" name="bio">
                <Input.TextArea
                  placeholder="Tell something about yourself"
                  rows={4}
                />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input type="email" placeholder="Enter your email" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>

          {/* Account Settings */}
          <Tabs.TabPane
            tab={
              <span>
                <SettingOutlined />
                Account
              </span>
            }
            key="2"
          >
            <Form layout="vertical" onFinish={handleAccountUpdate}>
              <Form.Item label="Change Password" name="password">
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter new password"
                />
              </Form.Item>
              <Form.Item
                label="Receive Email Notifications"
                name="emailNotifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>

          {/* Deactivate Account */}
          <Tabs.TabPane
            tab={
              <span>
                <LockOutlined />
                Deactivate
              </span>
            }
            key="3"
          >
            <Typography.Paragraph>
              Temporarily disable your account. You can reactivate it anytime by
              logging back in.
            </Typography.Paragraph>
            <Button type="default" danger onClick={handleDeactivateAccount}>
              Deactivate Account
            </Button>
          </Tabs.TabPane>

          {/* Delete Account */}
          <Tabs.TabPane
            tab={
              <span>
                <DeleteOutlined />
                Delete
              </span>
            }
            key="4"
          >
            <Typography.Paragraph type="danger">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </Typography.Paragraph>
            <Button type="primary" danger onClick={showDeleteConfirm}>
              Delete Account
            </Button>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings;
