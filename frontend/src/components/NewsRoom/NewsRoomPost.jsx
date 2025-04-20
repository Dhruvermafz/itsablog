import React, { useState } from "react";
import { Input, Button, Form, Typography, Upload, message, Select } from "antd";
import { PaperClipOutlined, PictureOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

const NewsroomPost = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);

  const handlePostSubmit = (values) => {
    // Logic to submit the post
    message.success("Post submitted successfully!");
    form.resetFields();
  };

  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      setImageUrl(URL.createObjectURL(info.file.originFileObj));
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f2f5",
        borderRadius: "10px",
      }}
    >
      <Title level={2}>Write a Newsroom Post</Title>
      <Form form={form} onFinish={handlePostSubmit}>
        <Form.Item
          name="title"
          rules={[{ required: true, message: "Title is required!" }]}
        >
          <Input placeholder="Enter your title" size="large" />
        </Form.Item>
        <Form.Item
          name="content"
          rules={[{ required: true, message: "Content is required!" }]}
        >
          <TextArea rows={6} placeholder="Write your content..." />
        </Form.Item>
        <Form.Item
          name="image"
          label="Add Image"
          valuePropName="fileList"
          getValueFromEvent={handleImageChange}
        >
          <Upload
            name="image"
            showUploadList={false}
            action="/upload" // Assuming an endpoint for file uploads
            accept="image/*"
          >
            <Button icon={<PictureOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="post-image"
            style={{ maxWidth: "100%", marginBottom: "10px" }}
          />
        )}
        <Form.Item name="category" label="Category">
          <Select placeholder="Select category">
            <Select.Option value="tech">Tech</Select.Option>
            <Select.Option value="health">Health</Select.Option>
            <Select.Option value="lifestyle">Lifestyle</Select.Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" size="large">
          Post
        </Button>
      </Form>
    </div>
  );
};

export default NewsroomPost;
