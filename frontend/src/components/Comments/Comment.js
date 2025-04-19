import React, { useState } from "react";
import { Button, Typography, Space, Collapse, Popconfirm } from "antd";
import { AiFillEdit, AiOutlineLine, AiOutlinePlus } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../helpers/authHelper";
import CommentEditor from "./CommentEditor";
import ContentDetails from "../Content/ContentDetails";
import ContentUpdateEditor from "../Content/ContentUpdateEditor";
import Markdown from "../Markdown/Markdown";
import { MdCancel } from "react-icons/md";
import { BsReplyFill } from "react-icons/bs";
import { DeleteOutlined } from "@ant-design/icons";
import Moment from "react-moment";

import {
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "../../api/commentApi"; // Make sure the path is correct

const { Panel } = Collapse;

const Comment = (props) => {
  const { depth, addComment, removeComment, editComment } = props;
  const commentData = props.comment;
  const [minimised, setMinimised] = useState(depth % 4 === 3);
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(commentData);
  const user = isLoggedIn();
  const isAuthor = user && user.userId === comment.commenter._id;
  const navigate = useNavigate();

  const [updateCommentApi] = useUpdateCommentMutation();
  const [deleteCommentApi] = useDeleteCommentMutation();

  const handleSetReplying = () => {
    if (isLoggedIn()) {
      setReplying(!replying);
    } else {
      navigate("/login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = e.target.content.value;

    try {
      await updateCommentApi({
        id: comment._id,
        token: user.token,
        body: { content },
      }).unwrap();

      const newCommentData = { ...comment, content, edited: true };
      setComment(newCommentData);
      editComment(newCommentData);
      setEditing(false);
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCommentApi({
        id: comment._id,
        token: user.token,
      }).unwrap();
      removeComment(comment);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f7f7f7",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <Space style={{ width: "100%" }} direction="vertical">
        {props.profile ? (
          <div>
            <Typography.Title level={4}>
              <Link to={"/posts/" + comment.post._id}>
                {comment.post.title}
              </Link>
            </Typography.Title>
            <Typography.Text type="secondary">
              <Moment fromNow>{comment.createdAt}</Moment>{" "}
              {comment.edited && <>(Edited)</>}
            </Typography.Text>
          </div>
        ) : (
          <Space style={{ width: "100%" }} justify="space-between">
            <Space>
              <ContentDetails
                username={comment.commenter.username}
                createdAt={comment.createdAt}
                edited={comment.edited}
              />
              <Button
                icon={minimised ? <AiOutlinePlus /> : <AiOutlineLine />}
                onClick={() => setMinimised(!minimised)}
              />
            </Space>
            {!minimised && (
              <Space>
                <Button
                  icon={!replying ? <BsReplyFill /> : <MdCancel />}
                  onClick={handleSetReplying}
                />
                {user && (isAuthor || user.isAdmin) && (
                  <Space>
                    <Button
                      icon={editing ? <MdCancel /> : <AiFillEdit />}
                      onClick={() => setEditing(!editing)}
                    />
                    <Popconfirm
                      title="Are you sure to delete this comment?"
                      onConfirm={handleDelete}
                    >
                      <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                  </Space>
                )}
              </Space>
            )}
          </Space>
        )}

        {!minimised && (
          <div style={{ marginTop: "10px", overflow: "hidden" }}>
            {!editing ? (
              <Markdown content={comment.content} />
            ) : (
              <ContentUpdateEditor
                handleSubmit={handleSubmit}
                originalContent={comment.content}
              />
            )}

            {replying && !minimised && (
              <div style={{ marginTop: "20px" }}>
                <CommentEditor
                  comment={comment}
                  addComment={addComment}
                  setReplying={setReplying}
                  label="What are your thoughts on this comment?"
                />
              </div>
            )}

            {comment.children && (
              <Collapse defaultActiveKey={["1"]}>
                {comment.children.map((reply) => (
                  <Panel
                    header={`Reply by ${reply.commenter.username}`}
                    key={reply._id}
                  >
                    <Comment
                      key={reply._id}
                      comment={reply}
                      depth={depth + 1}
                      addComment={addComment}
                      removeComment={removeComment}
                      editComment={editComment}
                    />
                  </Panel>
                ))}
              </Collapse>
            )}
          </div>
        )}
      </Space>
    </div>
  );
};

export default Comment;
