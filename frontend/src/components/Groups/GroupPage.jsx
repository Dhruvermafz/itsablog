import { Layout, Row, Col, Typography, Tabs } from "antd";
import DiscussionThread from "./DiscussionThread";
import CollaborativeEditor from "./CollaborativeEditor";
import styles from "./Group.module.css";
import ArticleCard from "../NewsRoom/ArticleCard";
const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const GroupPage = () => (
  <Layout className={styles.groupPage}>
    <Content className={styles.content}>
      <Title level={2}>Urdu Literature</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Posts" key="1">
          <Row gutter={[16, 16]}>
            {/* Mock posts */}
            <Col xs={24}>
              <ArticleCard />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Discussions" key="2">
          <DiscussionThread />
        </TabPane>
        <TabPane tab="Collaborate" key="3">
          <CollaborativeEditor />
        </TabPane>
        <TabPane tab="Members" key="4">
          <p>Members list (mock)</p>
        </TabPane>
      </Tabs>
    </Content>
  </Layout>
);

export default GroupPage;
