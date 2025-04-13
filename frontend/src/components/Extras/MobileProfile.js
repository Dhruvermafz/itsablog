import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Col, Divider, Row, Typography } from "antd";
import { AiFillEdit } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { isLoggedIn } from "../../helpers/authHelper";
import ContentUpdateEditor from "../Content/ContentUpdateEditor";
import UserAvatar from "../UserModal/UserAvatar";
import HorizontalStack from "../util/HorizontalStack"; // Keep this if you prefer it, or use Ant Design's Row/Col

const MobileProfile = (props) => {
  const [user, setUser] = useState(null);
  const currentUser = isLoggedIn();

  useEffect(() => {
    if (props.profile) {
      setUser(props.profile.user);
    }
  }, [props.profile]);

  return (
    <Card style={{ display: "block", marginBottom: "16px" }}>
      {user ? (
        <div>
          <Row justify="space-between">
            <Col>
              <HorizontalStack spacing={2}>
                <UserAvatar width={50} height={50} username={user.username} />
                <Typography.Text>{user.username}</Typography.Text>
              </HorizontalStack>
            </Col>

            <Col>
              <Row gutter={16}>
                <Col>
                  <Typography.Text>Likes</Typography.Text>
                  <Typography.Text type="secondary">
                    <b>{props.profile.posts.likeCount}</b>
                  </Typography.Text>
                </Col>
                <Col>
                  <Typography.Text type="secondary">Posts</Typography.Text>
                  <Typography.Text type="secondary">
                    <b>{props.profile.posts.count}</b>
                  </Typography.Text>
                </Col>
              </Row>
            </Col>
          </Row>

          <Divider />

          <div>
            {currentUser && user._id === currentUser.userId && (
              <Button
                onClick={props.handleEditing}
                icon={props.editing ? <MdCancel /> : <AiFillEdit />}
                style={{ marginRight: "8px" }}
              />
            )}

            {user.biography ? (
              <>
                <Typography.Paragraph>
                  <b>Bio: </b>
                  {user.biography}
                </Typography.Paragraph>
              </>
            ) : (
              <Typography.Text>
                <i>
                  No bio yet{" "}
                  {currentUser && user._id === currentUser.userId && (
                    <span>- Tap on the edit icon to add your bio</span>
                  )}
                </i>
              </Typography.Text>
            )}

            {currentUser && user._id !== currentUser.userId && (
              <div style={{ marginTop: "16px" }}>
                <Button type="outline" onClick={props.handleMessage}>
                  Message
                </Button>
              </div>
            )}

            {props.editing && (
              <div>
                <ContentUpdateEditor
                  handleSubmit={props.handleSubmit}
                  originalContent={user.biography}
                  validate={props.validate}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <>Loading...</>
      )}
    </Card>
  );
};

export default MobileProfile;
