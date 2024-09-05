import React from "react";
import error from "../assets/img/404.svg";
const Error404 = () => {
  return (
    <div class="p-5 text-center">
      <img src={error} class="img-fluid col-md-4" alt="osahan" />
      <div class="text-center pb-5">
        <h2 class="fw-bold text-black mt-4">Oh no! Where did you go?</h2>
        <p class="mb-4">We can’t seem to find the page you were looking for.</p>
        <a href="/" class="btn btn-primary rounded-pill py-3 px-4 shadow-sm">
          <span class="px-3"> Go back to safety </span>
        </a>
      </div>
    </div>
  );
};

export default Error404;
