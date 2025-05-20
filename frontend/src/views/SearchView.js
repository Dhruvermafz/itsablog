import React from "react";
import { Layout, Row, Col } from "antd";
import PostBrowser from "../components/Post/PostBrowser";
import Sidebar from "../components/Home/Sidebar";

const { Content } = Layout;

const SearchView = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px" }}>
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <PostBrowser createPost contentType="posts" />
          </Col>
          <Col xs={24} md={8}>
            <Sidebar />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default SearchView;
