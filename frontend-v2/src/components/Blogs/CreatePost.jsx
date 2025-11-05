import React, { useState, useEffect } from "react";
import { Input, Button, Typography, Spin, Select, message } from "antd";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useGetPostQuery,
} from "../../api/postApi";
import ErrorAlert from "../Extras/ErrorAlert";

const { Title, Text } = Typography;

const CreatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    status: "draft",
  });

  const isUpdateMode = !!id;

  // RTK Query hooks
  const {
    data: postData,
    error: fetchError,
    isLoading: fetching,
  } = useGetPostQuery(id, { skip: !isUpdateMode });
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Enter your content..." }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none min-h-[200px] p-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Redirect if not authorized
  useEffect(() => {
    if (
      !isLoggedIn ||
      !user ||
      (user.role !== "reader" && user.role !== "admin")
    ) {
      navigate("/login");
    }
  }, [isLoggedIn, user, navigate]);

  // Populate form in edit mode
  useEffect(() => {
    if (isUpdateMode && postData && !postData.error && editor) {
      setFormData({
        title: postData.title || "",
        content: postData.content || "",
        category: postData.category || "",
        status: postData.status || "draft",
      });
      editor.commands.setContent(postData.content || "");
    }
    if (fetchError) {
      setServerError(fetchError?.data?.error || "Failed to fetch post");
    }
  }, [postData, fetchError, isUpdateMode, editor]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      setServerError("Title, content, and category are required");
      return;
    }

    const storedUser = localStorage.getItem("user");
    let token;
    try {
      token = storedUser ? JSON.parse(storedUser).token : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
    if (!token) {
      setServerError("Authentication token missing. Please log in again.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setServerError("");

    const postDataPayload = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      poster: user._id,
      status: user.role === "admin" ? "published" : formData.status,
    };

    try {
      let result;
      if (isUpdateMode) {
        result = await updatePost({ id, postData: postDataPayload }).unwrap();
      } else {
        result = await createPost(postDataPayload).unwrap();
      }
      navigate(`/blog/${result._id || id}`);
    } catch (error) {
      if (error.status === 400 && error.data?.error === "No token provided") {
        setServerError("Authentication failed. Please log in again.");
        navigate("/login");
      } else {
        setServerError(error?.data?.error || "Error submitting post");
      }
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock categories
  const categories = [
    { value: "technology", label: "Technology" },
    { value: "politics", label: "Politics" },
    { value: "digital", label: "Digital" },
    { value: "home", label: "Home" },
    { value: "accessories", label: "Accessories" },
  ];

  // Toolbar Component
  const MenuBar = () => {
    if (!editor) return null;

    return (
      <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 dark:border-navy-600 bg-slate-50 dark:bg-navy-700">
        <Button
          size="small"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-primary text-white" : ""}
        >
          <b>B</b>
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-primary text-white" : ""}
        >
          <i>I</i>
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={
            editor.isActive("underline") ? "bg-primary text-white" : ""
          }
        >
          <u>U</u>
        </Button>

        <Button
          size="small"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-primary text-white"
              : ""
          }
        >
          H1
        </Button>
        <Button
          size="small"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-primary text-white"
              : ""
          }
        >
          H2
        </Button>

        <Button
          size="small"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList") ? "bg-primary text-white" : ""
          }
        >
          • List
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList") ? "bg-primary text-white" : ""
          }
        >
          1. List
        </Button>

        <Button
          size="small"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={
            editor.isActive({ textAlign: "left" })
              ? "bg-primary text-white"
              : ""
          }
        >
          Left
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" })
              ? "bg-primary text-white"
              : ""
          }
        >
          Center
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            editor.isActive({ textAlign: "right" })
              ? "bg-primary text-white"
              : ""
          }
        >
          Right
        </Button>

        <Button
          size="small"
          onClick={() => {
            const url = window.prompt("Enter URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          Link
        </Button>

        <Button
          size="small"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          Undo
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          Redo
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
        <div className="flex items-center space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z"
            />
          </svg>
          <Title
            level={2}
            className="text-xl font-medium text-slate-700 line-clamp-1 dark:text-navy-50"
          >
            {isUpdateMode ? "Edit Post" : "New Post"}
          </Title>
        </div>
        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="btn min-w-[7rem] border border-slate-300 font-medium text-slate-700 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={loading || fetching}
            className="btn min-w-[7rem] bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
          >
            {isUpdateMode ? "Update" : "Save"}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {serverError && <ErrorAlert message={serverError} />}

      {/* Main Content */}
      {fetching ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
          {/* Left Column: Form */}
          <div className="col-span-12 lg:col-span-8">
            <div className="card">
              <div className="tabs flex flex-col">
                <div className="is-scrollbar-hidden overflow-x-auto">
                  <div className="border-b-2 border-slate-150 dark:border-navy-500">
                    <div className="tabs-list -mb-0.5 flex">
                      <button className="btn h-14 shrink-0 space-x-2 rounded-none border-b-2 border-primary px-4 font-medium text-primary dark:border-accent dark:text-accent-light sm:px-5">
                        <i className="fa-solid fa-layer-group text-base"></i>
                        <span>General</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="tab-content p-4 sm:p-5 space-y-5">
                  <label className="block">
                    <Text className="font-medium text-slate-600 dark:text-navy-100">
                      Title
                    </Text>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter post title"
                      className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      disabled={loading}
                      maxLength={80}
                    />
                  </label>

                  <div>
                    <Text className="font-medium text-slate-600 dark:text-navy-100">
                      Post Content
                    </Text>
                    <div className="mt-1.5 border border-slate-300 dark:border-navy-450 rounded-lg overflow-hidden">
                      <MenuBar />
                      <EditorContent
                        editor={editor}
                        className="tiptap-editor"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Metadata */}
          <div className="col-span-12 lg:col-span-4">
            <div className="card space-y-5 p-4 sm:p-5">
              <label className="block">
                <Text className="font-medium text-slate-600 dark:text-navy-100">
                  Author
                </Text>
                <div className="mt-1.5 flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-navy-500 flex items-center justify-center text-slate-700 dark:text-navy-100 font-medium">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <Text className="text-slate-700 dark:text-navy-100">
                    {user?.username || "Unknown"}
                  </Text>
                </div>
              </label>

              <label className="block">
                <Text className="font-medium text-slate-600 dark:text-navy-100">
                  Category
                </Text>
                <Select
                  value={formData.category}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                  placeholder="Select the category"
                  className="mt-1.5 w-full"
                  disabled={loading}
                  options={categories}
                />
              </label>

              <label className="block">
                <Text className="font-medium text-slate-600 dark:text-navy-100">
                  Status
                </Text>
                <Select
                  value={formData.status}
                  onChange={handleStatusChange}
                  placeholder="Select status"
                  className="mt-1.5 w-full"
                  disabled={loading || user.role === "admin"}
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "published", label: "Published" },
                    { value: "archived", label: "Archived" },
                  ]}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
