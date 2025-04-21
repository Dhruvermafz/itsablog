import { Button, Dropdown, Menu } from "antd";
import { DownOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./NewsRoom.module.css";

// Mock admin role check (replace with auth logic later)
const isAdmin = true;

const AdminControls = () => {
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<EditOutlined />}>
        Edit Post
      </Menu.Item>
      <Menu.Item key="2" icon={<DeleteOutlined />} danger>
        Delete Post
      </Menu.Item>
    </Menu>
  );

  if (!isAdmin) return null;

  return (
    <div className={styles.adminControls}>
      <Button type="primary" icon={<EditOutlined />}>
        Review Submissions
      </Button>
      <Button type="default" style={{ marginLeft: 8 }}>
        Manage Categories
      </Button>
      <Dropdown overlay={menu}>
        <Button style={{ marginLeft: 8 }}>
          More Actions <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default AdminControls;
