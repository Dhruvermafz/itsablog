import { Layout, Row, Col, Typography, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import GroupCard from "./GroupCard";
import GroupFilters from "./GroupFilters";
import styles from "./Group.module.css";

const { Content } = Layout;
const { Title } = Typography;

const GroupFeed = () => {
  const groups = [
    {
      id: 1,
      name: "Urdu Literature",
      members: 1200,
      category: "Literature",
      description: "A space for Urdu poetry and prose lovers.",
    },
    {
      id: 2,
      name: "Indie Cinema",
      members: 850,
      category: "Cinema",
      description: "Discuss indie films and hidden gems.",
    },
    {
      id: 3,
      name: "Tech Innovators",
      members: 2000,
      category: "Tech",
      description: "A hub for tech enthusiasts and innovators.",
    },
  ];

  return (
    <Layout className={styles.groups}>
      <Content className={styles.content}>
        <Title level={2} className={styles.title}>
          Discover Groups
        </Title>
        <Input
          placeholder="Search groups..."
          prefix={<SearchOutlined />}
          className={styles.search}
        />
        <GroupFilters />
        <Row gutter={[16, 16]}>
          {groups.map((group) => (
            <Col xs={24} sm={12} md={8} key={group.id}>
              <GroupCard group={group} />
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default GroupFeed;
