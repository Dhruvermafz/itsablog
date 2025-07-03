import React from "react";
import { Pagination as AntPagination } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "./pagination.css";

const Pagination = ({
  totalItems = 0,
  currentPage = 1,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  onPageChange = () => {},
  showSizeChanger = true,
  showQuickJumper = false,
  showTotal = (total) => `Total ${total} items`,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (page, newPageSize) => {
    // Update parent component
    onPageChange(page, newPageSize);

    // Update URL with new page and pageSize (if changed)
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page);
    if (newPageSize !== pageSize) {
      searchParams.set("pageSize", newPageSize);
    }
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="pagination-wrapper">
      <AntPagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        showSizeChanger={showSizeChanger}
        showQuickJumper={showQuickJumper}
        showTotal={showTotal}
        onChange={handleChange}
        onShowSizeChange={(current, size) => handleChange(1, size)} // Reset to page 1 on size change
        className="custom-pagination"
      />
    </div>
  );
};

export default Pagination;
