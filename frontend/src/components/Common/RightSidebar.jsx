import React from "react";
import WhoToFollow from "../Tabs/WhoToFollow";
import SearchBar from "../SearchBar/SearchBar";
import WhatsHappening from "../Tabs/WhatsHappening";

const RightSidebar = () => {
  return (
    <aside class="col col-xl-3 order-xl-3 col-lg-6 order-lg-3 col-md-6 col-sm-6 col-12">
      <div class="fix-sidebar">
        <div class="side-trend lg-none">
          <div class="sticky-sidebar2 mb-3">
            <SearchBar />
            <WhatsHappening />
            <WhoToFollow />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
