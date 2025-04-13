import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import GoBack from "../components/Extras/GoBack";
import PostEditor from "../components/Post/PostEditor";
import { getPost as getPostById } from "../api/posts";
const { Content } = Layout;

const EditPost = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const fetchedPost = await getPostById(postId);
        setPost(fetchedPost);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <Layout>
      <Content>
        <GoBack />
        {loading ? <div>Loading...</div> : <PostEditor post={post} />}
      </Content>
    </Layout>
  );
};

export default EditPost;
