import React from "react";
import { connect } from "react-redux";
import { Card, Typography, Button } from "antd";

const { Title } = Typography;

const DeactivateAccount = () => {
  return (
    <Card bordered={false} style={{ padding: 20 }}>
      <Title level={2}>Deactivate Account</Title>
      <Button type="primary" danger>
        Deactivate Account
      </Button>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return { settings: state.settings };
};

export default connect(mapStateToProps, {})(DeactivateAccount);
