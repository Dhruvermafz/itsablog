import { Layout, Row, Col, Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import NewsroomFilters from "./NewsroomFilter";
import ArticleCard from "./ArticleCard";
import WriterSpotlight from "./WriterSpotlight";
import AdminControls from "./AdminControls";
import styles from "./NewsRoom.module.css";

const { Content } = Layout;
const { Title } = Typography;

const NewsroomList = () => {
  const articles = [
    // Mock data for demo
    {
      id: 1,
      title: "The Future of Democracy",
      category: "Politics",
      author: "Jane Doe",
      readTime: "8 min",
      image: "...",
    },
    // More articles...
  ];

  return (
    <Layout className={styles.newsroom}>
      <Content className={styles.content}>
        <Title level={2} className={styles.title}>
          Newsroom
        </Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <NewsroomFilters />
            <WriterSpotlight />
          </Col>
          <Col xs={24} md={18}>
            <AdminControls />
            <Row gutter={[16, 16]}>
              {articles.map((article) => (
                <Col xs={24} sm={12} md={8} key={article.id}>
                  <ArticleCard article={article} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default NewsroomList;
