import React from "react";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import "../../css/footer.css";

const getCurrentYear = () => new Date().getFullYear();

const Footer = () => {
  const currentYear = getCurrentYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <Typography.Text style={{ display: "block", marginBottom: "8px" }}>
          © ItsABlog {currentYear}. All rights reserved.
        </Typography.Text>
        <Typography.Text type="secondary">
          <Link to="/terms-and-conditions">Terms of Use</Link> &nbsp;|&nbsp;
          <Link to="/privacy">Privacy Policy</Link> &nbsp;|&nbsp;
          <Link to="/license">License</Link>
        </Typography.Text>
      </div>
    </footer>
  );
};

export default Footer;
