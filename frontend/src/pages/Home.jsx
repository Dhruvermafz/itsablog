import React from "react";
import ThemeWrapper from "../components/Theme/ThemeWrapper";
import Sidebar from "../components/Common/Sidebar";
import Loading from "../components/Common/Loading";
import TopBar from "../components/Common/TopBar";
import FollowPeopleTab from "../components/Tabs/FollowPeopleTab";
import RightSidebar from "../components/Common/RightSidebar";

const Home = () => {
  return (
    <main class="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12">
      <div class="main-content">
        <TopBar />
        <FollowPeopleTab />
      </div>
      <Loading />
    </main>
  );
};

export default Home;
