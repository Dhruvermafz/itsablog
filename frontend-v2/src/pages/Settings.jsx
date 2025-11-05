import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Upload, DatePicker, message, Spin } from "antd";
import {
  UserOutlined,
  LockOutlined,
  DiscordOutlined,
  WhatsAppOutlined,
  InstagramOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  FileTextOutlined,
  CameraOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useUpdateUserMutation } from "../api/userApi";
import { isLoggedIn } from "../helpers/authHelper";
import Avatar from "react-avatar";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const Settings = () => {
  const navigate = useNavigate();
  const currentUser = isLoggedIn();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("edit-profile");
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (currentUser) {
      setUser({
        _id: currentUser.userId,
        username: currentUser.username,
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || "",
        biography: currentUser.biography || "",
        avatar: currentUser.profileImage || "",
        dateOfBirth: currentUser.dateOfBirth || null,
      });
    } else {
      message.error("Please log in to access settings");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleSave = async () => {
    if (!user) return;
    try {
      const userData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        biography: user.biography || "",
        profileImage: user.avatar || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth || null,
      };
      await updateUser({ id: user._id, userData }).unwrap();
      message.success("Profile updated successfully");
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      message.error("Failed to update profile");
    }
  };

  const handleInputChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      const url = URL.createObjectURL(info.file.originFileObj);
      setUser((prev) => ({ ...prev, avatar: url }));
      message.success("Profile photo updated");
    }
  };

  const sidebarItems = [
    { key: "edit-profile", label: "Edit profile", icon: <UserOutlined /> },
    {
      key: "change-password",
      label: "Change password",
      icon: <LockOutlined />,
    },
    { key: "more", label: "MORE", isHeader: true },
    { key: "discord", label: "Join Discord", icon: <DiscordOutlined /> },
    { key: "whatsapp", label: "Join Whatsapp", icon: <WhatsAppOutlined /> },
    {
      key: "instagram",
      label: "Follow on Instagram",
      icon: <InstagramOutlined />,
    },
    {
      key: "issues",
      label: "Your Issues",
      icon: <ExclamationCircleOutlined />,
    },
    { key: "feedback", label: "Give Feedback", icon: <MessageOutlined /> },
    { key: "privacy", label: "Privacy Policy", icon: <FileTextOutlined /> },
    { key: "terms", label: "Terms of Service", icon: <FileTextOutlined /> },
  ];

  const content = {
    "edit-profile": (
      <div className="space-y-6">
        {/* Profile Photo */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar
              name={user?.username || "User"}
              src={user?.avatar}
              size="100"
              round={true}
              className="border-4 border-gray-200"
            />
            <Upload
              showUploadList={false}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => onSuccess("ok"), 0);
              }}
              onChange={handleImageUpload}
            >
              <button className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                <CameraOutlined className="text-sm" />
              </button>
            </Upload>
          </div>
          <div>
            <Title level={5} className="text-gray-900 !mt-0 !mb-1">
              Profile photo
            </Title>
            <Text className="text-gray-500 text-sm">
              Upload a new profile photo
            </Text>
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={user?.username || ""}
              disabled
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First name
            </label>
            <input
              type="text"
              value={user?.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last name
            </label>
            <input
              type="text"
              value={user?.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of birth
            </label>
            <DatePicker
              value={
                user?.dateOfBirth ? dayjs(user.dateOfBirth, "DD/MM/YYYY") : null
              }
              onChange={(date) =>
                handleInputChange(
                  "dateOfBirth",
                  date ? date.format("DD/MM/YYYY") : null
                )
              }
              format="DD/MM/YYYY"
              placeholder="09/11/2002"
              className="w-full h-11"
              suffixIcon={<CalendarOutlined className="text-gray-400" />}
            />
            <Text className="text-xs text-gray-500 mt-1">
              This won't be shown publicly. Enter in DD/MM/YYYY format.
            </Text>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={user?.biography || ""}
            onChange={(e) => handleInputChange("biography", e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Write something about yourself..."
          />
        </div>

        <div className="h-px bg-gray-200" />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button
            onClick={() => navigate(-1)}
            className="px-6 h-10 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={isUpdating}
            className="px-6 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {isUpdating ? <Spin size="small" /> : "Save Changes"}
          </Button>
        </div>
      </div>
    ),
    "change-password": (
      <div className="p-6 text-gray-500">
        Change password form coming soon...
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-1">
              <Title
                level={4}
                className="text-gray-900 !text-lg !font-semibold !mt-0 mb-4"
              >
                Settings
              </Title>

              {sidebarItems.map((item) => {
                if (item.isHeader) {
                  return (
                    <div key={item.key} className="my-4">
                      <Text className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        {item.label}
                      </Text>
                    </div>
                  );
                }
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      activeTab === item.key
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
              <Title
                level={3}
                className="text-gray-900 !text-2xl !font-semibold !mt-0 mb-6"
              >
                {sidebarItems.find((i) => i.key === activeTab)?.label ||
                  "Edit Profile"}
              </Title>
              {content[activeTab] || content["edit-profile"]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
