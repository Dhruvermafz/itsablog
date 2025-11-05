import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Typography,
  Input,
  Space,
  Button,
  Card,
  Avatar,
  List,
  Skeleton,
} from "antd";
import {
  HomeOutlined,
  UsergroupAddOutlined,
  CompassOutlined,
  HeartOutlined,
  MessageOutlined,
  MoreOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  useGetAllGroupsQuery,
  useSearchGroupsQuery,
  useGetPopularGroupsQuery,
  useGetMyGroupsQuery,
} from "../../api/groupApi";
import GroupFilters from "./GroupFilters";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const GroupFeed = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feed");
  const [postContent, setPostContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ category: "All", sort: "new" });

  // RTK Queries
  const { data: groups = [], isLoading: loading } = useGetAllGroupsQuery();
  const { data: searchResults = [] } = useSearchGroupsQuery(searchQuery, {
    skip: !searchQuery,
  });
  const { data: popularGroups = [], isLoading: popularLoading } =
    useGetPopularGroupsQuery();
  const { data: myGroups = [], isLoading: myGroupsLoading } =
    useGetMyGroupsQuery();

  // Handle filter change
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Derive filtered groups using useMemo (no side effects)
  const filteredGroups = useMemo(() => {
    const base = searchQuery ? searchResults : groups;
    let result = [...base];

    // Apply category filter
    if (filters.category !== "All") {
      result = result.filter((group) => group.category === filters.category);
    }

    // Apply sort
    if (filters.sort === "popular") {
      result.sort((a, b) => b.members.length - a.members.length);
    } else if (filters.sort === "new") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [groups, searchResults, searchQuery, filters]);

  const sidebarItems = [
    { key: "feed", label: "Feed", icon: <HomeOutlined /> },
    { key: "following", label: "Following", icon: <UsergroupAddOutlined /> },
    { key: "discover", label: "Discover", icon: <CompassOutlined /> },
  ];

  const mockPosts = [
    {
      id: 1,
      author: { name: "Ironman3000", avatar: "/images/avatar1.jpg" },
      club: "Indian Cinema",
      time: "2 mins ago",
      content:
        "@mts fuck man, spoiler show is now so fucking cool, keep working like this",
      likes: 0,
      comments: 1,
    },
    {
      id: 2,
      author: { name: "kartik785", avatar: "/images/avatar2.jpg" },
      club: "Indian Cinema",
      time: "4 mins ago",
      content: "@Bhaijaan @lamsrk do bhai dono tabahi [fire]",
      likes: 0,
      comments: 0,
    },
  ];

  const discoverCommunities = [
    {
      id: 1,
      name: "Film-Making",
      description:
        "A space for people who love turning ideas into scenes and scenes into stories. Whether you're into...",
      image: "/images/clubs/film-making.jpg",
      joined: true,
    },
    {
      id: 2,
      name: "Bookworm",
      description:
        "A place for book lovers to share their finds and seek new book recommendations",
      image: "/images/clubs/bookworm.jpg",
      joined: true,
    },
    {
      id: 3,
      name: "Game of Thrones Universe",
      description:
        "A space to explore Westeros and beyond where we talk about dragons houses and every tale...",
      image: "/images/clubs/got.jpg",
      joined: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Row gutter={[24, 24]} className="p-4 lg:p-6">
          {/* Sidebar */}
          <Col xs={0} lg={6}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-1 sticky top-6">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    activeTab === item.key
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}

              <div className="my-6">
                <Text className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  YOUR CLUBS
                </Text>
              </div>

              {myGroupsLoading ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : (
                myGroups.slice(0, 5).map((group) => (
                  <div
                    key={group._id}
                    className="flex items-center space-x-3 py-2 px-1 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => navigate(`/group/${group._id}`)}
                  >
                    <Avatar
                      src={group.image || "/images/groups/default.jpg"}
                      size={36}
                      className="border border-gray-200"
                    />
                    <Text className="font-medium text-gray-800 line-clamp-1">
                      {group.name}
                    </Text>
                  </div>
                ))
              )}
            </div>
          </Col>

          {/* Main Content */}
          <Col xs={24} lg={18}>
            {activeTab === "feed" && (
              <div className="space-y-6">
                {/* Post Composer */}
                <Card className="rounded-xl shadow-sm border border-gray-200">
                  <div className="flex space-x-3">
                    <Avatar
                      src="/images/avatar/me.jpg"
                      size={48}
                      className="border border-gray-200"
                    />
                    <div className="flex-1">
                      <Text className="block text-sm text-gray-600 mb-1">
                        Dhruv Verma
                      </Text>
                      <TextArea
                        placeholder="What's on your mind, Dhruv?"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        className="mb-3"
                      />
                      <div className="flex items-center justify-between">
                        <Space size={12}>
                          <Button type="text" icon={<MessageOutlined />} />
                          <Button type="text" icon={<HeartOutlined />} />
                          <Button type="text" icon={<MoreOutlined />} />
                        </Space>
                        <Button
                          type="primary"
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={!postContent.trim()}
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Feed Posts */}
                <div className="space-y-4">
                  {mockPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="rounded-xl shadow-sm border border-gray-200"
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar src={post.author.avatar} size={40} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <Text strong className="text-gray-900">
                                {post.author.name}
                              </Text>
                              <Text className="text-xs text-gray-500 ml-1">
                                → {post.club}
                              </Text>
                              <Text className="text-xs text-gray-500 block">
                                Posted {post.time}
                              </Text>
                            </div>
                            <Button type="text" icon={<MoreOutlined />} />
                          </div>
                          <Text className="block mt-2 text-gray-800">
                            {post.content}
                          </Text>
                          <div className="flex items-center space-x-6 mt-3 text-gray-600">
                            <Button
                              type="text"
                              icon={<HeartOutlined />}
                              size="small"
                            >
                              {post.likes}
                            </Button>
                            <Button
                              type="text"
                              icon={<MessageOutlined />}
                              size="small"
                            >
                              {post.comments}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "discover" && (
              <div className="space-y-6">
                <div>
                  <Title level={3} className="text-gray-900 !mt-0">
                    Discover
                  </Title>
                  <Text className="text-gray-600">
                    Explore new communities and trending content
                  </Text>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    allowClear
                  />
                  <GroupFilters
                    filters={filters}
                    onChange={handleFilterChange}
                  />
                </div>

                {/* Loading State */}
                {loading && <Skeleton active paragraph={{ rows: 6 }} />}

                {/* Communities Grid */}
                <Row gutter={[16, 16]}>
                  {filteredGroups.map((group) => (
                    <Col xs={24} sm={12} lg={8} key={group._id}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt={group.name}
                            src={group.image || "/images/groups/default.jpg"}
                            className="h-48 object-cover rounded-t-xl"
                          />
                        }
                        className="rounded-xl overflow-hidden shadow-sm"
                        onClick={() => navigate(`/group/${group._id}`)}
                      >
                        <div className="p-4">
                          <Title
                            level={5}
                            className="text-gray-900 !mt-0 !mb-2 line-clamp-1"
                          >
                            {group.name}
                          </Title>
                          <Text className="text-gray-600 text-sm line-clamp-2">
                            {group.description || "No description"}
                          </Text>
                          <div className="flex items-center justify-between mt-3">
                            <Text className="text-xs text-gray-500">
                              {group.members?.length || 0} members
                            </Text>
                            <Button
                              type="primary"
                              size="small"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Join
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {filteredGroups.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <Text type="secondary">No groups found.</Text>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GroupFeed;
