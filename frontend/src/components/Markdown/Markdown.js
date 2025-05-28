import React from "react";
import { Typography } from "antd";
import ReactMarkdown from "react-markdown";

const { Paragraph } = Typography;

const Markdown = ({ content }) => {
  const disallowed = ["Image"];

  return (
    <Paragraph>
      <ReactMarkdown
        className="markdown"
        style={{ "&p": { margin: 0 } }}
        disallowedElements={disallowed}
        skipHtml
        children={content}
      />
    </Paragraph>
  );
};

export default Markdown;
