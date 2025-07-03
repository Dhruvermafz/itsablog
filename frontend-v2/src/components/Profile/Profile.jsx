import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb, Row, Col, Spin, Typography, message } from "antd";
import BlogPostCard from "../Blogs/BlogPostCard";
import AuthorWidget from "../Blogs/AuthorWidget";
import PopularPostsPage from "../Blogs/PopularPost";
import InstagramWidget from "../Blogs/InstagramWidget";
import LastCommentsWidget from "../Extras/LastCommentsWidget";
import Pagination from "../Extras/Pagination";
import { useGetProfileQuery } from "../../api/userApi"; // Import the actual hook

const { Title } = Typography;

const Profile = () => {
  const { userId } = useParams(); // Get userId from URL (e.g., /profile/:userId)
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Fetch profile data using useGetProfileQuery from userApi
  const { data, isLoading, error } = useGetProfileQuery({
    userId,
    page: currentPage,
    pageSize,
  });

  useEffect(() => {
    if (error) {
      message.error("Failed to load profile data.");
    }
  }, [error]);

  const handlePageChange = (page, newPageSize) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  // Mock data for sidebar widgets (replace with API data if available)
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
  ];

  const instagramImages = [
    { src: "/images/thumb-1.jpg", link: "/assets/imgs/thumbnail-3.jpg" },
    { src: "/images/thumb-2.jpg", link: "/assets/imgs/thumbnail-4.jpg" },
  ];

  const lastComments = [
    {
      id: 1,
      authorId: "david",
      authorName: "David",
      avatar: "/images/author-2.jpg",
      date: "16 Jan 2020",
      content: "A writer is someone for whom writing is more difficult than...",
    },
    {
      id: 2,
      authorId: "kokawa",
      authorName: "Kokawa",
      avatar: "/images/author-3.jpg",
      date: "12 Feb 2020",
      content: "Striking pewter studded epaulettes silver zips",
    },
    {
      id: 3,
      authorId: "tsukasi",
      authorName: "Tsukasi",
      avatar: "/images/thumb-1.jpg",
      date: "18 May 2020",
      content: "Workwear bow detailing a slingback buckle strap",
    },
  ];

  return (
    <div className="profile-page">
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
            <Breadcrumb.Item>Profile</Breadcrumb.Item>
            <Breadcrumb.Item>{data?.user?.name || "User"}</Breadcrumb.Item>
          </Breadcrumb>
          <Title level={2}>{data?.user?.name || "Profile"}</Title>
          <div className="border-line"></div>
        </div>
      </div>
      <div className="container">
        <Spin spinning={isLoading}>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              {data?.user && (
                <AuthorWidget
                  user={{
                    name: data.user.name,
                    avatar: data.user.avatar,
                    bio: data.user.bio,
                    socialLinks: data.user.socialLinks,
                  }}
                />
              )}
            </Col>
            <Col xs={24} lg={16}>
              <div className="post-list">
                <Title level={5}>Posted by {data?.user?.name || "User"}</Title>
                {data?.posts?.length > 0 ? (
                  data.posts.map((post) => (
                    <BlogPostCard
                      key={post.id}
                      post={{
                        ...post,
                        category: Array.isArray(post.category)
                          ? post.category
                          : [post.category],
                        categoryColor: Array.isArray(post.categoryColor)
                          ? post.categoryColor
                          : [post.categoryColor],
                      }}
                    />
                  ))
                ) : (
                  <p>No posts found.</p>
                )}
                <Pagination
                  totalItems={data?.totalPosts || 0}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  pageSizeOptions={[8, 16, 24]}
                  onPageChange={handlePageChange}
                  showSizeChanger={true}
                  showQuickJumper={false}
                  showTotal={(total) => `Total ${total} posts`}
                />
              </div>
            </Col>
            <Col xs={24} lg={8}>
              <div className="widget-area">
                {/* <PopularPostsWidget posts={popularPosts} /> */}
                <LastCommentsWidget comments={lastComments} />
                <InstagramWidget images={instagramImages} />
              </div>
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  );
};

export default Profile;
