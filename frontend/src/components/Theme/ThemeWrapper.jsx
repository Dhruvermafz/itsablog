import React from "react";

const ThemeWrapper = () => {
  return (
    <div class="theme-switch-wrapper ms-3">
      <label class="theme-switch" htmlFor="checkbox">
        <input type="checkbox" id="checkbox" />
        <span class="slider round"></span>
        <i class="icofont-ui-brightness"></i>
      </label>
      <em>Enable Dark Mode!</em>
    </div>
  );
};

export default ThemeWrapper;
