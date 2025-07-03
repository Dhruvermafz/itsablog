import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Switch, Typography, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "./Group.module.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

const GroupCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Adjust based on your auth setup
      const response = await axios.post(
        "/api/groups", // Adjust URL to match your backend
        {
          name: values.name,
          description: values.description,
          rules: values.rules
            ? values.rules.split("\n").filter((rule) => rule.trim())
            : [],
          isPrivate: values.isPrivate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Community created successfully!");
      navigate(`/groups/${response.data._id}`); // Redirect to the new group's page
    } catch (error) {
      console.error("Create group error:", error);
      message.error(
        error.response?.data?.message || "Failed to create community"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.groupCreate}>
      <Title level={2} className={styles.title}>
        Create a New Community
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={styles.createForm}
        initialValues={{ isPrivate: false }}
      >
        <Form.Item
          name="name"
          label="Community Name"
          rules={[
            { required: true, message: "Please enter a community name" },
            { max: 50, message: "Name must be 50 characters or less" },
          ]}
        >
          <Input placeholder="e.g., Tech Innovators" size="large" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { max: 500, message: "Description must be 500 characters or less" },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Describe your community..."
            showCount
            maxLength={500}
          />
        </Form.Item>
        <Form.Item
          name="rules"
          label="Rules (one per line)"
          rules={[
            { max: 1000, message: "Rules must be 1000 characters or less" },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="e.g., Be respectful\nNo spam"
            showCount
            maxLength={1000}
          />
        </Form.Item>
        <Form.Item name="isPrivate" label="Privacy" valuePropName="checked">
          <Switch
            checkedChildren="Private"
            unCheckedChildren="Public"
            className={styles.privacySwitch}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={loading}
              size="large"
            >
              Create Community
            </Button>
            <Button onClick={() => navigate("/groups")} size="large">
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GroupCreate;
