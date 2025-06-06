import "react-icons";
import "react-icons/bi";
import "react-icons/md";
import "react-icons/bs";
import "react-router-dom";
import RoleRequests from "../components/Admin/RoleRequests";
import ReportedPosts from "../components/Admin/ReportedPost";
import ManageUsers from "../components/Admin/ManageUsers";
import ManagePosts from "../components/Admin/ManagePost";
import ManageCategories from "../components/Admin/ManageCategories";
import DashboardHome from "../components/Admin/DashboardHome";
import { Route, Routes } from "react-router-dom";
import PostView from "../views/PostView";
import CreatePostView from "../views/CreatePostView";
import ProfileView from "../views/ProfileView";
import LoginView from "../views/LoginView";
import SignupView from "../views/SignupView";
import ExploreView from "../views/ExploreView";
import PrivateRoute from "../components/util/PrivateRoute";
import SearchView from "../views/SearchView";
import MessengerView from "../views/MessengerView";
import { routes } from "./routes";
import SettingsView from "../components/Settings";
import Error404 from "../components/Results/404";
import AboutPage from "../views/AboutUs";
import ForgotPassword from "../views/FogotPassword";
import PasswordReset from "../views/PasswordReset";
import Error500 from "../views/Error500";
import TermsAndConditions from "../views/Terms";
import AddBookReview from "../components/Books/AddBookReviews";
import CategoryList from "../components/Categories/CategoryList";
import UserOnboarding from "../components/Onboarding/Onboarding";
import GroupFeed from "../components/Groups/GroupFeed";
import NewsroomList from "../components/NewsRoom/NewsRoomList";
import GroupPage from "../components/Groups/GroupPage";
import GroupCreate from "../components/Groups/CreateGroups";
function Router() {
  return (
    <>
      <Routes>
        <Route path={routes.FEED} element={<ExploreView />} />
        <Route path={routes.READ_BLOG(":id")} element={<PostView />} />
        <Route
          path={routes.CREATE_BLOG}
          element={
            <PrivateRoute>
              <CreatePostView />
            </PrivateRoute>
          }
        />
        <Route
          path={routes.MESSANGER}
          element={
            <PrivateRoute>
              <MessengerView />
            </PrivateRoute>
          }
        />
        <Route path={routes.GROUPS} element={<GroupFeed />} />
        <Route path={routes.NEWSROOM} element={<NewsroomList />} />
        <Route path={routes.ADMIN_DASHBOARD_HOME} element={<DashboardHome />} />
        <Route path={routes.ADMIN_MANAGE_USERS} element={<ManageUsers />} />
        <Route path={routes.ADMIN_MANAGE_POSTS} element={<ManagePosts />} />

        <Route
          path={routes.ADMIN_MANAGE_CATEGORIES}
          element={<ManageCategories />}
        />
        <Route path={routes.ADMIN_MANAGE_ROLES} element={<RoleRequests />} />
        <Route path={routes.ADMIN_MANAGE_REPORTS} element={<ReportedPosts />} />
        <Route path={routes.GROUP_LIST} element={<GroupFeed />} />
        <Route path={routes.CREATE_GROUP} element={<GroupCreate />} />
        <Route path={routes.NEWSROOM_LIST} element={<NewsroomList />} />
        <Route path={routes.GROUP_PAGE} element={<GroupPage />} />
        <Route path={routes.ONBOARDING} element={<UserOnboarding />} />
        <Route path={routes.CATEGORY} element={<CategoryList />} />
        <Route path={routes.SEARCH} element={<SearchView />} />
        <Route path={routes.PROFILE(":id")} element={<ProfileView />} />
        <Route path={routes.LOGIN} element={<LoginView />} />
        <Route path={routes.SIGNUP} element={<SignupView />} />
        <Route path={routes.SETTINGS} element={<SettingsView />} />
        <Route path={routes.Error404} element={<Error404 />} />
        <Route path="*" element={<Error500 />} />
        <Route path={routes.ABOUT} element={<AboutPage />} />
        <Route path={routes.PASSWORD_RESET} element={<PasswordReset />} />
        <Route path={routes.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={routes.TERMS} element={<TermsAndConditions />} />
        <Route path={routes.ADD_BOOK_REVIEW} element={<AddBookReview />} />
      </Routes>
    </>
  );
}

export default Router;
