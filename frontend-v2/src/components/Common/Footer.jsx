import { Typography, Row, Col } from "antd";

const { Text } = Typography;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-navy-800 border-t border-slate-200 dark:border-navy-700">
      <div className="container mx-auto px-6 py-12">
        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-navy-700">
          <Row justify="space-between" align="middle">
            <Col xs={24} md={12}>
              <Text className="text-slate-500 dark:text-navy-400 text-sm">
                © {currentYear} ItsABlog.
              </Text>
            </Col>
            <Col xs={24} md={12} className="text-right">
              <Text className="text-slate-500 dark:text-navy-400 text-sm">
                Made with <span className="text-red-500">❤️</span> by{" "}
                <a
                  href="https://dhruvermafz.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary dark:text-accent hover:underline font-medium"
                >
                  Dhruv Verma
                </a>
              </Text>
            </Col>
          </Row>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
