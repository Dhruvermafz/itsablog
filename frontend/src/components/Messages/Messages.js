import React, { useEffect, useRef, useState } from "react";
import { Button, Divider, Typography, Avatar, Row, Col } from "antd";
import { AiFillBackward, AiFillCaretLeft, AiFillMessage } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getMessages, sendMessage } from "../../api/messages";
import { isLoggedIn } from "../../helpers/authHelper";
import { socket } from "../../helpers/socketHelper";
import Loading from "../Home/Loading";
import Message from "./Message";
import SendMessage from "./SendMessage";
import HorizontalStack from "../util/HorizontalStack";

const Messages = (props) => {
  const messagesEndRef = useRef(null);
  const user = isLoggedIn();
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);

  const conversationsRef = useRef(props.conversations);
  const conservantRef = useRef(props.conservant);
  const messagesRef = useRef(messages);

  useEffect(() => {
    conversationsRef.current = props.conversations;
    conservantRef.current = props.conservant;
    messagesRef.current = messages;
  });

  const conversation =
    props.conversations &&
    props.conservant &&
    props.getConversation(props.conversations, props.conservant._id);

  const setDirection = (messages) => {
    messages.forEach((message) => {
      if (message.sender._id === user.userId) {
        message.direction = "from";
      } else {
        message.direction = "to";
      }
    });
  };

  const fetchMessages = async () => {
    if (conversation) {
      if (conversation.new) {
        setLoading(false);
        setMessages(conversation.messages);
        return;
      }

      setLoading(true);

      const data = await getMessages(user, conversation._id);

      setDirection(data);

      if (data && !data.error) {
        setMessages(data);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [props.conservant]);

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const handleSendMessage = async (content) => {
    const newMessage = { direction: "from", content };
    const newMessages = [newMessage, ...messages];

    if (conversation.new) {
      conversation.messages = [...conversation.messages, newMessage];
    }

    let newConversations = props.conversations.filter(
      (conversationCompare) => conversation._id !== conversationCompare._id
    );

    newConversations.unshift(conversation);

    props.setConversations(newConversations);

    setMessages(newMessages);

    await sendMessage(user, newMessage, conversation.recipient._id);

    socket.emit(
      "send-message",
      conversation.recipient._id,
      user.username,
      content
    );
  };

  const handleReceiveMessage = (senderId, username, content) => {
    const newMessage = { direction: "to", content };

    const conversation = props.getConversation(
      conversationsRef.current,
      senderId
    );

    console.log(username + " " + content);

    if (conversation) {
      let newMessages = [newMessage];
      if (messagesRef.current) {
        newMessages = [...newMessages, ...messagesRef.current];
      }

      setMessages(newMessages);

      if (conversation.new) {
        conversation.messages = newMessages;
      }
      conversation.lastMessageAt = Date.now();

      let newConversations = conversationsRef.current.filter(
        (conversationCompare) => conversation._id !== conversationCompare._id
      );

      newConversations.unshift(conversation);

      props.setConversations(newConversations);
    } else {
      const newConversation = {
        _id: senderId,
        recipient: { _id: senderId, username },
        new: true,
        messages: [newMessage],
        lastMessageAt: Date.now(),
      };
      props.setConversations([newConversation, ...conversationsRef.current]);
    }

    scrollToBottom();
  };

  useEffect(() => {
    socket.on("receive-message", handleReceiveMessage);
  }, []);

  return props.conservant ? (
    <>
      {messages && conversation && !loading ? (
        <>
          <HorizontalStack
            alignItems="center"
            spacing={2}
            sx={{ px: 2, height: "60px" }}
          >
            {props.mobile && (
              <Button
                type="text"
                icon={<AiFillCaretLeft />}
                onClick={() => props.setConservant(null)}
              />
            )}
            <Avatar
              src={props.conservant.avatarUrl}
              size={30}
              style={{ marginRight: 10 }}
            />
            <Typography>
              <Link to={"/" + props.conservant.username}>
                <b>{props.conservant.username}</b>
              </Link>
            </Typography>
          </HorizontalStack>
          <Divider />
          <Row style={{ height: "calc(100vh - 240px)" }}>
            <Col span={24}>
              <div ref={messagesEndRef} />
              <div
                style={{
                  padding: 16,
                  overflowY: "auto",
                  maxHeight: "100%",
                  display: "flex",
                  flexDirection: "column-reverse",
                }}
              >
                {messages.map((message, i) => (
                  <Message
                    conservant={props.conservant}
                    message={message}
                    key={i}
                  />
                ))}
              </div>
            </Col>
          </Row>
          <SendMessage onSendMessage={handleSendMessage} />
          {scrollToBottom()}
        </>
      ) : (
        <Row style={{ height: "100%" }} justify="center">
          <Col span={24}>
            <Loading />
          </Col>
        </Row>
      )}
    </>
  ) : (
    <Row
      style={{ height: "100%" }}
      justify="center"
      align="middle"
      gutter={[0, 16]}
    >
      <Col span={24}>
        <AiFillMessage size={80} />
      </Col>
      <Col span={24}>
        <Typography variant="h5">ItsABlog Messenger</Typography>
        <Typography color="text.secondary">
          Privately message other users on ItsABlog.
        </Typography>
      </Col>
    </Row>
  );
};

export default Messages;
