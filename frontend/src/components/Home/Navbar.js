import React, { useEffect, useState } from "react";
import { AiFillHome, AiFillMessage, AiOutlineSearch } from "react-icons/ai";
import {
  Input,
  Typography,
  Button,
  Popover,
  Row,
  Col,
  Menu,
  Dropdown,
  Modal,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../UserModal/UserAvatar";
import NavLinks from "./NavLinks";
import icon from "../../static/img/icon.png";
import "../../css/navbar.css";
import AddBookReviewModal from "../Books/AddBookReviews";
import { isLoggedIn } from "../../helpers/authHelper";

const Navbar = () => {
  const user = isLoggedIn();
  const [search, setSearch] = useState("");
  const [searchIcon, setSearchIcon] = useState(false);
  const [width, setWindowWidth] = useState(window.innerWidth);
  const [showBookReviewModal, setShowBookReviewModal] = useState(false);
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateDimensions = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const mobile = width < 500;
  const navbarWidth = width < 600;

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setSearch("");
      setSearchIcon(false);
    }
  };

  const handleSearchIcon = () => {
    setSearchIcon(!searchIcon);
  };

  const handleMenuClick = ({ key }) => {
    if (key === "addBlog") {
      setShowAddBlogModal(true);
    } else if (key === "addReview") {
      setShowBookReviewModal(true);
    }
  };

  const addMenu = (
    <Menu onClick={handleMenuClick} className="add-menu">
      <Menu.Item key="addBlog" icon={<AiFillHome />}>
        Add Blog
      </Menu.Item>
      <Menu.Item key="addReview" icon={<AiFillHome />}>
        Add Book Review
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="navbar">
      <Row align="middle" justify="space-between" className="navbar-container">
        {/* Logo */}
        <Col>
          <div
            className="banner"
            onClick={() => navigate("/")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/")}
          >
            <Typography.Title
              level={navbarWidth ? 5 : 3}
              className="banner-title"
            >
              <img src={icon} alt="ItsABlog Logo" className="banner-logo" />
              {!mobile && <strong>ItsABlog</strong>}
            </Typography.Title>
          </div>
        </Col>

        {/* Desktop Search */}
        <Col flex={navbarWidth ? "none" : "auto"}>
          {!navbarWidth && (
            <form onSubmit={handleSubmit} className="search-form">
              <Input
                size="middle"
                placeholder="Search blogs or reviews..."
                value={search}
                onChange={handleChange}
                prefix={<AiOutlineSearch />}
                aria-label="Search blogs or reviews"
                className="search-input"
              />
            </form>
          )}
        </Col>

        {/* Right Actions */}
        <Col>
          <div className="navbar-actions">
            {mobile && (
              <Button
                type="text"
                icon={<AiOutlineSearch />}
                onClick={handleSearchIcon}
                aria-label="Toggle search"
                className="search-toggle"
              />
            )}

            {user ? (
              <>
                <Button
                  type="text"
                  icon={<AiFillMessage />}
                  onClick={() => navigate("/messenger")}
                  aria-label="Open messenger"
                  className="messenger-btn"
                />
                {user && (
                  <Dropdown
                    overlay={addMenu}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <Button aria-label="Add content options">
                      Add <DownOutlined />
                    </Button>
                  </Dropdown>
                )}
                <Popover
                  content={<NavLinks />}
                  trigger="click"
                  placement="bottomRight"
                  overlayClassName="user-menu"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    className="user-avatar"
                    aria-label={`User menu for ${user.username}`}
                  >
                    <UserAvatar
                      width={32}
                      height={32}
                      username={user.username}
                    />
                  </div>
                </Popover>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/signup")}
                  className="action-btn"
                >
                  Sign Up
                </Button>
                <Button
                  type="primary"
                  onClick={() => navigate("/login")}
                  className="action-btn"
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </Col>
      </Row>

      {/* Mobile Search Input */}
      {navbarWidth && searchIcon && (
        <form onSubmit={handleSubmit} className="mobile-search-form">
          <Input
            size="middle"
            placeholder="Search blogs or reviews..."
            value={search}
            onChange={handleChange}
            prefix={<AiOutlineSearch />}
            aria-label="Search blogs or reviews"
            className="search-input"
          />
        </form>
      )}

      {/* Modals */}
      <AddBookReviewModal
        open={showBookReviewModal}
        onCancel={() => setShowBookReviewModal(false)}
      />
      {/* <AddBlogModal
        open={showAddBlogModal}
        onCancel={() => setShowAddBlogModal(false)}
      /> */}
    </header>
  );
};

export default Navbar;
