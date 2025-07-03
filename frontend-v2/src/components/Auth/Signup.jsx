import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../api/users";
import { isLength, isEmail, contains } from "validator";
import { Typography, Input, Button, Form, Alert, Card, Space } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import Layout from "../Extras/Layout";
import Banner from "../Extras/Banner";
import "./signup.css";

const { Title } = Typography;

const SignupView = () => {
  const navigate = useNavigate();
  const [allowTrial] = useState(true);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    const data = await signup(values);
    setLoading(false);

    if (data.error) {
      setServerError(data.error);
    } else {
      navigate(`/email/confirm/${data.userId}`);
    }
  };

  const validateUsername = (_, value) => {
    if (!isLength(value || "", { min: 6, max: 30 })) {
      return Promise.reject(new Error("Must be between 6 and 30 characters"));
    }
    if (contains(value || "", " ")) {
      return Promise.reject(new Error("Must not contain spaces"));
    }
    return Promise.resolve();
  };

  const validatePassword = (_, value) => {
    if (!isLength(value || "", { min: 8 })) {
      return Promise.reject(new Error("Must be at least 8 characters long"));
    }
    return Promise.resolve();
  };

  return (
    <>
      <Banner />
      <Layout className="Auth-right-signup">
        {allowTrial && (
          <div className="portal-notif">
            <span>Trial Login available at Login Portal</span>
          </div>
        )}

        <div className="portal portal-signup">
          <Card className="signup-card" bordered={false}>
            <Title level={2} className="portal-head">
              Sign Up
            </Title>
            <Link to="/login" className="portal-link">
              Already have an account?
            </Link>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={formData}
            >
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: "Username is required" },
                  { validator: validateUsername },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your username"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Email is required" },
                  {
                    type: "email",
                    message: "Must be a valid email address",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Password is required" },
                  { validator: validatePassword },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  size="large"
                />
              </Form.Item>

              {serverError && (
                <Alert
                  message={serverError}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                >
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Layout>
    </>
  );
};

export default SignupView;
