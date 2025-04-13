import React, { useEffect, useState } from "react";
import { Card, Button, Typography, Spin, Row, Col } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"; // Import icons from @ant-design/icons
import Comment from "./Comment";
import { getComments } from "../../api/posts";
import { useParams } from "react-router-dom";
import CommentEditor from "./CommentEditor";

const { Title, Text } = Typography;

const Comments = () => {
  const [comments, setComments] = useState(null);
  const [rerender, setRerender] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const fetchComments = async () => {
    setLoading(true);
    const data = await getComments(params);
    setLoading(false);
    if (data.error) {
      setError("Failed to fetch comments");
    } else {
      setComments(data);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const findComment = (id) => {
    let commentToFind;

    const recurse = (comment, id) => {
      if (comment._id === id) {
        commentToFind = comment;
      } else {
        for (let i = 0; i < comment.children.length; i++) {
          const commentToSearch = comment.children[i];
          recurse(commentToSearch, id);
        }
      }
    };

    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      recurse(comment, id);
    }

    return commentToFind;
  };

  const removeComment = (removedComment) => {
    if (removedComment.parent) {
      const parentComment = findComment(removedComment.parent);
      parentComment.children = parentComment.children.filter(
        (comment) => comment._id !== removedComment._id
      );
      setRerender(!rerender);
    } else {
      setComments(
        comments.filter((comment) => comment._id !== removedComment._id)
      );
    }
  };

  const editComment = (editedComment) => {
    if (editedComment.parent) {
      let parentComment = findComment(editedComment.parent);
      for (let i = 0; i < parentComment.children.length; i++) {
        if (parentComment.children[i]._id === editedComment._id) {
          parentComment.children[i] = editedComment;
        }
      }
    } else {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i]._id === editedComment._id) {
          comments[i] = editedComment;
        }
      }
      setRerender(!rerender);
    }
  };

  const addComment = (comment) => {
    if (comment.parent) {
      const parentComment = findComment(comment.parent);
      parentComment.children = [comment, ...parentComment.children];

      setRerender(!rerender);
    } else {
      setComments([comment, ...comments]);
    }
  };

  return comments ? (
    <div>
      <Card>
        <CommentEditor
          addComment={addComment}
          label="What are your thoughts on this post?"
        />
      </Card>

      {comments.length > 0 ? (
        <div style={{ paddingBottom: "16px" }}>
          {comments.map((comment) => (
            <Comment
              addComment={addComment}
              removeComment={removeComment}
              editComment={editComment}
              comment={comment}
              key={comment._id}
              depth={0}
            >
              {/* Edit and Delete Icons for each comment */}
              <Button
                icon={<EditOutlined />}
                onClick={() => editComment(comment)} // Add edit functionality here
                style={{ marginRight: 8 }}
              >
                Edit
              </Button>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => removeComment(comment)} // Add remove functionality here
                danger
              >
                Delete
              </Button>
            </Comment>
          ))}
          {loading && (
            <Row justify="center" style={{ marginTop: "16px" }}>
              <Col>
                <Spin tip="Loading comments..." />
              </Col>
            </Row>
          )}
        </div>
      ) : (
        <Row
          justify="center"
          style={{ paddingTop: "16px", paddingBottom: "16px" }}
        >
          <Col>
            <Title level={5} style={{ color: "gray" }}>
              No comments yet...
            </Title>
            <Text style={{ color: "gray" }}>Be the first one to comment!</Text>
          </Col>
        </Row>
      )}
    </div>
  ) : (
    <Row justify="center" style={{ marginTop: "16px" }}>
      <Col>
        <Spin tip="Loading comments..." />
      </Col>
    </Row>
  );
};

export default Comments;
