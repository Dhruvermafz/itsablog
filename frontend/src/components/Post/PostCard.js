import React, { useState } from "react";

import {
  Button,
  Card,
  Popover,
  Space,
  Typography,
  Menu,
  Modal,
  message,
  Popconfirm,
} from "antd";
import { MdCancel } from "react-icons/md";
import {
  EditOutlined,
  DeleteOutlined,
  LikeOutlined,
  LikeFilled,
  MoreOutlined,
  MessageOutlined,
  MessageFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { deletePost, likePost, unlikePost, updatePost } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import ContentDetails from "../Content/ContentDetails";
import LikeBox from "../Extras/LikeBox";
import PostContentBox from "../Post/PostContentBox";
import HorizontalStack from "../util/HorizontalStack";
import ContentUpdateEditor from "../Content/ContentUpdateEditor";
import Markdown from "../Markdown/Markdown";
import UserLikePreview from "../UserModal/UserLikePreview";
import { Link } from "react-router-dom";

const PostCard = (props) => {
  const { preview, removePost } = props;
  const [loading, setLoading] = useState(false);
  const history = useNavigate();
  const user = isLoggedIn();

  const [anchorEl, setAnchorEl] = useState(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [post, setPost] = useState(props.post);
  const [likeCount, setLikeCount] = useState(props.post.likeCount);

  let maxHeight = null;
  if (preview === "primary") {
    maxHeight = 250;
  }

  const handleDeletePost = async (e) => {
    e.stopPropagation();
    if (!confirmDelete) {
      setConfirmDelete(true);
    } else {
      setLoading(true);
      await deletePost(post._id, isLoggedIn());
      setLoading(false);
      if (preview) {
        removePost(post);
      } else {
        history("/");
      }
    }
  };

  const handleEditPost = (e) => {
    e.stopPropagation();
    history(`/blog/edit/${post._id}`); // Navigate to edit post page with post ID
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get("content"); // Fetch content correctly

    setLoading(true);
    try {
      const updatedPost = await updatePost(post._id, isLoggedIn(), { content });
      setPost({ ...post, content: updatedPost.content, edited: true }); // Ensure proper re-render
      message.success("Post updated successfully!");
      setEditing(false);
    } catch (error) {
      message.error("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (liked) => {
    if (liked) {
      setLikeCount((prevCount) => prevCount + 1);
      await likePost(post._id, user);
    } else {
      setLikeCount((prevCount) => prevCount - 1);
      await unlikePost(post._id, user);
    }
  };

  const isAuthor = user?.username === post?.poster?.username;

  return (
    <PostContentBox clickable={preview} post={post} editing={editing}>
      <HorizontalStack justifyContent="space-between">
        <ContentDetails
          username={post?.poster?.username}
          createdAt={post?.createdAt}
          edited={post?.edited}
          preview={preview === "secondary"}
        />
        <Space>
          {user && (isAuthor || user.isAdmin) && preview !== "secondary" && (
            <div>
              <Popover
                placement="bottomRight"
                content={
                  <Menu>
                    <Menu.Item
                      icon={<EditOutlined />}
                      onClick={(e) => handleEditPost(e)}
                    >
                      Edit
                    </Menu.Item>

                    <Menu.Item
                      icon={<DeleteOutlined />}
                      style={{ color: "red" }}
                    >
                      <Popconfirm
                        title="Are you sure you want to delete this post?"
                        onConfirm={handleDeletePost}
                        okText="Yes"
                        cancelText="No"
                      >
                        <a href="#">Delete</a>
                      </Popconfirm>
                    </Menu.Item>
                  </Menu>
                }
                trigger="click"
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Popover>
            </div>
          )}
        </Space>
      </HorizontalStack>

      <Link to={`/blog/${post._id}`}>
        <Typography.Title
          level={5}
          style={{
            marginBottom: "8px",
            maxHeight: "125px",
            overflow: "hidden",
          }}
          className="title"
        >
          {post?.title}
        </Typography.Title>
      </Link>

      {preview !== "secondary" &&
        (editing ? (
          <ContentUpdateEditor
            handleSubmit={handleSubmit}
            originalContent={post?.content}
          />
        ) : (
          <div
            style={{ maxHeight: maxHeight, overflow: "hidden" }}
            className="content"
          >
            <Markdown content={post?.content} />
          </div>
        ))}

      <HorizontalStack
        style={{ marginTop: "16px" }}
        justifyContent="space-between"
      >
        <HorizontalStack>
          <LikeBox
            likeCount={likeCount}
            liked={post?.liked}
            onLike={handleLike}
          />
          <Space
            size={0}
            direction="vertical"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              type="text"
              icon={<MessageOutlined />}
              onClick={() => history(`/blog/${post._id}`)}
            />
            <Typography.Text strong style={{ color: "text.secondary" }}>
              {post?.commentCount}
            </Typography.Text>
          </Space>
        </HorizontalStack>
        <Space>
          <UserLikePreview
            postId={post?._id}
            userLikePreview={post?.userLikePreview}
          />
        </Space>
      </HorizontalStack>
    </PostContentBox>
  );
};

export default PostCard;
