import React, { useEffect, useRef, useState } from "react";
import { Button, Divider, Typography } from "antd";
import { Link } from "react-router-dom";
import { getMessages, sendMessage } from "../../api/messages";
import { isLoggedIn } from "../../helpers/authHelper";
import {
  socket,
  initiateSocketConnection,
  disconnectSocket,
} from "../../helpers/socketHelper";
import { AiFillCaretLeft } from "react-icons/ai";
import Message from "./Message";
import SendMessage from "./SendMessage";

const Messages = (props) => {
  const messagesEndRef = useRef(null);
  const user = isLoggedIn();
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShowChatInfo, setIsShowChatInfo] = useState(false);

  const conversationsRef = useRef(props.conversations);
  const conservantRef = useRef(props.conservant);
  const messagesRef = useRef(messages);

  useEffect(() => {
    conversationsRef.current = props.conversations;
    conservantRef.current = props.conservant;
    messagesRef.current = messages;
  }, [props.conversations, props.conservant, messages]);

  useEffect(() => {
    if (user) {
      initiateSocketConnection();
    }
    return () => disconnectSocket();
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("receive-message", handleReceiveMessage);
      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
      return () => {
        socket.off("receive-message", handleReceiveMessage);
        socket.off("connect_error");
      };
    } else {
      console.error("Socket is not initialized");
    }
  }, []);

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
      try {
        const data = await getMessages(user, conversation._id);
        if (data && !data.error) {
          setDirection(data);
          setMessages(data);
        } else {
          console.error("Error fetching messages:", data?.error);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
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
    const newMessages = [...messages, newMessage]; // Append

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
    if (socket) {
      socket.emit(
        "send-message",
        conversation.recipient._id,
        user.username,
        content
      );
    }
  };

  const handleReceiveMessage = (senderId, username, content) => {
    const newMessage = { direction: "to", content };
    const conversation = props.getConversation(
      conversationsRef.current,
      senderId
    );

    if (conversation) {
      let newMessages = [...(messagesRef.current || []), newMessage]; // Append
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
  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach((message, index) => {
      const date = new Date(message.createdAt || Date.now()).toLocaleDateString(
        "en-US",
        { weekday: "long" }
      );
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push({ ...message, key: index });
    });
    return grouped;
  };

  const groupedMessages = messages ? groupMessagesByDate(messages) : {};

  return props.conservant ? (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="chat-header relative z-10 flex h-[61px] w-full shrink-0 items-center justify-between border-b border-slate-150 bg-white px-[calc(var(--margin-x)-.5rem)] dark:border-navy-700 dark:bg-navy-800">
        <div className="flex items-center space-x-5">
          {props.mobile && (
            <Button
              type="text"
              icon={<AiFillCaretLeft />}
              onClick={() => props.setConservant(null)}
              className="size-7 p-0"
            />
          )}
          <div
            onClick={() => setIsShowChatInfo(true)}
            className="flex cursor-pointer items-center space-x-4 font-inter"
          >
            <div className="avatar">
              <img
                className="rounded-full"
                src={
                  props.conservant.avatarUrl || "images/avatar/avatar-12.jpg"
                }
                alt="avatar"
              />
            </div>
            <div>
              <Typography>
                <Link to={`/${props.conservant.username}`}>
                  <p className="font-medium text-slate-700 line-clamp-1 dark:text-navy-100">
                    {props.conservant.username}
                  </p>
                </Link>
              </Typography>
              <p className="mt-0.5 text-xs">Last seen recently</p>
            </div>
          </div>
        </div>
        <div className="-mr-1 flex items-center">
          <Button className="size-9 rounded-full p-0 text-slate-500 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:text-navy-200 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </Button>
          <Button className="size-9 rounded-full p-0 text-slate-500 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:text-navy-200 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Button>
          <Button
            onClick={() => setIsShowChatInfo(!isShowChatInfo)}
            className={`size-9 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
              isShowChatInfo
                ? "text-primary dark:text-accent-light"
                : "text-slate-500 dark:text-navy-200"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.25 21.167h5.5c4.584 0 6.417-1.834 6.417-6.417v-5.5c0-4.583-1.834-6.417-6.417-6.417h-5.5c-4.583 0-6.417 1.834-6.417 6.417v5.5c0 4.583 1.834 6.417 6.417 6.417ZM13.834 2.833v18.334"
              />
            </svg>
          </Button>
          <div className="inline-flex">
            <Button className="size-9 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </Button>
            <div
              className={`popper-root fixed right-0 top-0 z-[101] h-full w-full sm:w-80 ${
                isShowChatInfo ? "show" : "hidden"
              }`}
            >
              <div
                className="fixed inset-0 z-[100] bg-slate-900/60 transition-opacity duration-200"
                onClick={() => setIsShowChatInfo(false)}
              ></div>
              <div className="flex h-full w-full flex-col border-l border-slate-150 bg-white dark:border-navy-600 dark:bg-navy-750">
                <div className="flex h-[60px] items-center justify-between p-4">
                  <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                    Chat Info
                  </h3>
                  <Button
                    onClick={() => setIsShowChatInfo(false)}
                    className="size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                </div>
                <div className="mt-5 flex flex-col items-center">
                  <div className="avatar size-20">
                    <img
                      className="rounded-full"
                      src={
                        props.conservant.avatarUrl ||
                        "images/avatar/avatar-12.jpg"
                      }
                      alt="avatar"
                    />
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-slate-700 dark:text-navy-100">
                    {props.conservant.username}
                  </h3>
                  <p>Frontend Developer</p>
                  <div className="mt-2 flex space-x-1.5">
                    <Button className="size-10 rounded-full p-0 text-slate-600 hover:bg-slate-300/20 hover:text-primary focus:bg-slate-300/20 focus:text-primary active:bg-slate-300/25 dark:text-navy-100 dark:hover:bg-navy-300/20 dark:hover:text-accent dark:focus:bg-navy-300/20 dark:focus:text-accent dark:active:bg-navy-300/25">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </Button>
                    <Button className="size-10 rounded-full p-0 text-slate-600 hover:bg-slate-300/20 hover:text-primary focus:bg-slate-300/20 focus:text-primary active:bg-slate-300/25 dark:text-navy-100 dark:hover:bg-navy-300/20 dark:hover:text-accent dark:focus:bg-navy-300/20 dark:focus:text-accent dark:active:bg-navy-300/25">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </Button>
                    <Button className="size-10 rounded-full p-0 text-slate-600 hover:bg-slate-300/20 hover:text-primary focus:bg-slate-300/20 focus:text-primary active:bg-slate-300/25 dark:text-navy-100 dark:hover:bg-navy-300/20 dark:hover:text-accent dark:focus:bg-navy-300/20 dark:focus:text-accent dark:active:bg-navy-300/25">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
                {/* Tabs for Images and Files */}
                <div className="tabs mt-6 flex flex-col">
                  <div className="is-scrollbar-hidden overflow-x-auto px-4">
                    <div className="tabs-list flex">
                      <button
                        className={`btn shrink-0 rounded-none border-b-2 px-3 py-2 font-medium ${
                          false
                            ? "border-primary dark:border-accent text-primary dark:text-accent-light"
                            : "border-transparent hover:text-slate-800 focus:text-slate-800 dark:hover:text-navy-100 dark:focus:text-navy-100"
                        }`}
                      >
                        Images
                      </button>
                      <button
                        className={`btn shrink-0 rounded-none border-b-2 px-3 py-2 font-medium ${
                          false
                            ? "border-primary dark:border-accent text-primary dark:text-accent-light"
                            : "border-transparent hover:text-slate-800 focus:text-slate-800 dark:hover:text-navy-100 dark:focus:text-navy-100"
                        }`}
                      >
                        Files
                      </button>
                    </div>
                  </div>
                  <div className="tab-content px-4 pt-4">
                    <div>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          "images/foods/food-4.jpg",
                          "images/object/object-2.jpg",
                          "images/foods/food-11.jpg",
                          "images/foods/food-9.jpg",
                          "images/object/object-3.jpg",
                          "images/object/object-4.jpg",
                          "images/foods/food-7.jpg",
                          "images/object/object-5.jpg",
                          "images/object/object-6.jpg",
                          "images/object/object-7.jpg",
                          "images/object/object-8.jpg",
                          "images/object/object-9.jpg",
                        ].map((src, index) => (
                          <img
                            key={index}
                            className="aspect-square rounded-lg object-cover object-center"
                            src={src}
                            alt="image"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Body */}
      {messages && conversation && !loading ? (
        <div className="grow overflow-y-auto px-[calc(var(--margin-x)-.5rem)] py-5 transition-all duration-[.25s] scrollbar-sm">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="space-y-5">
              <div className="mx-4 flex items-center space-x-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-navy-500"></div>
                <p>{date}</p>
                <div className="h-px flex-1 bg-slate-200 dark:bg-navy-500"></div>
              </div>
              {msgs.map((message) => (
                <Message
                  key={message.key}
                  message={message}
                  conservant={props.conservant}
                  user={user}
                />
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex h-full justify-center items-center">
          <div class="app-preloader fixed z-50 grid h-full w-full place-content-center bg-slate-50 dark:bg-navy-900">
            <div class="app-preloader-inner relative inline-block size-48"></div>
          </div>
        </div>
      )}

      {/* Chat Footer */}
      {messages && conversation && !loading && (
        <SendMessage onSendMessage={handleSendMessage} />
      )}
    </div>
  ) : (
    <div className="chat-header relative z-10 flex h-[61px] w-full shrink-0 items-center justify-between border-b border-slate-150 bg-white px-[calc(var(--margin-x)-.5rem)] shadow-xs dark:border-navy-700 dark:bg-navy-800">
      <div className="flex items-center space-x-5">
        <div className="ml-1 size-7">
          <button className="menu-toggle cursor-pointer ml-0.5 flex size-7 flex-col justify-center space-y-1.5 text-primary outline-hidden focus:outline-hidden dark:text-accent-light/80">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div className="flex items-center space-x-4 font-inter">
          <p className="font-medium text-slate-700 line-clamp-1 dark:text-navy-100">
            Select a conversation
          </p>
        </div>
      </div>
    </div>
  );
};

export default Messages;
