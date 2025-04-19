import React from "react";
import { connect } from "react-redux";
import { Card, Typography } from "antd";

const { Title } = Typography;

const AccountSettings = () => {
  return (
    <Card bordered={false} style={{ padding: 20 }}>
      <Title level={2}>Account Settings</Title>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return { settings: state.settings };
};

export default connect(mapStateToProps, {})(AccountSettings);
