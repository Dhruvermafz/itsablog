import { Card, Typography, Input, Button, Avatar, List } from "antd";
import { SaveOutlined, SendOutlined } from "@ant-design/icons";
import styles from "./Group.module.css";

const { Title } = Typography;
const { TextArea } = Input;

// Mock contributors
const contributors = [
  { id: 1, name: "Ali Khan", avatar: "https://example.com/avatar.jpg" },
  { id: 2, name: "Sara Ahmed", avatar: "https://example.com/avatar2.jpg" },
];

const CollaborativeEditor = () => {
  return (
    <Card className={styles.editorCard} bordered={false}>
      <Title level={5} className={styles.editorTitle}>
        Collaborative Post Editor
      </Title>
      <div className={styles.contributors}>
        <Typography.Text strong>Contributors:</Typography.Text>
        <List
          dataSource={contributors}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Avatar src={item.avatar} size={24} style={{ marginRight: 8 }} />
              {item.name}
            </List.Item>
          )}
        />
      </div>
      <TextArea
        rows={10}
        placeholder="Start writing your collaborative post..."
        className={styles.editor}
      />
      <div className={styles.editorActions}>
        <Button icon={<SaveOutlined />}>Save Draft</Button>
        <Button type="primary" icon={<SendOutlined />}>
          Publish
        </Button>
      </div>
    </Card>
  );
};

export default CollaborativeEditor;
