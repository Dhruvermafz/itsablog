import { Container } from "@mui/material";
import React from "react";
import GridLayout from "../components/Extras/GridLayout";
import Sidebar from "../components/Home/Sidebar";
import PostBrowser from "../components/Post/PostBrowser";

const ExploreView = () => {
  return (
    <Container>
      <GridLayout
        left={<PostBrowser createPost contentType="posts" />}
        right={<Sidebar />}
      />
    </Container>
  );
};

export default ExploreView;
