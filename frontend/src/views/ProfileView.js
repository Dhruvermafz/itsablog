import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Layout, Row, Col, Tabs, Space, Spin, Alert } from "antd";
import { getUser, updateUser } from "../api/users";
import { isLoggedIn } from "../helpers/authHelper";
import CommentBrowser from "../components/Comments/CommentBrowser";
import FindUsers from "../components/Extras/FindUsers";
import MobileProfile from "../components/Extras/MobileProfile";
import PostBrowser from "../components/Post/PostBrowser";
import Profile from "../components/Profile/Profile";

const { Content } = Layout;
const { TabPane } = Tabs;

const ProfileView = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState("posts");
  const [error, setError] = useState("");
  const user = isLoggedIn();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = async () => {
    setLoading(true);
    const data = await getUser(params);
    setLoading(false);

    if (data.error) {
      setError(data.error);
    } else {
      setProfile(data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = e.target.content.value;

    await updateUser(user, { biography: content });

    setProfile({ ...profile, user: { ...profile.user, biography: content } });
    setEditing(false);
  };

  const handleEditing = () => {
    setEditing(!editing);
  };

  const handleMessage = () => {
    navigate("/messenger", { state: { user: profile.user } });
  };

  const validate = (content) => {
    if (content.length > 250) {
      return "Bio cannot be longer than 250 characters";
    }
    return "";
  };

  const renderTabs = () => (
    <Tabs activeKey={tab} onChange={setTab}>
      <TabPane tab="Posts" key="posts">
        <PostBrowser profileUser={profile.user} contentType="posts" />
      </TabPane>
      <TabPane tab="Liked" key="liked">
        <PostBrowser profileUser={profile.user} contentType="liked" />
      </TabPane>
      <TabPane tab="Comments" key="comments">
        <CommentBrowser profileUser={profile.user} />
      </TabPane>
    </Tabs>
  );

  return (
    <Layout>
      <Content style={{ padding: "24px 48px", minHeight: "100vh" }}>
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <MobileProfile
              profile={profile}
              editing={editing}
              handleSubmit={handleSubmit}
              handleEditing={handleEditing}
              handleMessage={handleMessage}
              validate={validate}
            />
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              {loading ? <Spin tip="Loading..." /> : profile && renderTabs()}
              {error && <Alert message={error} type="error" showIcon />}
            </Space>
          </Col>

          <Col xs={24} md={8}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Profile
                profile={profile}
                editing={editing}
                handleSubmit={handleSubmit}
                handleEditing={handleEditing}
                handleMessage={handleMessage}
                validate={validate}
              />
              <FindUsers />
            </Space>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ProfileView;
