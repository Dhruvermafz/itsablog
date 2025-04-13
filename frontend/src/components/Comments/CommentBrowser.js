import React, { useEffect, useState } from "react";
import { Button, Card, Typography, Row, Col, Spin, Select } from "antd";
import { getUserComments } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import Comment from "./Comment";
import Loading from "../Home/Loading";

const { Option } = Select;

const CommentBrowser = (props) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("-createdAt");

  const fetchComments = async () => {
    setLoading(true);

    const newPage = page + 1;
    setPage(newPage);

    let comments = await getUserComments({
      id: props.profileUser._id,
      query: { sortBy },
    });

    setComments(comments);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [sortBy]);

  const handleSortBy = (value) => {
    setComments([]);
    setPage(0);
    setSortBy(value);
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const sorts = {
    "-createdAt": "Latest",
    createdAt: "Earliest",
  };

  return (
    <div>
      <Card>
        <Select
          defaultValue={sortBy}
          style={{ width: 200 }}
          onChange={handleSortBy}
        >
          {Object.keys(sorts).map((key) => (
            <Option key={key} value={key}>
              {sorts[key]}
            </Option>
          ))}
        </Select>
      </Card>

      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          {comments &&
            comments.map((comment) => (
              <Comment key={comment._id} comment={comment} profile />
            ))}

          <Row justify="center" style={{ padding: "20px 0" }}>
            <Col>
              <Typography.Text>
                {comments.length > 0 ? (
                  <>All comments have been viewed</>
                ) : (
                  <>No comments available</>
                )}
              </Typography.Text>
            </Col>
            <Col>
              <Button type="link" onClick={handleBackToTop}>
                Back to top
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default CommentBrowser;
