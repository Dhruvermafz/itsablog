import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card } from "antd";
import Messages from "../components/Messages/Messages";
import Navbar from "../components/Home/Navbar";
import UserMessengerEntries from "../components/UserModal/UserMessengerEntries";
import { getConversations } from "../api/messages";
import { isLoggedIn } from "../helpers/authHelper";
import { useLocation } from "react-router-dom";

const { Content } = Layout;

const MessengerView = () => {
  const [conservant, setConservant] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [width, setWindowWidth] = useState(window.innerWidth);
  const mobile = width < 800;

  const user = isLoggedIn();
  const { state } = useLocation();
  const newConservant = state && state.user;

  const getConversation = (conversations, conservantId) => {
    return conversations.find(
      (conversation) => conversation.recipient._id === conservantId
    );
  };

  const fetchConversations = async () => {
    let conversations = await getConversations(user);
    if (newConservant) {
      setConservant(newConservant);
      if (!getConversation(conversations, newConservant._id)) {
        const newConversation = {
          _id: newConservant._id,
          recipient: newConservant,
          new: true,
          messages: [],
        };
        conversations = [newConversation, ...conversations];
      }
    }
    setConversations(conversations);
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Content style={{ padding: "16px" }}>
        <Card bodyStyle={{ padding: 0 }}>
          <Row style={{ height: "calc(100vh - 110px)" }}>
            {!mobile ? (
              <>
                <Col
                  span={8}
                  style={{
                    borderRight: "1px solid #f0f0f0",
                    height: "100%",
                    overflowY: "auto",
                  }}
                >
                  <UserMessengerEntries
                    conservant={conservant}
                    conversations={conversations}
                    setConservant={setConservant}
                    loading={loading}
                  />
                </Col>
                <Col span={16} style={{ height: "100%", overflowY: "auto" }}>
                  <Messages
                    conservant={conservant}
                    conversations={conversations}
                    setConservant={setConservant}
                    setConversations={setConversations}
                    getConversation={getConversation}
                  />
                </Col>
              </>
            ) : !conservant ? (
              <Col span={24} style={{ height: "100%", overflowY: "auto" }}>
                <UserMessengerEntries
                  conservant={conservant}
                  conversations={conversations}
                  setConservant={setConservant}
                  loading={loading}
                />
              </Col>
            ) : (
              <Col span={24} style={{ height: "100%", overflowY: "auto" }}>
                <Messages
                  conservant={conservant}
                  conversations={conversations}
                  setConservant={setConservant}
                  setConversations={setConversations}
                  getConversation={getConversation}
                  mobile
                />
              </Col>
            )}
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

export default MessengerView;
