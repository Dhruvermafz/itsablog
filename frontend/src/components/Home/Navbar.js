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
  const [showAddBlogModal, setShowAddBlogModal] = useState(false); // placeholder if you have this modal too

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
    console.log("Search submitted:", search);
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
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="addBlog">Add Blog</Menu.Item>
      <Menu.Item key="addReview">Add Book Review</Menu.Item>
    </Menu>
  );

  return (
    <header>
      <div style={{ marginBottom: 16 }}>
        <Row align="middle" justify="space-between" style={{ paddingTop: 16 }}>
          {/* Logo */}
          <Col>
            <div className="banner">
              {!mobile && (
                <Typography.Title
                  level={navbarWidth ? 5 : 3}
                  style={{ margin: 0 }}
                >
                  <img
                    src={icon}
                    alt="icon"
                    style={{ height: 32, marginRight: 8 }}
                  />
                  <strong>ItsABlog</strong>
                </Typography.Title>
              )}
            </div>
          </Col>

          {/* Desktop Search */}
          <Col>
            {!navbarWidth && (
              <form onSubmit={handleSubmit} style={{ display: "inline-block" }}>
                <Input
                  size="middle"
                  placeholder="Search"
                  value={search}
                  onChange={handleChange}
                  style={{ maxWidth: 300 }}
                />
              </form>
            )}
          </Col>

          {/* Add Dropdown */}
          <Col>
            {user && (
              <Dropdown overlay={addMenu} trigger={["click"]}>
                <Button>
                  Add <DownOutlined />
                </Button>
              </Dropdown>
            )}
          </Col>

          {/* Right Icons / Actions */}
          <Col>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {mobile && (
                <Button
                  type="text"
                  icon={<AiOutlineSearch />}
                  onClick={handleSearchIcon}
                />
              )}

              <Button
                type="text"
                icon={<AiFillHome />}
                onClick={() => console.log("Go Home")}
              />

              {user ? (
                <>
                  <Button
                    type="text"
                    icon={<AiFillMessage />}
                    onClick={() => console.log("Open Messenger")}
                  />
                  <Popover
                    content={<NavLinks />}
                    trigger="click"
                    placement="bottomRight"
                  >
                    <div style={{ cursor: "pointer" }}>
                      <UserAvatar
                        width={30}
                        height={30}
                        username={user.username}
                      />
                    </div>
                  </Popover>
                </>
              ) : (
                <>
                  <Button onClick={() => console.log("Sign Up modal")}>
                    Sign Up
                  </Button>
                  <Button onClick={() => console.log("Login modal")}>
                    Login
                  </Button>
                </>
              )}
            </div>
          </Col>
        </Row>

        {/* Mobile Search Input */}
        {navbarWidth && searchIcon && (
          <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <Input
              size="middle"
              placeholder="Search"
              value={search}
              onChange={handleChange}
            />
          </form>
        )}
      </div>

      {/* Modals */}
      <AddBookReviewModal
        visible={showBookReviewModal}
        onClose={() => setShowBookReviewModal(false)}
      />

      {/* Optional if you have an AddBlogModal */}
      {/* <AddBlogModal
        visible={showAddBlogModal}
        onClose={() => setShowAddBlogModal(false)}
      /> */}
    </header>
  );
};

export default Navbar;
