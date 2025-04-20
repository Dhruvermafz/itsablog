import React, { useState } from "react";
import {
  Steps,
  Button,
  message,
  Select,
  Alert,
  Typography,
  Card,
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  BookOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Navbar from "../Home/Navbar";

const { Step } = Steps;
const { Title, Text } = Typography;
const { Option } = Select;

const UserOnboarding = () => {
  const [current, setCurrent] = useState(0);
  const [role, setRole] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  const categories = [
    "Technology",
    "Health",
    "Business",
    "Lifestyle",
    "Education",
    "Fiction",
    "Non-Fiction",
    "Self-Help",
    "Travel",
    "History",
  ];

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const handleFinish = () => {
    Modal.confirm({
      title: "Finalize Your Role?",
      content: `Once you complete onboarding as a ${role?.toUpperCase()}, you can't change your role directly without a request. Are you sure?`,
      okText: "Yes, Finish",
      cancelText: "Go Back",
      onOk: () => {
        message.success("Profile setup complete!");
        if (role === "writer") {
          navigate("/write");
        } else {
          navigate("/explore");
        }
      },
    });
  };

  const steps = [
    {
      title: "Choose Role",
      icon: <UserOutlined />,
      content: (
        <Card title="What describes you best?" bordered>
          <Select
            value={role}
            onChange={(val) => setRole(val)}
            placeholder="Select your role"
            style={{ width: "100%" }}
          >
            <Option value="writer">Writer ✍️</Option>
            <Option value="reader">Reader 📖</Option>
          </Select>
          <Alert
            type="info"
            showIcon
            message="Why choose a role?"
            description="Writers can post content, while readers can explore and engage with it. This helps us tailor your experience."
            style={{ marginTop: 20 }}
          />
        </Card>
      ),
    },
    {
      title: "Pick Categories",
      icon: <BookOutlined />,
      content: (
        <Card title="Pick your favorite categories" bordered>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Select categories"
            value={selectedCategories}
            onChange={(values) => setSelectedCategories(values)}
          >
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Card>
      ),
    },
    {
      title: "Confirm",
      icon: <CheckCircleOutlined />,
      content: (
        <Card>
          <Title level={4}>Review Your Choices</Title>
          <Text>
            <strong>Role:</strong>{" "}
            {role === "writer" ? "Writer ✍️" : "Reader 📖"}
          </Text>
          <br />
          <Text>
            <strong>Categories:</strong>{" "}
            {selectedCategories.join(", ") || "None selected"}
          </Text>

          <Alert
            type="warning"
            showIcon
            style={{ marginTop: 20 }}
            message="Important Notice"
            description="Once submitted, your role cannot be changed directly. You’ll need to raise a request to our support team to change your role later."
          />

          <Card
            type="inner"
            title="📘 Roles & Limitations"
            style={{ marginTop: 20 }}
          >
            <Title level={5}>📝 Writer:</Title>
            <ul>
              <li>Can publish blog posts.</li>
              <li>Can receive feedback from readers.</li>
              <li>Must follow content guidelines strictly.</li>
              <li>3 post limit per day (can be extended on request).</li>
            </ul>
            <Title level={5}>📖 Reader:</Title>
            <ul>
              <li>Can follow writers and bookmark posts.</li>
              <li>Can leave comments & reviews on posts.</li>
              <li>Cannot create or publish content.</li>
            </ul>
          </Card>
        </Card>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 600, margin: "auto", padding: 24 }}>
        <Steps current={current} style={{ marginBottom: 24 }}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} icon={item.icon} />
          ))}
        </Steps>

        <div className="steps-content">{steps[current].content}</div>

        <div
          className="steps-action"
          style={{ marginTop: 24, textAlign: "right" }}
        >
          {current > 0 && (
            <Button style={{ marginRight: 8 }} onClick={prev}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              type="primary"
              onClick={next}
              disabled={current === 0 && !role}
            >
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={handleFinish}>
              Finish
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default UserOnboarding;
