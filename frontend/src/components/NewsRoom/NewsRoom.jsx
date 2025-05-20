import React from "react";
import { Button, Card, Select, Avatar } from "antd";
import {
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./index.css";

const { Option } = Select;

const NewsroomPage = () => {
  return (
    <div className="newsroom">
      <div className="content">
        {/* Page Title */}
        <h1 className="title">Newsroom</h1>

        {/* Filters Card */}
        <div className="filtersCard">
          <h2 className="filterTitle">Filters</h2>
          <div className="filterSection">
            <Select
              className="select"
              placeholder="Select Category"
              style={{ width: "100%" }}
            >
              <Option value="politics">Politics</Option>
              <Option value="society">Society</Option>
              <Option value="history">History</Option>
              <Option value="tech">Tech</Option>
            </Select>
          </div>
        </div>

        {/* Admin Controls */}
        <div className="adminControls">
          <Button type="primary" icon={<FilterOutlined />}>
            Review Posts
          </Button>
          <Button icon={<EditOutlined />}>Manage Reports</Button>
          <Button icon={<DeleteOutlined />}>Delete Flagged</Button>
        </div>

        {/* Articles */}
        <div className="articles">
          {newsroomArticles.map((article) => (
            <Card key={article.id} className="articleCard">
              <img
                className="cardImage"
                src={article.image}
                alt={article.title}
              />
              <div style={{ padding: "16px" }}>
                <span className="category">{article.category}</span>
                <h3>{article.title}</h3>
                <div className="meta">
                  <span>
                    By {article.author} | {article.date}
                  </span>
                  <span>{article.readingTime}</span>
                  <span>{article.karmaPoints} Karma</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Writer Spotlight */}
        <div className="writerSpotlight">
          <div className="writerHeader">
            <Avatar className="avatar" src={writerSpotlight.avatar} />
            <h2 className="writerName">{writerSpotlight.name}</h2>
          </div>
          <p className="bio">{writerSpotlight.bio}</p>
          <div className="stats">
            <span>Posts: {writerSpotlight.posts}</span>
            <span>Karma: {writerSpotlight.karma}</span>
          </div>
          <Button className="profileButton">View Profile</Button>
        </div>
      </div>
    </div>
  );
};

export default NewsroomPage;
