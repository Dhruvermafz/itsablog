import React from "react";
import { connect } from "react-redux";
import { Card, Typography, Button } from "antd";

const { Title } = Typography;

const DeleteAccount = () => {
  return (
    <Card bordered={false} style={{ padding: 20 }}>
      <Title level={2}>Delete Account</Title>
      <Button type="primary" danger>
        Delete Account
      </Button>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return { settings: state.settings };
};

export default connect(mapStateToProps, {})(DeleteAccount);
