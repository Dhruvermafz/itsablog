import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../../api/userApi"; // Import the RTK Query hook
import { isLength, isEmail, contains } from "validator";
import { Form } from "antd";
import logo from "../../assets/images/logo.png";
const SignupView = () => {
  const navigate = useNavigate();
  const [allowTrial] = useState(true);
  const [serverError, setServerError] = useState("");
  const [form] = Form.useForm();

  // Use the register mutation hook from userApi
  const [register, { isLoading: loading }] = useRegisterMutation();

  const handleSubmit = async (values) => {
    try {
      const data = await register(values).unwrap(); // Call the register mutation and unwrap the result
      if (data.error) {
        setServerError(data.error);
      } else {
        navigate(`/email/confirm/${data.userId}`); // Navigate to email confirmation page
      }
    } catch (err) {
      setServerError(err?.data?.error || "An error occurred during signup");
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

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match"));
    },
  });

  return (
    <div className="w-full max-w-[26rem] p-4 sm:px-5">
      <div className="text-center">
        <img className="mx-auto size-16" src={logo} alt="logo" />
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-slate-600 dark:text-navy-100">
            Welcome To Lineone
          </h2>
          <p className="text-slate-400 dark:text-navy-300">
            Please sign up to continue
          </p>
        </div>
      </div>
      <div className="card mt-5 rounded-lg p-5 lg:p-7 bg-white dark:bg-navy-700 shadow">
        {serverError && (
          <div className="mb-4 text-red-500 text-sm">{serverError}</div>
        )}
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ type: "email", message: "Please enter a valid email" }]}
          >
            <label className="relative flex">
              <input
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                placeholder="Email"
                type="email"
              />
              <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
            </label>
          </Form.Item>
          <Form.Item name="username" rules={[{ validator: validateUsername }]}>
            <label className="relative flex">
              <input
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                placeholder="Username"
                type="text"
              />
              <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
            </label>
          </Form.Item>
          <Form.Item name="password" rules={[{ validator: validatePassword }]}>
            <label className="relative flex">
              <input
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                placeholder="Password"
                type="password"
              />
              <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
            </label>
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[{ validator: validateConfirmPassword }]}
          >
            <label className="relative flex">
              <input
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                placeholder="Repeat Password"
                type="password"
              />
              <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
            </label>
          </Form.Item>
          <div className="mt-4 flex items-center space-x-2">
            <input
              className="form-checkbox is-basic size-5 rounded-sm border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
              type="checkbox"
              required
            />
            <p className="line-clamp-1">
              I agree with
              <a
                href="#"
                className="text-slate-400 hover:underline dark:text-navy-300"
              >
                privacy policy
              </a>
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn mt-5 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 disabled:opacity-50"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </Form>
        <div className="mt-4 text-center text-xs-plus">
          <p className="line-clamp-1">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupView;
