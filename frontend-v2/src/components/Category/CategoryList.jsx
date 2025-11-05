import React, { useMemo, useState } from "react";
import { Card, Input, Skeleton, Space, Typography, Empty, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useCreateCategoryMutation,
} from "../../api/categoriesApi";

const { Title } = Typography;
const { Search } = Input;

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // ---- RTK-Query hooks -------------------------------------------------
  // ---- RTK-Query hooks -------------------------------------------------
  const {
    data = { data: [], count: 0 },
    isLoading,
    isError,
    error,
  } = useGetCategoriesQuery();

  // Extract the actual array
  const categories = data.data || [];
  // (optional) admin mutations – keep them if you want inline edit/delete
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [createCategory] = useCreateCategoryMutation();

  // ---- Group & filter --------------------------------------------------
  const groupedCategories = useMemo(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = {};
    filtered.forEach((cat) => {
      const letter = cat.name.charAt(0).toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(cat);
    });

    return Object.keys(grouped)
      .sort()
      .reduce((acc, letter) => ({ ...acc, [letter]: grouped[letter] }), {});
  }, [categories, searchTerm]);

  // ---- Handlers --------------------------------------------------------
  const handleCategoryClick = (catName) => {
    navigate(`/blogs/search?category=${encodeURIComponent(catName)}`);
  };

  // (optional) admin delete – you can hide these buttons in non-admin view
  const handleDelete = async (slug) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(slug).unwrap();
      message.success("Category deleted");
    } catch {
      message.error("Failed to delete category");
    }
  };

  // ------------------------------------------------------------------------
  if (isError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Title level={3} className="text-red-500">
          {error?.data?.message || "Something went wrong"}
        </Title>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ---------- Header ---------- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <Title
            level={1}
            className="text-white !text-4xl md:!text-5xl font-bold !m-0"
          >
            Categories
          </Title>

          <Search
            placeholder="Search category"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={(v) => setSearchTerm(v)}
            className="md:w-80"
            style={{ borderRadius: "50px" }}
            inputStyle={{
              backgroundColor: "#1a1a1a",
              color: "#fff",
              border: "none",
            }}
          />
        </div>

        {/* ---------- Loading Skeleton ---------- */}
        {isLoading && (
          <div className="space-y-12">
            {["A", "B", "C"].map((letter) => (
              <div key={letter} className="space-y-4">
                <Skeleton active paragraph={false} title={{ width: 40 }} />
                <Space wrap size={[16, 16]}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton.Button
                      key={i}
                      active
                      style={{ width: 140, height: 44, borderRadius: 50 }}
                    />
                  ))}
                </Space>
              </div>
            ))}
          </div>
        )}

        {/* ---------- Categories Grid ---------- */}
        {!isLoading && Object.keys(groupedCategories).length === 0 && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              searchTerm
                ? `No categories match "${searchTerm}"`
                : "No categories available."
            }
            className="mt-20"
          />
        )}

        {!isLoading && (
          <div className="space-y-12">
            {Object.entries(groupedCategories).map(([letter, cats]) => (
              <div key={letter} className="space-y-4">
                {/* Letter */}
                <Title
                  level={2}
                  className="text-white !text-3xl md:!text-4xl font-bold !m-0 pl-2"
                >
                  {letter}
                </Title>

                {/* Pills */}
                <Space wrap size={[16, 16]} className="pl-2">
                  {cats.map((cat) => (
                    <Card
                      key={cat.id}
                      hoverable
                      onClick={() => handleCategoryClick(cat.name)}
                      className="bg-[#1a1a1a] border-none cursor-pointer transition-all duration-200 hover:bg-[#2a2a2a] hover:shadow-lg"
                      bodyStyle={{
                        padding: "12px 20px",
                        borderRadius: "50px",
                      }}
                    >
                      <span className="text-white font-medium text-sm md:text-base">
                        {cat.name}
                      </span>

                      {/* ---- OPTIONAL ADMIN ACTIONS (hide with CSS if needed) ---- */}
                      {/* <div className="float-right ml-2">
                        <Button
                          size="small"
                          type="text"
                          icon={<EditOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            // open edit modal – omitted for brevity
                          }}
                        />
                        <Button
                          size="small"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(cat.slug);
                          }}
                        />
                      </div> */}
                    </Card>
                  ))}
                </Space>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Custom Antd Overrides ---------- */}
      <style jsx>{`
        /* Search bar rounded */
        .ant-input-group-wrapper {
          border-radius: 50px !important;
        }
        .ant-input-search
          > .ant-input-group
          > .ant-input-group-addon:last-child {
          background: #1a1a1a !important;
          border: none !important;
          border-radius: 0 50px 50px 0 !important;
        }
        .ant-input-search
          > .ant-input-group
          > .ant-input-group-addon:last-child
          .ant-btn {
          background: transparent !important;
          border: none !important;
          color: #888 !important;
        }
        .ant-input-search
          > .ant-input-group
          > .ant-input-group-addon:last-child
          .ant-btn:hover {
          color: #fff !important;
        }

        /* Card hover lift */
        .ant-card-hoverable:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default CategoriesPage;
