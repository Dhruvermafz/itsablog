import {
  Button,
  Card,
  Stack,
  Typography,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPosts, getUserLikedPosts } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import CreatePost from "../Post/CreatePost";
import PostCard from "./PostCard";
import SortBySelect from "../Content/SortBySelect";
import HorizontalStack from "../util/HorizontalStack";

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

  const handlePageChange = (event, value) => {
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
      <Stack spacing={2}>
        <Card>
          <HorizontalStack justifyContent="space-between">
            {props.createPost && <CreatePost />}
            <SortBySelect
              onSortBy={handleSortBy}
              sortBy={sortBy}
              sorts={sorts}
            />
          </HorizontalStack>
        </Card>

        {searchExists && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Showing results for "{search.get("search")}"
            </Typography>
            <Typography color="text.secondary" variant="span">
              {count} results found
            </Typography>
          </Box>
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
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}

        {!loading && posts.length === 0 && (
          <Stack py={5} alignItems="center">
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No posts available
            </Typography>
            <Button variant="text" size="small" onClick={handleBackToTop}>
              Back to top
            </Button>
          </Stack>
        )}

        {totalPages > 1 && (
          <Stack pt={2} pb={6} alignItems="center" spacing={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
            <Button variant="text" size="small" onClick={handleBackToTop}>
              Back to top
            </Button>
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default PostBrowser;
