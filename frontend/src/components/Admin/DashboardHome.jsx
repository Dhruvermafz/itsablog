import React from "react";
import { Card, Row, Col, Layout } from "antd";
import Sidebar from "./Sidebar";
import "../../css/admin.css";
const { Content } = Layout;

const DashboardHome = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content style={{ margin: "16px" }}>
          <div>
            <h2>Admin Overview</h2>
            <Row gutter={16}>
              <Col span={6}>
                <Card title="Total Users">123</Card>
              </Col>
              <Col span={6}>
                <Card title="Total Writers">45</Card>
              </Col>
              <Col span={6}>
                <Card title="Total Posts">210</Card>
              </Col>
              <Col span={6}>
                <Card title="Reports Pending">5</Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardHome;
