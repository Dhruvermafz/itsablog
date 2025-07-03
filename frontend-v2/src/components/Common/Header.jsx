import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Button, Input, Dropdown, Avatar, Modal, message } from "antd";
import {
  HomeOutlined,
  SearchOutlined,
  FacebookOutlined,
  TwitterOutlined,
  PinterestOutlined,
  MenuOutlined,
  PlusOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useGetProfileQuery, useLogoutMutation } from "../../api/userApi"; // Import hooks

const Header = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showBookReviewModal, setShowBookReviewModal] = useState(false);
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);

  // Get authentication state from localStorage
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const isAuthenticated = !!userId && !!token;

  // Fetch user profile if authenticated
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetProfileQuery(
    { userId, page: 1, pageSize: 8 },
    { skip: !isAuthenticated || !userId }
  );

  // Use logout mutation
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (userError) {
      console.error("Failed to load user profile:", userError);
      // Optionally clear auth state and redirect to login if token is invalid
      if (userError?.status === 401) {
        handleLogout();
        message.error("Session expired. Please log in again.");
      }
    }
  }, [userError]);

  const isMobile = windowWidth < 500;
  const isNavbarCompact = windowWidth < 600;

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSearchSubmit = (value) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
      setSearch("");
      setSearchVisible(false);
    }
  };

  const toggleSearch = () => setSearchVisible(!searchVisible);

  const handleLogout = async () => {
    try {
      await logout().unwrap(); // Call the logout API
      localStorage.removeItem("userId"); // Clear userId
      localStorage.removeItem("token"); // Clear token
      message.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      message.error("Failed to log out. Please try again.");
    }
  };

  const handleMenuClick = ({ key }) => {
    if (key === "addBlog") {
      setShowAddBlogModal(true);
    } else if (key === "addReview") {
      setShowBookReviewModal(true);
    } else if (key === "profile") {
      navigate(`/profile/${userId}`);
    } else if (key === "logout") {
      handleLogout();
    }
  };

  const menuItems = [
    { key: "home", label: "Home", link: "/" },
    { key: "about", label: "About", link: "/page-about" },
    { key: "contact", label: "Contact", link: "/page-contact" },
    { key: "list", label: "List layout", link: "/category-list" },
    {
      key: "category",
      label: "Category",
      children: [
        { key: "destinations", label: "Destinations", link: "/category-list" },
        { key: "tour-guides", label: "Tour Guides", link: "/category-list" },
        { key: "travel-food", label: "Travel Food", link: "/category-list" },
        {
          key: "hotels-booking",
          label: "Hotels Booking",
          link: "/category-list",
        },
        {
          key: "transport-review",
          label: "Transport Review",
          link: "/category-list",
        },
        {
          key: "travel-healthy",
          label: "Travel Healthy",
          link: "/category-list",
        },
      ],
    },
  ];

  const addMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="addBlog" icon={<PlusOutlined />}>
        Add Blog
      </Menu.Item>
      <Menu.Item key="addReview" icon={<PlusOutlined />}>
        Add Book Review
      </Menu.Item>
    </Menu>
  );

  const profileMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const suggestedKeywords = [
    "World",
    "American",
    "Opinion",
    "Tech",
    "Science",
    "Books",
    "Travel",
    "Business",
  ];

  const suggestedContent = [
    {
      category: "Travel Tips",
      image: "/images/thumb-2.jpg",
      link: "/category.html",
    },
    {
      category: "Lifestyle",
      image: "/images/thumb-4.jpg",
      link: "/category.html",
    },
    {
      category: "Hotel Review",
      image: "/images/thumb-3.jpg",
      link: "/category.html",
    },
  ];

  return (
    <header className="main-header header-style-1 font-heading">
      <div className="header-top">
        <div className="container">
          <div className="row pt-20 pb-20 align-items-center">
            <div className="col-md-3 col-xs-6">
              <a href="/index">
                <img className="logo" src="/images/logo.png" alt="Logo" />
              </a>
            </div>
            <div className="col-md-9 col-xs-6 text-right header-top-right">
              {isAuthenticated && userData?.user ? (
                <>
                  <Button
                    type="text"
                    icon={<SearchOutlined />}
                    onClick={toggleSearch}
                    className="search-icon d-none d-md-inline"
                  >
                    Search
                  </Button>
                  <Dropdown overlay={addMenu} trigger={["click"]}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      className="mr-10"
                    >
                      Add
                    </Button>
                  </Dropdown>
                  <Dropdown overlay={profileMenu} trigger={["click"]}>
                    <Avatar
                      src={userData.user.avatar}
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#1890ff", cursor: "pointer" }}
                    />
                  </Dropdown>
                </>
              ) : (
                <>
                  <Button
                    type="text"
                    icon={<SearchOutlined />}
                    onClick={toggleSearch}
                    className="search-icon d-none d-md-inline"
                  >
                    Search
                  </Button>
                  <Button type="link" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button type="primary" onClick={() => navigate("/signup")}>
                    SignUp
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="header-sticky">
        <div className="container position-relative">
          <div className="mobile_menu d-lg-none d-block">
            <Button type="text" icon={<MenuOutlined />} />
          </div>
          <div className="main-nav d-none d-lg-block float-left">
            <Menu
              mode="horizontal"
              items={menuItems}
              className="main-menu font-small"
              onClick={({ key }) => {
                const item =
                  menuItems.find((i) => i.key === key) ||
                  menuItems
                    .flatMap((i) => i.children || [])
                    .find((i) => i.key === key);
                if (item?.link) navigate(item.link);
              }}
            />
          </div>
          <div className="float-right header-tools">
            <ul className="header-social-network list-inline mr-15">
              <li className="list-inline-item">
                <a
                  className="social-icon"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookOutlined />
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  className="social-icon"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterOutlined />
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  className="social-icon"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PinterestOutlined />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Modal
        title={<span className="search-text-bg">Search</span>}
        open={searchVisible}
        onCancel={toggleSearch}
        footer={null}
        centered
        width={isMobile ? "90%" : 800}
      >
        <div style={{ padding: "20px 0" }}>
          <Input.Search
            placeholder="Search stories, places and people"
            value={search}
            onChange={handleSearchChange}
            onSearch={handleSearchSubmit}
            enterButton={<Button icon={<SearchOutlined />} />}
            size="large"
          />
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <h5 className="suggested font-heading mb-20 text-muted">
              <strong>Suggested keywords:</strong>
            </h5>
            <ul className="list-inline d-inline-block">
              {suggestedKeywords.map((keyword) => (
                <li key={keyword} className="list-inline-item">
                  <a href="/category.html">{keyword}</a>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ marginTop: 40 }}>
            <div className="row">
              {suggestedContent.map((item, index) => (
                <div
                  key={index}
                  className={`col-lg-4 ${
                    isMobile ? "col-12" : "col-md-6"
                  } mb-30`}
                >
                  <div className="d-flex bg-grey has-border p-25 hover-up-2 transition-normal border-radius-5">
                    <div className="post-thumb post-thumb-64 d-flex mr-15 border-radius-5 img-hover-scale overflow-hidden">
                      <a className="color-white" href={item.link}>
                        <img src={item.image} alt={item.category} />
                      </a>
                    </div>
                    <div className="post-content media-body">
                      <h6>
                        <a href={item.link}>{item.category}</a>
                      </h6>
                      <p className="text-muted font-small">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      {/* Add your modal components for Add Blog and Add Book Review here */}
    </header>
  );
};

export default Header;
