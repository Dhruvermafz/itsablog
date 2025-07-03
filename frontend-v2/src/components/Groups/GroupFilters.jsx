import { Card, Select, Radio, Typography } from "antd";
import styles from "./Group.module.css";

const { Title } = Typography;
const { Option } = Select;

const GroupFilters = ({ onFilterChange }) => {
  const categories = [
    "All",
    "Literature",
    "Politics",
    "Cinema",
    "Society",
    "Tech",
    "General",
  ];

  const handleCategoryChange = (value) => {
    onFilterChange({ category: value });
  };

  const handleSortChange = (e) => {
    onFilterChange({ sort: e.target.value });
  };

  return (
    <Card className={styles.filtersCard} bordered={false}>
      <Title level={5} className={styles.filterTitle}>
        Filter Communities
      </Title>
      <div className={styles.filterSection}>
        <Typography.Text strong>Category</Typography.Text>
        <Select
          defaultValue="All"
          className={styles.select}
          onChange={handleCategoryChange}
          size="large"
        >
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      </div>
      <div className={styles.filterSection}>
        <Typography.Text strong>Sort By</Typography.Text>
        <Radio.Group
          defaultValue="popular"
          buttonStyle="solid"
          onChange={handleSortChange}
          size="large"
        >
          <Radio.Button value="popular">Popular</Radio.Button>
          <Radio.Button value="new">New</Radio.Button>
          <Radio.Button value="active">Most Active</Radio.Button>
        </Radio.Group>
      </div>
    </Card>
  );
};

export default GroupFilters;
