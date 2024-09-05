import React from "react";

const Footer = () => {
  return (
    <div class="py-3 bg-white footer-copyright">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <span class="me-3 small">
              ©2023 Designed and Developed by
              <b class="text-primary"> Dhruv Verma </b>. All rights reserved
            </span>
          </div>
          <div class="col-md-4 text-end">
            <a
              target="_blank"
              href="#"
              class="btn social-btn btn-sm text-decoration-none"
            >
              <i class="icofont-facebook"></i>
            </a>
            <a
              target="_blank"
              href="#"
              class="btn social-btn btn-sm text-decoration-none"
            >
              <i class="icofont-twitter"></i>
            </a>
            <a
              target="_blank"
              href="#"
              class="btn social-btn btn-sm text-decoration-none"
            >
              <i class="icofont-linkedin"></i>
            </a>
            <a
              target="_blank"
              href="#"
              class="btn social-btn btn-sm text-decoration-none"
            >
              <i class="icofont-youtube-play"></i>
            </a>
            <a
              target="_blank"
              href="#"
              class="btn social-btn btn-sm text-decoration-none"
            >
              <i class="icofont-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
