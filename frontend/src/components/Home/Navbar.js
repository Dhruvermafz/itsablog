import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillHome, AiFillMessage, AiOutlineSearch } from "react-icons/ai";
import {
  Box,
  Popover,
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import UserAvatar from "../UserModal/UserAvatar";
import { routes } from "../../router/routes";
import NavLinks from "./NavLinks";
import "../../css/navbar.css";
import { useTheme } from "@emotion/react";
import icon from "../../static/img/icon.png";
import { isLoggedIn } from "../../helpers/authHelper";
const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const user = isLoggedIn();
  const username = user && isLoggedIn().username;
  const [search, setSearch] = useState("");
  const [searchIcon, setSearchIcon] = useState(false);
  const [width, setWindowWidth] = useState(0);
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState(null);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const mobile = width < 500;
  const navbarWidth = width < 600;

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

  const handleAvatarClick = (e) => {
    setAvatarMenuAnchor(e.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setAvatarMenuAnchor(null);
  };

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
      <Stack mb={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          pt={2}
          pb={0}
          spacing={!mobile ? 2 : 0}
        >
          <div className="banner">
            <Typography
              display={mobile ? "none" : "block"}
              variant={navbarWidth ? "h6" : "h4"}
              mr={1}
              color={theme.palette.primary.main}
            >
              <Link to="/" color="inherit">
                <img src={icon} alt={icon} />
                <strong>ItsABlog</strong>
              </Link>
            </Typography>
          </div>

          {!navbarWidth && (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                size="small"
                label="Search"
                sx={{ flexGrow: 1, maxWidth: 300 }}
                onChange={handleChange}
                value={search}
              />
            </Box>
          )}

          <div>
            {mobile && (
              <IconButton onClick={handleSearchIcon}>
                <AiOutlineSearch />
              </IconButton>
            )}

            <IconButton component={Link} to={"/"}>
              <AiFillHome />
            </IconButton>

            {user ? (
              <>
                <IconButton component={Link} to={`${routes.MESSANGER}`}>
                  <AiFillMessage />
                </IconButton>
                <IconButton onClick={handleAvatarClick} sx={{ padding: 0 }}>
                  <UserAvatar width={30} height={30} username={user.username} />
                </IconButton>
                <Popover
                  open={Boolean(avatarMenuAnchor)}
                  anchorEl={avatarMenuAnchor}
                  onClose={handleAvatarMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <NavLinks />
                </Popover>
              </>
            ) : (
              <>
                <Button
                  variant="text"
                  sx={{ minWidth: 80 }}
                  href={`${routes.SIGNUP}`}
                >
                  Sign Up
                </Button>
                <Button
                  variant="text"
                  sx={{ minWidth: 65 }}
                  href={`${routes.LOGIN}`}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </Stack>

        {navbarWidth && searchIcon && (
          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <TextField
              size="small"
              label="Search"
              fullWidth
              onChange={handleChange}
              value={search}
            />
          </Box>
        )}
      </Stack>
    </header>
  );
};

export default Navbar;
