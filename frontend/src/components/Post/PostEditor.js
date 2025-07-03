import React, { useState, useEffect } from "react";
import { Card, Input, Button, Typography } from "antd";
import { createPost, updatePost, getPost } from "../../api/posts"; // Add getPost and updatePost
import ErrorAlert from "../Extras/ErrorAlert";
import { isLoggedIn } from "../../helpers/authHelper";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../css/createblog.css";
import { useNavigate, useParams } from "react-router-dom"; // Add useParams
import HorizontalStack from "../util/HorizontalStack";
import UserAvatar from "../UserModal/UserAvatar";
import SearchBooks from "../Extras/SearchFilter";

const PostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get post ID from URL (e.g., /blog/:id/edit)
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false); // For fetching post data
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [serverError, setServerError] = useState("");
  const user = isLoggedIn();

  // Determine if in update mode based on presence of id
  const isUpdateMode = !!id;

  // Fetch post data when in update mode
  useEffect(() => {
    if (isUpdateMode) {
      const fetchPost = async () => {
        setFetching(true);
        try {
          const data = await getPost(id); // Assume getPost fetches post by ID
          if (data && !data.error) {
            // Populate formData
            setFormData({
              title: data.title,
              content: data.content,
            });
            // Populate editorState
            const contentState = ContentState.createFromText(
              data.content || ""
            );
            setEditorState(EditorState.createWithContent(contentState));
          } else {
            setServerError(data?.error || "Failed to fetch post");
          }
        } catch (error) {
          setServerError("Error fetching post data");
        } finally {
          setFetching(false);
        }
      };
      fetchPost();
    }
  }, [id, isUpdateMode]);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();

    const postData = {
      title: formData.title,
      content: plainText,
    };

    try {
      let data;
      if (isUpdateMode) {
        // Update existing post
        data = await updatePost(id, postData, isLoggedIn());
      } else {
        // Create new post
        data = await createPost(postData, isLoggedIn());
      }

      setLoading(false);
      if (data && data.error) {
        setServerError(data.error);
      } else {
        navigate(`/blog/${data._id || id}`); // Navigate to the post page
      }
    } catch (error) {
      setLoading(false);
      setServerError("Error submitting post");
    }
  };

  return (
    <div className="blog-portal-wrapper">
      <Card>
        <div className="blog-portal">
          {user && (
            <HorizontalStack spacing={2}>
              <UserAvatar width={50} height={50} username={user.username} />
              <div style={{ display: "flex", alignItems: "center" }}>
                <h2 className="blog-portal-head">
                  {isUpdateMode
                    ? `Editing post, ${user.username}`
                    : `What's in your mind, ${user.username}?`}
                </h2>
              </div>
            </HorizontalStack>
          )}

          <Typography>
            <a
              href="https://commonmark.org/help/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Markdown Help
            </a>
          </Typography>

          {/* <SearchBooks onBookSelect={handleBookSelect} /> */}

          {fetching ? (
            <Typography>Loading post data...</Typography>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                placeholder="Title"
                name="title"
                onChange={handleChange}
                value={formData.title}
                style={{ width: "100%", marginBottom: "1rem" }}
              />

              <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                wrapperClassName="richWrapper"
                editorClassName="richEditor"
                toolbarClassName="richToolbar"
                placeholder="Write your blog here.."
              />
              <ErrorAlert error={serverError} />
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ marginTop: "1rem", width: "100%" }}
              >
                {loading ? "Submitting" : isUpdateMode ? "Update" : "Submit"}
              </Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PostEditor;
