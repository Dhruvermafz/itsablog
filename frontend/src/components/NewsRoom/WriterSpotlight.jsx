import { Card, Typography, Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./NewsRoom.module.css";

const { Title, Paragraph } = Typography;

const WriterSpotlight = () => {
  // Mock data for demo
  const writer = {
    name: "Jane Doe",
    avatar: "https://example.com/avatar.jpg",
    bio: "Award-winning journalist passionate about politics and culture.",
    posts: 42,
  };

  return (
    <Card className={styles.writerSpotlight} bordered={false}>
      <div className={styles.writerHeader}>
        <Avatar
          size={64}
          src={writer.avatar}
          icon={<UserOutlined />}
          className={styles.avatar}
        />
        <Title level={4} className={styles.writerName}>
          {writer.name}
        </Title>
      </div>
      <Paragraph className={styles.bio}>{writer.bio}</Paragraph>
      <Paragraph className={styles.stats}>
        <strong>{writer.posts}</strong> posts published
      </Paragraph>
      <Button type="primary" block className={styles.profileButton}>
        View Profile
      </Button>
    </Card>
  );
};

export default WriterSpotlight;
