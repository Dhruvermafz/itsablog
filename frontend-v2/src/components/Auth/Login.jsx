import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../api/userApi"; // Import the RTK Query hook
import { loginUser } from "../../helpers/authHelper";
import logo from "../../assets/images/logo.png";
const LoginView = () => {
  const [allowTrial] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");

  // Use the login mutation hook from userApi
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData).unwrap(); // Call the login mutation and unwrap the result
      if (data.error) {
        setServerError(data.error);
      } else {
        loginUser(data); // Store token or user data as needed
        navigate("/");
      }
    } catch (err) {
      setServerError(err?.data?.error || "An error occurred during login");
    }
  };

  return (
    <div className="w-full max-w-[26rem] p-4 sm:px-5 mx-auto">
      <div className="text-center">
        <img className="mx-auto size-16" src={logo} alt="logo" />
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-slate-600 dark:text-navy-100">
            Welcome Back
          </h2>
          <p className="text-slate-400 dark:text-navy-300">
            Please sign in to continue
          </p>
        </div>
      </div>
      <div className="card mt-5 rounded-lg p-5 lg:p-7 bg-white dark:bg-navy-700 shadow">
        {serverError && (
          <div className="mb-4 text-red-500 text-sm">{serverError}</div>
        )}
        <form onSubmit={handleSubmit}>
          <label className="block">
            <span>Email:</span>
            <span className="relative mt-1.5 flex">
              <input
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                placeholder="Enter Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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
            </span>
          </label>
          <label className="mt-4 block">
            <span>Password:</span>
            <span className="relative mt-1.5 flex">
              <input
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                placeholder="Enter Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
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
            </span>
          </label>
          <div className="mt-4 flex items-center justify-between space-x-2">
            <label className="inline-flex items-center space-x-2">
              <input
                className="form-checkbox is-basic size-5 rounded-sm border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
                type="checkbox"
              />
              <span className="line-clamp-1">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-slate-400 transition-colors line-clamp-1 hover:text-slate-800 focus:text-slate-800 dark:text-navy-300 dark:hover:text-navy-100 dark:focus:text-navy-100"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="btn mt-5 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="mt-4 text-center text-xs-plus">
          <p className="line-clamp-1">
            <span>Don't have an account?</span>
            <Link
              to="/signup"
              className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-8 flex justify-center text-xs text-slate-400 dark:text-navy-300">
        <a href="#">Privacy Notice</a>
        <div className="mx-3 my-1 w-px bg-slate-200 dark:bg-navy-500"></div>
        <a href="#">Term of Service</a>
      </div>
    </div>
  );
};

export default LoginView;
