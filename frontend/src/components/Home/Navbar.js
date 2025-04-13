import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AiFillHome, AiFillMessage, AiOutlineSearch } from "react-icons/ai";
import { Input, Typography, Button, Popover, Row, Col } from "antd";
import UserAvatar from "../UserModal/UserAvatar";
import { routes } from "../../router/routes";
import NavLinks from "./NavLinks";
import "../../css/navbar.css";
import icon from "../../static/img/icon.png";
import { isLoggedIn } from "../../helpers/authHelper";

const Navbar = () => {
  const navigate = useNavigate();
  const user = isLoggedIn();
  const [search, setSearch] = useState("");
  const [searchIcon, setSearchIcon] = useState(false);
  const [width, setWindowWidth] = useState(window.innerWidth);

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
    navigate(`${routes.SEARCH}?` + new URLSearchParams({ search }));
  };

  const handleSearchIcon = () => {
    setSearchIcon(!searchIcon);
  };

  return (
    <header>
      <div style={{ marginBottom: 16 }}>
        <Row
          align="middle"
          justify="space-between"
          style={{ paddingTop: 16, paddingBottom: 0 }}
        >
          <Col>
            <div className="banner">
              {!mobile && (
                <Typography.Title
                  level={navbarWidth ? 5 : 3}
                  style={{ margin: 0 }}
                >
                  <NavLink
                    to="/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <img
                      src={icon}
                      alt="icon"
                      style={{ height: 32, marginRight: 8 }}
                    />
                    <strong>ItsABlog</strong>
                  </NavLink>
                </Typography.Title>
              )}
            </div>
          </Col>

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
                onClick={() => navigate("/")}
              />

              {user ? (
                <>
                  <Button
                    type="text"
                    icon={<AiFillMessage />}
                    onClick={() => navigate(routes.MESSANGER)}
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
                  <Button type="link" href={routes.SIGNUP}>
                    Sign Up
                  </Button>
                  <Button type="link" href={routes.LOGIN}>
                    Login
                  </Button>
                </>
              )}
            </div>
          </Col>
        </Row>

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
    </header>
  );
};

export default Navbar;
