import { useState } from "react";
import { Card, Typography, Button, Avatar } from "antd";
import { UserOutlined, RightOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "./Group.module.css";
import { message } from "antd";
const { Paragraph, Text } = Typography;

const GroupCard = ({ group }) => {
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Adjust based on your auth setup
      await axios.post(
        `/api/groups/${group._id}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success(`Joined ${group.name} successfully!`);
    } catch (error) {
      console.error("Join group error:", error);
      message.error(
        error.response?.data?.message || "Failed to join community"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      hoverable
      className={styles.groupCard}
      cover={
        <div className={styles.cardCover}>
          <Avatar
            src={group.image || "https://via.placeholder.com/64"}
            size={64}
            className={styles.groupAvatar}
          />
        </div>
      }
    >
      <Typography.Title level={4} className={styles.groupName}>
        {group.name}
      </Typography.Title>
      <Text type="secondary" className={styles.category}>
        {group.category || "General"}
      </Text>
      <Paragraph ellipsis={{ rows: 2 }} className={styles.description}>
        {group.description || "No description available."}
      </Paragraph>
      <Paragraph className={styles.meta}>
        <UserOutlined /> {group.members.length.toLocaleString()} members
      </Paragraph>
      <Button
        type="primary"
        icon={<RightOutlined />}
        className={styles.joinButton}
        onClick={handleJoin}
        loading={loading}
      >
        Join Community
      </Button>
    </Card>
  );
};

export default GroupCard;
