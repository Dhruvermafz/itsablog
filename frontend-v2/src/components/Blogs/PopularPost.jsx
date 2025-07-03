import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb, Row, Col, Pagination, Spin, Typography } from "antd";
import BlogPostCard from "./BlogPostCard"; // Reuse from BlogList
import AuthorWidget from "./AuthorWidget"; // Reuse from BlogList

import InstagramWidget from "./InstagramWidget"; // Reuse from BlogList
import "./popularpost.css";

const { Title } = Typography;

const PopularPosts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const pageSize = 8; // Number of posts per page

  // Mock data for popular posts (replace with API call)
  const mockPosts = [
    {
      id: 1,
      category: "Health",
      categoryColor: "blue",
      title: "Helpful Tips for Working from Home as a Freelancer",
      link: "/single",
      image: "/images/news-13.jpg",
      date: "7 August",
      readTime: "11 mins read",
      views: "3k views",
      isFeatured: true,
    },
    {
      id: 2,
      category: "Cooking",
      categoryColor: "green",
      title: "10 Easy Ways to Be Environmentally Conscious At Home",
      link: "/single",
      image: "/images/news-4.jpg",
      date: "27 Sep",
      readTime: "10 mins read",
      views: "22k views",
    },
    {
      id: 3,
      category: "Technology",
      categoryColor: "warning",
      title: "My Favorite Comfies to Lounge in At Home",
      link: "/single",
      image: "/images/news-2.jpg",
      date: "7 August",
      readTime: "9 mins read",
      views: "12k views",
    },
    {
      id: 4,
      category: "Travel",
      categoryColor: "red",
      title: "How to Give Your Space a Parisian-Inspired Makeover",
      link: "/single",
      image: "/images/news-6.jpg",
      date: "27 August",
      readTime: "12 mins read",
      views: "23k views",
    },
    // Add more posts as needed
  ];

  const popularPosts = [
    {
      id: 1,
      title: "Spending Some Quality Time with Kids? It’s Possible",
      link: "/single",
      image: "/images/thumb-6.jpg",
      date: "05 August",
      views: "150 views",
    },
    {
      id: 2,
      title: "Relationship Podcasts are Having “That” Talk",
      link: "/single",
      image: "/images/thumb-7.jpg",
      date: "12 August",
      views: "6k views",
    },
    // Add more popular posts
  ];

  const instagramImages = [
    { src: "/images/thumb-1.jpg", link: "/assets/imgs/thumbnail-3.jpg" },
    { src: "/images/thumb-2.jpg", link: "/assets/imgs/thumbnail-4.jpg" },
    // Add more images
  ];

  // Fetch popular posts for the current page (mock API call)
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Sort posts by views (assuming views are in format "Xk views")
      const sortedPosts = [...mockPosts].sort((a, b) => {
        const viewsA = parseInt(a.views.replace("k", "000"));
        const viewsB = parseInt(b.views.replace("k", "000"));
        return viewsB - viewsA;
      });
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setPosts(sortedPosts.slice(startIndex, endIndex));
      setTotalPosts(sortedPosts.length);
      setLoading(false);
    }, 500); // Simulate network delay
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Update URL for SEO (e.g., /popular-posts?page=2)
    navigate(`/popular-posts?page=${page}`);
  };

  return (
    <div className="popular-posts-page">
      <div className="archive-header">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
              >
                Home
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Popular Posts</Breadcrumb.Item>
          </Breadcrumb>
          <Title level={2}>Popular Posts</Title>
          <div className="border-line"></div>
        </div>
      </div>
      <div className="container">
        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <div className="post-list">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))
                ) : (
                  <p>No popular posts found.</p>
                )}
              </div>
              <Pagination
                current={currentPage}
                total={totalPosts}
                pageSize={pageSize}
                onChange={handlePageChange}
                className="pagination"
                showSizeChanger={false}
              />
            </Col>
            <Col xs={24} lg={8}>
              <div className="widget-area">
                <AuthorWidget />
                {/* <PopularPostsWidget posts={popularPosts} /> */}
                <InstagramWidget images={instagramImages} />
              </div>
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  );
};

export default PopularPosts;
