import { Card, Select, Radio, Typography } from "antd";
import styles from "./NewsRoom.module.css";

const { Title } = Typography;
const { Option } = Select;

const NewsroomFilters = () => {
  const categories = [
    "All",
    "Politics",
    "Society",
    "Cinema",
    "Literature",
    "Tech",
  ];

  return (
    <Card className={styles.filtersCard} bordered={false}>
      <Title level={5} className={styles.filterTitle}>
        Filter Articles
      </Title>
      <div className={styles.filterSection}>
        <Typography.Text strong>Category</Typography.Text>
        <Select defaultValue="All" className={styles.select}>
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      </div>
      <div className={styles.filterSection}>
        <Typography.Text strong>Sort By</Typography.Text>
        <Radio.Group defaultValue="recent" buttonStyle="solid">
          <Radio.Button value="recent">Recent</Radio.Button>
          <Radio.Button value="trending">Trending</Radio.Button>
          <Radio.Button value="popular">Popular</Radio.Button>
        </Radio.Group>
      </div>
    </Card>
  );
};

export default NewsroomFilters;
