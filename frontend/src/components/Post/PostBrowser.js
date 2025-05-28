import React, { useEffect, useState } from "react";
import { Button, Card, Pagination, Typography, Spin, Row, Col } from "antd";
import { useSearchParams } from "react-router-dom";
import { getPosts, getUserLikedPosts } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import CreatePost from "../Post/CreatePost";
import PostCard from "./PostCard";
import SortBySelect from "../Content/SortBySelect";
import HorizontalStack from "../util/HorizontalStack";

const { Title, Text } = Typography;

const PostBrowser = ({ contentType, createPost, profileUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [count, setCount] = useState(0);
  const user = isLoggedIn();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const searchExists = searchQuery && searchQuery.length > 0;

  const fetchPosts = async (newPage = 1) => {
    setLoading(true);
    setPage(newPage);

    const query = {
      page: newPage,
      sortBy,
      ...(profileUser && { author: profileUser.username }),
      ...(searchExists && { search: searchQuery }),
    };

    try {
      let data;
      if (contentType === "posts") {
        data = await getPosts(user?.token, query);
      } else if (contentType === "liked") {
        data = await getUserLikedPosts(profileUser._id, user?.token, query);
      }

      if (!data.error) {
        setPosts(data.data);
        setCount(data.count);
        setTotalPages(Math.ceil(data.count / 10));
      } else {
        setPosts([]);
        setCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy, searchParams, profileUser, contentType]);

  const handleSortBy = (value) => {
    setSortBy(value);
  };

  const handlePageChange = (value) => {
    fetchPosts(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removePost = (removedPost) => {
    setPosts(posts.filter((post) => post._id !== removedPost._id));
    setCount((prev) => prev - 1);
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const contentTypeSorts = {
    posts: {
      "-createdAt": "Latest",
      "-likeCount": "Likes",
      "-commentCount": "Comments",
      createdAt: "Earliest",
    },
    liked: {
      "-createdAt": "Latest",
      createdAt: "Earliest",
    },
  };

  const sorts = contentTypeSorts[contentType] || contentTypeSorts.posts;

  return (
    <div className="post-browser">
      <Card className="control-card">
        <HorizontalStack justifyContent="space-between" className="controls">
          {createPost && <CreatePost />}
          <SortBySelect
            onSortBy={handleSortBy}
            sortBy={sortBy}
            sorts={sorts}
            className="sort-select"
          />
        </HorizontalStack>
      </Card>

      {searchExists && (
        <div className="search-results">
          <Title level={5}>Showing results for "{searchQuery}"</Title>
          <Text type="secondary">{count} results found</Text>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      )}

      {!loading && posts.length === 0 && (
        <Row justify="center" className="no-posts">
          <Col>
            <Title level={4} type="secondary">
              No posts available
            </Title>
            <Button type="link" onClick={handleBackToTop}>
              Back to top
            </Button>
          </Col>
        </Row>
      )}

      <div className="posts-grid">
        {posts.map((post) => (
          <PostCard
            preview="primary"
            key={post._id}
            post={post}
            removePost={removePost}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Row justify="center" className="pagination">
          <Col>
            <Pagination
              current={page}
              total={count}
              onChange={handlePageChange}
              pageSize={10}
              showSizeChanger={false}
              showLessItems
            />
            <Button type="link" onClick={handleBackToTop}>
              Back to top
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default PostBrowser;
