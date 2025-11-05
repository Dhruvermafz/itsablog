const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([
    { id: 1, name: "Technology" },
    { id: 2, name: "Health" },
    { id: 3, name: "Education" },
  ]);
  const [tags, setTags] = useState([
    { id: 1, name: "Wellness" },
    { id: 2, name: "Fitness" },
    { id: 3, name: "TechTrends" },
  ]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const pageSize = 8;
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Mock data for posts
  const mockPosts = [
    {
      id: 1,
      category: "Health",
      categoryColor: "blue",
      title: "Helpful Tips for Working from Home as a Freelancer",
      link: "/single",
      image: "/images/news-13.jpg",
      date: "7 August",
      readTime: "11 mins read",
      views: "3k views",
      isFeatured: true,
      tags: ["Wellness", "Fitness"],
    },
    {
      id: 2,
      category: "Health",
      categoryColor: "green",
      title: "10 Easy Ways to Be Environmentally Conscious At Home",
      link: "/single",
      image: "/images/news-4.jpg",
      date: "27 Sep",
      readTime: "10 mins read",
      views: "22k views",
      tags: ["Wellness"],
    },
    {
      id: 3,
      category: "Technology",
      categoryColor: "warning",
      title: "My Favorite Comfies to Lounge in At Home",
      link: "/single",
      image: "/images/news-2.jpg",
      date: "7 August",
      readTime: "9 mins read",
      views: "12k views",
      tags: ["TechTrends"],
    },
  ];

  const popularPosts = [
    {
      id: 1,
      title: "Spending Some Quality Time with Kids? It’s Possible",
      link: "/single",
      image: "/images/thumb-6.jpg",
      date: "05 August",
      views: "150 views",
    },
  ];

  const instagramImages = [
    { src: "/images/thumb-1.jpg", link: "/assets/imgs/thumbnail-3.jpg" },
  ];

  // Parse query params for pagination
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    setCurrentPage(page);
  }, [location.search]);

  // Fetch posts (mock API call)
  const fetchPosts = useCallback(
    debounce(() => {
      setLoading(true);
      setTimeout(() => {
        let filteredPosts = mockPosts.filter(
          (post) => post.category.toLowerCase() === category.toLowerCase()
        );
        if (selectedTags.length > 0) {
          filteredPosts = filteredPosts.filter((post) =>
            post.tags.some((tag) => selectedTags.includes(tag))
          );
        }
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setPosts(filteredPosts.slice(startIndex, endIndex));
        setTotalPosts(filteredPosts.length);
        setLoading(false);
      }, 500);
    }, 300),
    [category, currentPage, selectedTags]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/category/${category}?page=${page}`);
  };

  const handleTagChange = (value) => {
    setSelectedTags(value);
    setCurrentPage(1); // Reset to first page when tags change
  };

  return (
    <div className="page-wrapper">
      <div className="content container">
        <div className="archive-header">
          <div className="main__breadcrumbs breadcrumbs">
            <Breadcrumb className="breadcrumbs__list">
              <Breadcrumb.Item>
                <a
                  href="/"
                  className="breadcrumbs__list-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/");
                  }}
                >
                  Home
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item className="breadcrumbs__list-text">
                {category}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <Title level={2} className="blog-section-box-content__title">
            {category}
          </Title>
          <div className="border-line"></div>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Form layout="inline">
              <Form.Item label="Filter by Tags">
                <Select
                  mode="multiple"
                  placeholder="Select tags"
                  value={selectedTags}
                  onChange={handleTagChange}
                  className="shop-section__filters-select"
                  allowClear
                >
                  {tags.map((tag) => (
                    <Select.Option key={tag.id} value={tag.name}>
                      {tag.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "right" }}>
            <Button
              className="btn btn-primary"
              onClick={() => setIsModalVisible(true)}
            >
              Manage Categories & Tags
            </Button>
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <div className="post-list">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))
                ) : (
                  <p className="blog-section-box-content__text">
                    No posts found for this category.{" "}
                    <a href="/blog" className="card__link">
                      Browse all posts
                    </a>
                  </p>
                )}
              </div>
              <Pagination
                current={currentPage}
                total={totalPosts}
                pageSize={pageSize}
                onChange={handlePageChange}
                className="shop-section__pagination"
                showSizeChanger={false}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} posts`
                }
              />
            </Col>
            <Col xs={24} lg={8}>
              <div className="widget-area">
                <AuthorWidget />
                <div className="popular-posts-widget">
                  <h5 className="blog-section-box-content__subtitle">
                    Popular Posts
                  </h5>
                  {popularPosts.map((post) => (
                    <div key={post.id} className="popular-post-item">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="popular-post-img"
                      />
                      <div>
                        <a
                          href={post.link}
                          className="card__title"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(post.link);
                          }}
                        >
                          {post.title}
                        </a>
                        <p className="blog-section-box-content__text">
                          {post.date} • {post.views}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <InstagramWidget images={instagramImages} />
              </div>
            </Col>
          </Row>
        </Spin>

        <Modal
          title="Manage Categories & Tags"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          className="manager-modal"
          width={800}
        >
          <CategoriesTagsManager
            categories={categories}
            setCategories={setCategories}
            tags={tags}
            setTags={setTags}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoryPage;
