import React from "react";
import PostTab from "./PostTab";
import AccountSlider from "./AccountSlider";
import FeedTab from "../Feed/FeedTab";
import PeopleToFollow from "./PeopleToFollow";

const FollowPeopleTab = () => {
  return (
    <div class="tab-content" id="pills-tabContent">
      <div
        class="tab-pane fade show active"
        id="pills-feed"
        role="tabpanel"
        aria-labelledby="pills-feed-tab"
      >
        <PostTab />

        <div>
          <div class="d-flex align-items-center justify-content-between mb-1">
            <h6 class="mb-0 fw-bold text-body">Follow People</h6>
            <a href="#" class="text-dark text-decoration-none material-icons">
              east
            </a>
          </div>

          <AccountSlider />

          <FeedTab />
        </div>
      </div>
      <PeopleToFollow />
    </div>
  );
};

export default FollowPeopleTab;
