import React from "react";
import { Row, Col } from "antd";

const HorizontalStack = ({ children, gutter = 8, style, ...props }) => {
  const wrappedChildren = React.Children.map(children, (child, index) => (
    <Col key={index}>{child}</Col>
  ));

  return (
    <Row align="middle" gutter={gutter} style={style} {...props}>
      {wrappedChildren}
    </Row>
  );
};

export default HorizontalStack;
