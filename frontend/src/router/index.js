import "react-icons";
import "react-icons/bi";
import "react-icons/md";
import "react-icons/bs";
import "react-router-dom";

// Import Ant Design components
import { ConfigProvider, Layout } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ConfirmMail from "../components/Extras/ConfirmMail";
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
import Copyright from "../components/Home/Footer";
import AboutPage from "../views/AboutUs";
import ForgotPassword from "../views/FogotPassword";
import PasswordReset from "../views/PasswordReset";
import Error500 from "../views/Error500";
import PrivacyView from "../views/PrivacyView";
import EditPost from "../views/EditPostView";
import Footer from "../components/Home/Footer";
import Navbar from "../components/Home/Navbar";
import TermsAndConditions from "../views/Terms";
import AddBookReview from "../components/Books/AddBookReviews";
function Router() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Layout>
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
            <Route
              path={routes.PRIVACY}
              element={
                <PrivateRoute>
                  <PrivacyView />
                </PrivateRoute>
              }
            />
            <Route path={routes.SEARCH} element={<SearchView />} />
            <Route path={routes.PROFILE(":id")} element={<ProfileView />} />
            <Route path={routes.LOGIN} element={<LoginView />} />
            <Route path={routes.SIGNUP} element={<SignupView />} />
            <Route path={routes.SETTINGS} element={<SettingsView />} />
            <Route element={<Error404 />} />
            <Route element={<Error500 />} />
            <Route path={routes.ABOUT} element={<AboutPage />} />
            <Route path={routes.PASSWORD_RESET} element={<PasswordReset />} />
            <Route path={routes.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={routes.TERMS} element={<TermsAndConditions />} />
            <Route path={routes.ADD_BOOK_REVIEW} element={<AddBookReview />} />
          </Routes>
          <Footer />
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default Router;
