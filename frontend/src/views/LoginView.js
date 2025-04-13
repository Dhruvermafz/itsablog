import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/users";
import { Input, Button, Form, Typography, Alert } from "antd";
import { PersonOutline, LockOutlined } from "@mui/icons-material"; // Optional: icons can be used if needed
import ErrorAlert from "../components/Extras/ErrorAlert";
import { loginUser } from "../helpers/authHelper";
import Copyright from "../components/Home/Footer";
import Banner from "../components/Banner";
import { icon } from "../static";
import Layout from "../components/Layout/Layout";
import TransitionOptions from "../components/util/TransitionOptions";

const { Title, Text } = Typography;

const LoginView = () => {
  const [allowTrial] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");
  const [transitonOption, setTransitionOption] = useState("none");

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (values) => {
    const data = await login(values);
    if (data.error) {
      setServerError(data.error);
      setTransitionOption("failure");
    } else {
      loginUser(data);
      navigate("/");
      setTransitionOption("success");
    }
  };

  return (
    <>
      <Banner />
      <Layout>
        <div className="portal-login">
          {allowTrial && (
            <div className="portal-notif">
              <h3>Trial Use</h3>
              <ul>
                <li>
                  <span>Email </span>: &nbsp; <span>trial@trial.com</span>
                </li>
                <li>
                  <span>Password </span>: &nbsp; <span>trial123</span>
                </li>
              </ul>
            </div>
          )}
          <div className="portal">
            <Title level={2} className="portal-head">
              Login
            </Title>

            <Form
              name="loginForm"
              initialValues={{ remember: true }}
              onFinish={handleSubmit}
            >
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email address!",
                  },
                ]}
              >
                <Input
                  name="email"
                  size="large"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
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
                  name="password"
                  size="large"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </Form.Item>

              <ErrorAlert error={serverError} />

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="portal-submit"
                  block
                >
                  Login
                </Button>
              </Form.Item>
            </Form>

            <Link to="/signup" className="portal-link">
              Create an account?
            </Link>
            <Link to="/forgotpassword" className="portal-link">
              Forgot Password?
            </Link>
          </div>
        </div>
      </Layout>
      {/* <Copyright /> */}
    </>
  );
};

export default LoginView;
