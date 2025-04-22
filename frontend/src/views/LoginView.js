import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/users";
import { Input, Button, Form, Typography, Alert, Card, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import ErrorAlert from "../components/Extras/ErrorAlert";
import { loginUser } from "../helpers/authHelper";
import Banner from "../components/Banner";
import Layout from "../components/Layout/Layout";
import "./login.css";

const { Title } = Typography;

const LoginView = () => {
  const [allowTrial] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (values) => {
    const data = await login(values);
    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  return (
    <>
      <Banner />
      <Layout>
        <div className="login-container">
          <Card className="login-card" bordered={false}>
            <Title level={2} className="login-title">
              Welcome Back
            </Title>

            {allowTrial && (
              <Alert
                className="trial-alert"
                message={
                  <div>
                    <strong>Trial Credentials</strong>
                    <br />
                    Email: <code>trial@trial.com</code>
                    <br />
                    Password: <code>trial123</code>
                  </div>
                }
                type="info"
                showIcon
              />
            )}

            <Form
              name="loginForm"
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="input-icon" />}
                  size="large"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="input-icon" />}
                  size="large"
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Item>

              <ErrorAlert error={serverError} />

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Login
                </Button>
              </Form.Item>

              <div className="login-footer">
                <Link to="/signup">Create an account</Link>
                <Link to="/forgotpassword">Forgot password?</Link>
              </div>
            </Form>
          </Card>
        </div>
      </Layout>
    </>
  );
};

export default LoginView;
