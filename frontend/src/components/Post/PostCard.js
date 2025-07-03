import React, { useState } from "react";
import {
  Button,
  Card,
  Popover,
  Space,
  Typography,
  Menu,
  Popconfirm,
  message,
} from "antd";
import { MdCancel } from "react-icons/md";
import {
  EditOutlined,
  DeleteOutlined,
  LikeOutlined,
  MessageOutlined,
  MoreOutlined,
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
import "./postCard.css"; // Separate CSS file for styling

const { Title, Text } = Typography;

const PostCard = ({ post, preview, removePost }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [visible, setVisible] = useState(false); // State for Popover visibility
  const navigate = useNavigate();
  const user = isLoggedIn();

  const [currentPost, setCurrentPost] = useState(post);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  // Determine maxHeight based on preview type
  const maxHeight = preview === "primary" ? 250 : null;

  const handleDeletePost = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await deletePost(currentPost._id, user);
      message.success("Post deleted successfully!");
      if (preview) {
        removePost(currentPost);
      } else {
        navigate("/");
      }
    } catch (error) {
      message.error("Failed to delete post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (e) => {
    setVisible(false); // Close Popover
    navigate(`/blog/edit/${currentPost._id}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get("content");

    setLoading(true);
    try {
      const updatedPost = await updatePost(currentPost._id, user, { content });
      setCurrentPost({
        ...currentPost,
        content: updatedPost.content,
        edited: true,
      });
      message.success("Post updated successfully!");
      setEditing(false);
    } catch (error) {
      message.error("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (liked) => {
    try {
      if (liked) {
        setLikeCount((prev) => prev + 1);
        await likePost(currentPost._id, user);
      } else {
        setLikeCount((prev) => prev - 1);
        await unlikePost(currentPost._id, user);
      }
    } catch (error) {
      message.error("Failed to update like. Please try again.");
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1)); // Revert on error
    }
  };

  const handlePopoverVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const isAuthor = user?.username === currentPost?.poster?.username;

  const menuContent = (
    <Menu className="post-menu">
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={handleEditPost}>
        Edit Post
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        <Popconfirm
          title="Are you sure you want to delete this post?"
          onConfirm={handleDeletePost}
          okText="Yes"
          cancelText="No"
          onCancel={() => setVisible(false)}
        >
          Delete Post
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  return (
    <PostContentBox
      clickable={preview}
      post={currentPost}
      className="post-card"
    >
      <HorizontalStack justifyContent="space-between" className="post-header">
        <ContentDetails
          username={currentPost?.poster?.username}
          createdAt={currentPost?.createdAt}
          edited={currentPost?.edited}
          preview={preview === "secondary"}
        />
        {user && (isAuthor || user.isAdmin) && preview !== "secondary" && (
          <Popover
            content={menuContent}
            trigger="click"
            open={visible}
            onOpenChange={handlePopoverVisibleChange}
            placement="bottomRight"
            overlayClassName="post-menu-popover"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              aria-label="Post options"
              className="more-button"
              disabled={loading}
            />
          </Popover>
        )}
      </HorizontalStack>

      <Link to={`/blog/${currentPost._id}`} className="post-title-link">
        <Title level={5} className="post-title">
          {currentPost?.title}
        </Title>
      </Link>

      {preview !== "secondary" &&
        (editing ? (
          <ContentUpdateEditor
            handleSubmit={handleSubmit}
            originalContent={currentPost?.content}
            loading={loading}
          />
        ) : (
          <div
            className="post-content"
            style={{ maxHeight, overflow: "hidden" }}
          >
            <Markdown content={currentPost?.content} />
          </div>
        ))}

      <HorizontalStack justifyContent="space-between" className="post-footer">
        <HorizontalStack className="post-actions">
          <LikeBox
            likeCount={likeCount}
            liked={currentPost?.liked}
            onLike={handleLike}
            disabled={loading || !user}
          />
          <Space direction="vertical" className="comment-section">
            <Button
              type="text"
              icon={<MessageOutlined />}
              onClick={() => navigate(`/blog/${currentPost._id}`)}
              aria-label="View comments"
              disabled={loading}
            />
            <Text strong className="comment-count">
              {currentPost?.commentCount}
            </Text>
          </Space>
        </HorizontalStack>
        <UserLikePreview
          postId={currentPost?._id}
          userLikePreview={currentPost?.userLikePreview}
        />
      </HorizontalStack>
    </PostContentBox>
  );
};

export default PostCard;
