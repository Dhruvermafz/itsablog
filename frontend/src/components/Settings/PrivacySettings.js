import React from "react";
import { connect } from "react-redux";
import { Card, Typography } from "antd";

const { Title } = Typography;

const PrivacySettings = () => {
  return (
    <Card bordered={false} style={{ padding: 20 }}>
      <Title level={2}>Privacy Settings</Title>
      {/* You can add additional privacy settings controls here */}
    </Card>
  );
};

const mapStateToProps = (state) => {
  return { settings: state.settings };
};

export default connect(mapStateToProps, {})(PrivacySettings);
