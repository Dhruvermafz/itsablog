import React from "react";

const PostTab = () => {
  return (
    <div
      class="input-group mb-4 shadow-sm rounded-4 overflow-hidden py-2 bg-white"
      data-bs-toggle="modal"
      data-bs-target="#postModal"
    >
      <span class="input-group-text material-icons border-0 bg-white text-primary">
        account_circle
      </span>
      <input
        type="text"
        class="form-control border-0 fw-light ps-1"
        placeholder="What's on your mind."
      />
      <a
        href="#"
        class="text-decoration-none input-group-text bg-white border-0 material-icons text-primary"
      >
        add_circle
      </a>
    </div>
  );
};

export default PostTab;
