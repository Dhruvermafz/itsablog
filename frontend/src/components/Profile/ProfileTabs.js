import React from "react";
import { Card, Tabs } from "antd";

const { TabPane } = Tabs;

const ProfileTabs = (props) => {
  const handleChange = (key) => {
    props.setTab(key);
  };

  return (
    <Card style={{ padding: 0 }}>
      <Tabs
        activeKey={props.tab}
        onChange={handleChange}
        type="line"
        tabBarGutter={32}
      >
        <TabPane tab="Posts" key="posts" />
        <TabPane tab="Liked" key="liked" />
        <TabPane tab="Comments" key="comments" />
      </Tabs>
    </Card>
  );
};

export default ProfileTabs;
