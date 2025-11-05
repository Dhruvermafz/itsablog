import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home.jsx";
import SingleBlog from "../components/Blogs/SingleBlog.jsx";
import Profile from "../components/Profile/Profile.jsx";
import Search from "../components/Common/Search.jsx";
import GroupFeed from "../components/Groups/GroupFeed.jsx";
import Login from "../components/Auth/Login.jsx";
import Signup from "../components/Auth/Signup.jsx";
import CategoryPage from "../components/Category/CategoryList.jsx";
import UserOnboarding from "../components/Onboarding/Onboarding.jsx";
import CreatePost from "../components/Blogs/CreatePost.jsx";
import AboutPage from "../pages/About.jsx";
import TermsAndConditions from "../pages/Terms.jsx";
import PostBrowser from "../components/Blogs/PostBrowser.jsx";
import Help from "../pages/Help.jsx";
import Messages from "../components/Messages/Messages.jsx";
import Privacy from "../pages/Privacy.jsx";
import GroupCreate from "../components/Groups/CreateGroups.jsx";
import CategoriesTagsManager from "../components/Category/CategoryList.jsx";
import Error404 from "../components/Common/Error404.jsx";
import Error401 from "../components/Common/Error401.jsx";
import Error429 from "../components/Common/Error429.jsx";
import Error500 from "../components/Common/Error500.jsx";
import Settings from "../pages/Settings.jsx";
import UserWrapper from "../components/User/UserWrapper.jsx";
import UserPage from "../components/User/UserPage.jsx";
function Router() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-blogs" element={<PostBrowser />} />
        <Route path="/blog/:id" element={<SingleBlog />} />
        <Route path="/blog/:id/edit" element={<CreatePost />} />
        <Route path="/u/:username" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/groups" element={<GroupFeed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<UserOnboarding />} />
        <Route path="/create-blog" element={<CreatePost />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/categories" element={<CategoriesTagsManager />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="/401" element={<Error401 />} />
        <Route path="/429" element={<Error429 />} />
        <Route path="/500" element={<Error500 />} />
        <Route path="/help" element={<Help />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/create-group" element={<GroupCreate />} />
        <Route path="/users" element={<UserWrapper />} />
        <Route path="/groups" element={<GroupFeed />} />
        <Route path="/user/:username" element={<UserPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>
    </>
  );
}

export default Router;
