import React from "react";

const TopBar = () => {
  return (
    <ul
      class="top-osahan-nav-tab nav nav-pills justify-content-center nav-justified mb-4 shadow-sm rounded-4 overflow-hidden bg-white sticky-sidebar2"
      id="pills-tab"
      role="tablist"
    >
      <li class="nav-item" role="presentation">
        <button
          class="p-3 nav-link text-muted active"
          id="pills-feed-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-feed"
          type="button"
          role="tab"
          aria-controls="pills-feed"
          aria-selected="true"
        >
          Feed
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="p-3 nav-link text-muted"
          id="pills-people-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-people"
          type="button"
          role="tab"
          aria-controls="pills-people"
          aria-selected="false"
        >
          People
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="p-3 nav-link text-muted"
          id="pills-trending-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-trending"
          type="button"
          role="tab"
          aria-controls="pills-trending"
          aria-selected="false"
        >
          Trending
        </button>
      </li>
    </ul>
  );
};

export default TopBar;
