import React, { useEffect, useState } from "react";
import { Card, Space, Typography, Avatar, Button, List } from "antd";
import { ReloadOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getRandomUsers } from "../../api/users";
import Loading from "../Home/Loading";
import UserEntry from "../UserModal/UserEntry";

const { Text } = Typography;

const FindUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getRandomUsers({ size: 5 });
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card
      title="Find Others"
      extra={
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={fetchUsers}
          disabled={loading}
        />
      }
      bodyStyle={{ padding: "16px" }}
      style={{ borderRadius: "10px" }}
    >
      {loading ? (
        <Loading />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={users}
          renderItem={(user) => (
            <List.Item>
              <Link to={`/${user.username}`} style={{ width: "100%" }}>
                <UserEntry username={user.username} />
              </Link>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default FindUsers;
