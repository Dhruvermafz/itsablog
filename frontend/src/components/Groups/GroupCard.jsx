import { Card, Typography, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./Group.module.css";

const { Paragraph } = Typography;

const GroupCard = ({ group }) => (
  <Card hoverable className={styles.groupCard}>
    <Typography.Title level={5}>{group.name}</Typography.Title>
    <Paragraph className={styles.category}>{group.category}</Paragraph>
    <Paragraph>{group.description}</Paragraph>
    <Paragraph className={styles.meta}>
      <UserOutlined /> {group.members} members
    </Paragraph>
    <Button type="primary" className={styles.joinButton}>
      Join Group
    </Button>
  </Card>
);
export default GroupCard;
