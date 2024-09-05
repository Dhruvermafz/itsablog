import React from "react";

const SearchBar = () => {
  return (
    <div class="input-group mb-4 shadow-sm rounded-4 overflow-hidden py-2 bg-white">
      <span class="input-group-text material-icons border-0 bg-white text-primary">
        search
      </span>
      <input
        type="text"
        class="form-control border-0 fw-light ps-1"
        placeholder="Search Vogel"
      />
    </div>
  );
};

export default SearchBar;
