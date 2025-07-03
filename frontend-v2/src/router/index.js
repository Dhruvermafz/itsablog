import { Route, Routes } from "react-router-dom";

import { routes } from "./routes";
import Home from "../pages/Home";
import SingleBlog from "../components/Blogs/SingleBlog";
import Profile from "../components/Profile/Profile";
import Search from "../components/Common/Search";
import GroupFeed from "../components/Groups/GroupFeed";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import CategoryPage from "../components/Category/CategoryList";
import UserOnboarding from "../components/Onboarding/Onboarding";
import CreatePost from "../components/Blogs/CreateBlog";
import Error404 from "../components/Common/Error404";
import AboutPage from "../pages/About";
import TermsAndConditions from "../pages/Terms";

function Router() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<SingleBlog />} />
        <Route path="/u/:id" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/groups" element={<GroupFeed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/category-list" element={<CategoryPage />} />
        <Route path="/onboarding" element={<UserOnboarding />} />
        <Route path="/create-blog" element={<CreatePost />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>
    </>
  );
}

export default Router;
