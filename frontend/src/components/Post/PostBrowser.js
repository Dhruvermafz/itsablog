import React, { useEffect, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button, Card, Pagination, Typography, Spin, Row, Col } from "antd";
import { useSearchParams } from "react-router-dom";
import { getPosts, getUserLikedPosts } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import CreatePost from "../Post/CreatePost";
import PostCard from "./PostCard";
import SortBySelect from "../Content/SortBySelect";
import HorizontalStack from "../util/HorizontalStack";

const { Title, Text } = Typography;

const PostBrowser = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [count, setCount] = useState(0);
  const user = isLoggedIn();

  const [search] = useSearchParams();
  const searchExists =
    search && search.get("search") && search.get("search").length > 0;

  const fetchPosts = async (newPage = 1) => {
    setLoading(true);
    setPage(newPage);

    let query = {
      page: newPage,
      sortBy,
    };

    let data;

    if (props.contentType === "posts") {
      if (props.profileUser) query.author = props.profileUser.username;
      if (searchExists) query.search = search.get("search");

      data = await getPosts(user && user.token, query);
    } else if (props.contentType === "liked") {
      data = await getUserLikedPosts(
        props.profileUser._id,
        user && user.token,
        query
      );
    }

    setLoading(false);
    if (!data.error) {
      setPosts(data.data);
      setCount(data.count);
      setTotalPages(Math.ceil(data.count / 10));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy, search]);

  const handleSortBy = (e) => {
    const newSortName = e.target.value;
    let newSortBy;

    Object.keys(sorts).forEach((sortName) => {
      if (sorts[sortName] === newSortName) newSortBy = sortName;
    });

    setSortBy(newSortBy);
  };

  const handlePageChange = (value) => {
    fetchPosts(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removePost = (removedPost) => {
    setPosts(posts.filter((post) => post._id !== removedPost._id));
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

  const sorts = contentTypeSorts[props.contentType];

  return (
    <>
      <Card>
        <HorizontalStack justifyContent="space-between">
          {props.createPost && <CreatePost />}
          <SortBySelect onSortBy={handleSortBy} sortBy={sortBy} sorts={sorts} />
        </HorizontalStack>
      </Card>

      {searchExists && (
        <div style={{ marginBottom: "20px" }}>
          <Title level={5}>Showing results for "{search.get("search")}"</Title>
          <Text type="secondary">{count} results found</Text>
        </div>
      )}

      {posts.map((post) => (
        <PostCard
          preview="primary"
          key={post._id}
          post={post}
          removePost={removePost}
        />
      ))}

      {loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin />
        </div>
      )}

      {!loading && posts.length === 0 && (
        <Row justify="center" style={{ padding: "20px 0" }}>
          <Col>
            <Title level={4} type="secondary">
              No posts available
            </Title>
            <Button type="link" size="small" onClick={handleBackToTop}>
              Back to top
            </Button>
          </Col>
        </Row>
      )}

      {totalPages > 1 && (
        <Row justify="center" style={{ paddingTop: "20px" }}>
          <Col>
            <Pagination
              current={page}
              total={totalPages * 10}
              onChange={handlePageChange}
              pageSize={10}
              showSizeChanger={false}
            />
            <Button type="link" size="small" onClick={handleBackToTop}>
              Back to top
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default PostBrowser;
