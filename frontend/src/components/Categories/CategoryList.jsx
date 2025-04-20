import React, { useState } from "react";
import {
  List,
  Input,
  Button,
  Modal,
  Form,
  Typography,
  Space,
  message,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const CategoryList = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Technology" },
    { id: 2, name: "Health" },
    { id: 3, name: "Education" },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form] = Form.useForm();

  const showModal = (category = null) => {
    setEditingCategory(category);
    setIsModalVisible(true);
    if (category) {
      form.setFieldsValue({ name: category.name });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
  };

  const handleFinish = (values) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name: values.name } : cat
        )
      );
      message.success("Category updated!");
    } else {
      const newCategory = {
        id: Date.now(),
        name: values.name,
      };
      setCategories((prev) => [...prev, newCategory]);
      message.success("Category added!");
    }
    handleCancel();
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    message.success("Category deleted.");
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Category Management
      </Title>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 20 }}
        onClick={() => showModal()}
      >
        Add Category
      </Button>

      <List
        bordered
        itemLayout="horizontal"
        dataSource={categories}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                icon={<EditOutlined />}
                onClick={() => showModal(item)}
                type="link"
              />,
              <Popconfirm
                title="Are you sure to delete this category?"
                onConfirm={() => handleDelete(item.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<DeleteOutlined />} type="link" />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={<FolderOutlined style={{ fontSize: 20 }} />}
              title={<strong>{item.name}</strong>}
            />
          </List.Item>
        )}
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingCategory ? "Update" : "Add"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
