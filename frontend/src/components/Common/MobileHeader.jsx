import React from "react";
import logo from "../../assets/img/logo.png";
const MobileHeader = () => {
  return (
    <div class="web-none d-flex align-items-center px-3 pt-3">
      <a href="index.html" class="text-decoration-none">
        <img src={logo} class="img-fluid logo-mobile" alt="brand-logo" />
      </a>
      <button
        class="ms-auto btn btn-primary ln-0"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        aria-controls="offcanvasExample"
      >
        <span class="material-icons">menu</span>
      </button>
    </div>
  );
};

export default MobileHeader;
