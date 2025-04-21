import { Card, Typography } from "antd";
import styles from "./NewsRoom.module.css";

const { Paragraph } = Typography;

const ArticleCard = ({ article }) => (
  <Card
    hoverable
    cover={
      <img
        alt={article.title}
        src={article.image}
        className={styles.cardImage}
      />
    }
    className={styles.articleCard}
  >
    <Paragraph className={styles.category}>{article.category}</Paragraph>
    <Typography.Title level={5}>{article.title}</Typography.Title>
    <Paragraph className={styles.meta}>
      By {article.author} • {article.readTime}
    </Paragraph>
  </Card>
);

export default ArticleCard;
