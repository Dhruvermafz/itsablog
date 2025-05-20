import React from "react";
import { Layout } from "antd";
import GoBack from "../components/Extras/GoBack";
import PostEditor from "../components/Post/PostEditor";

const { Content } = Layout;

const CreatePostView = () => {
  return (
    <Layout>
      <Content>
        {/* <Container> */}
        <GoBack />
        <PostEditor />
        {/* </Container> */}
      </Content>
    </Layout>
  );
};

export default CreatePostView;
