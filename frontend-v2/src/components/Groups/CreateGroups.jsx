import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Switch, Typography, Space, message } from "antd";
import { useCreateGroupMutation } from "../../api/groupApi"; // Adjust path as needed
import styles from "./Group.module.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

const GroupCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [createGroup, { isLoading: loading }] = useCreateGroupMutation(); // RTK Query mutation hook

  const onFinish = async (values) => {
    try {
      const groupData = {
        name: values.name,
        description: values.description,
        rules: values.rules
          ? values.rules.split("\n").filter((rule) => rule.trim())
          : [],
        isPrivate: values.isPrivate,
        category: values.category,
      };
      const response = await createGroup(groupData).unwrap(); // Unwrap to get the response or throw an error
      message.success("Group created successfully!");
      navigate(`/groups/${response._id}`); // Redirect to the new group's page
    } catch (error) {
      console.error("Create group error:", error);
      message.error(error?.data?.message || "Failed to create group");
    }
  };

  return (
    <>
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Create Group
        </h2>
        <div className="hidden h-full py-1 sm:flex">
          <div className="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
        </div>
        <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
          <li className="flex items-center space-x-2">
            <a
              className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
              href="/groups"
            >
              Groups
            </a>
            <svg
              x-ignore
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
          <li>Create Group</li>
        </ul>
      </div>

      <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        <div className="col-span-12 grid lg:col-span-4 lg:place-items-center">
          <div>
            <ol className="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
              <li className="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                  <i className="fa-solid fa-users text-base"></i>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400 dark:text-navy-300">
                    Step 1
                  </p>
                  <h3 className="text-base font-medium text-primary dark:text-accent-light">
                    General
                  </h3>
                </div>
              </li>
              <li className="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                <div className="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                  <i className="fa-solid fa-file-alt text-base"></i>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400 dark:text-navy-300">
                    Step 2
                  </p>
                  <h3 className="text-base font-medium">Description</h3>
                </div>
              </li>
              <li className="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                <div className="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                  <i className="fa-solid fa-shield-alt text-base"></i>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400 dark:text-navy-300">
                    Step 3
                  </p>
                  <h3 className="text-base font-medium">Rules</h3>
                </div>
              </li>
              <li className="step space-x-4 before:bg-slate-200 dark:before:bg-navy-500">
                <div className="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                  <i className="fa-solid fa-check text-base"></i>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400 dark:text-navy-300">
                    Step 4
                  </p>
                  <h3 className="text-base font-medium">Confirm</h3>
                </div>
              </li>
            </ol>
          </div>
        </div>
        <div className="col-span-12 grid lg:col-span-8">
          <div className="card">
            <div className="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                  <i className="fa-solid fa-users"></i>
                </div>
                <h4 className="text-lg font-medium text-slate-700 dark:text-navy-100">
                  General
                </h4>
              </div>
            </div>
            <div className="space-y-4 p-4 sm:p-5">
              <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                  name="name"
                  label="Group Name"
                  rules={[
                    { required: true, message: "Please enter the group name" },
                  ]}
                >
                  <Input
                    className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter group name"
                  />
                </Form.Item>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[
                      { required: true, message: "Please select a category" },
                    ]}
                  >
                    <select className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">
                      <option value="Technology">Technology</option>
                      <option value="Literature">Literature</option>
                      <option value="Health">Health</option>
                      <option value="Food">Food</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Other">Other</option>
                    </select>
                  </Form.Item>
                  <Form.Item
                    name="isPrivate"
                    label="Privacy"
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren="Private"
                      unCheckedChildren="Public"
                      className="mt-1.5"
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    { required: true, message: "Please enter a description" },
                  ]}
                >
                  <TextArea
                    className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Describe your group"
                    rows={4}
                  />
                </Form.Item>
                <Form.Item name="rules" label="Rules (one per line)">
                  <TextArea
                    className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter group rules, one per line"
                    rows={4}
                  />
                </Form.Item>
                <div className="flex justify-center space-x-2 pt-4">
                  <Button
                    className="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    onClick={() => navigate("/groups")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Cancel</span>
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                  >
                    <span>Create Group</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupCreate;
