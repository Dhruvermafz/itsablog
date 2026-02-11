import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Typography,
  Spin,
  message,
  Avatar as AntAvatar,
  Divider,
} from "antd";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useNavigate, useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import Avatar from "react-avatar";
import {
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useGetPostsQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} from "../../api/postApi";
import {
  useGetUserQuery,
  useFollowMutation,
  useUnfollowMutation,
} from "../../api/userApi";
import {
  useCreateCommentMutation,
  useGetPostCommentsQuery,
} from "../../api/commentApi";
import ErrorAlert from "../Extras/ErrorAlert.jsx";
import { isLoggedIn } from "../../helpers/authHelper";
import {
  FaHeart,
  FaComment,
  FaBookmark,
  FaShareAlt,
  FaEllipsisV,
  FaPaperPlane,
} from "react-icons/fa";

// Helper: Smart date formatting
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Helper: Reading time
const calculateReadTime = (content) => {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};

// Custom hook unchanged
export const useGetAuthorPostsQuery = (
  authorId,
  currentPostId,
  options = {}
) => {
  return useGetPostsQuery(
    { poster: authorId, limit: 6, sortBy: "-createdAt" },
    {
      ...options,
      selectFromResult: ({ data, ...rest }) => ({
        data: data?.data?.filter((p) => p._id !== currentPostId) ?? [],
        ...rest,
      }),
    }
  );
};

const SingleBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [commentContent, setCommentContent] = useState("");
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const user = isLoggedIn();

  const isEditMode = !!id && window.location.pathname.includes("/edit");

  const {
    data: post,
    isLoading: fetchingPost,
    error: postError,
  } = useGetPostQuery(id, { skip: !id });

  const { data: authorPosts = [], isLoading: authorPostsLoading } =
    useGetAuthorPostsQuery(post?.poster?._id, id, {
      skip: !post?.poster?._id || !id,
    });

  const { data: relatedPostsData, isLoading: fetchingRelated } =
    useGetPostsQuery(
      { category: post?.category?.slug, limit: 4, sortBy: "-createdAt" },
      { skip: !post?.category?.slug }
    );

  const { data: authorData, isLoading: fetchingAuthor } = useGetUserQuery(
    post?.poster?.username,
    { skip: !post?.poster?.username }
  );

  const { data: comments = [], isLoading: commentsLoading } =
    useGetPostCommentsQuery(id, {
      skip: !isCommentOpen || !id,
    });

  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [createComment, { isLoading: commentLoading }] =
    useCreateCommentMutation();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [follow] = useFollowMutation();
  const [unfollow] = useUnfollowMutation();

  const isOwnPost = user?._id === post?.poster?._id;

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your story..." }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none min-h-[500px] p-8 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    if (isEditMode && post && editor) {
      setFormData({ title: post.title, content: post.content });
      editor.commands.setContent(post.content);
    }
  }, [post, isEditMode, editor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      return message.error("Title and content are required");
    }

    try {
      let result;
      if (isEditMode) {
        result = await updatePost({ id, postData: formData }).unwrap();
      } else {
        result = await createPost({ ...formData, userId: user._id }).unwrap();
      }
      navigate(`/blog/${result._id || id}`);
      message.success(isEditMode ? "Post updated!" : "Post published!");
    } catch (err) {
      message.error(err?.data?.error || "Failed to save post");
    }
  };

  const handleLike = async () => {
    if (!user) return message.warning("Log in to like");
    try {
      post?.liked ? await unlikePost(id).unwrap() : await likePost(id).unwrap();
    } catch {
      message.error("Failed to like post");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return message.warning("Log in to comment");
    if (!commentContent.trim()) return;

    try {
      await createComment({ id, content: commentContent }).unwrap();
      setCommentContent("");
      message.success("Comment posted!");
    } catch {
      message.error("Failed to post comment");
    }
  };

  const handleFollow = async () => {
    if (!user) return navigate("/login");
    try {
      authorData?.isFollowing
        ? await unfollow(authorData._id).unwrap()
        : await follow(authorData._id).unwrap();
    } catch {
      message.error("Failed to update follow");
    }
  };

  // Loading & Error
  if (fetchingPost)
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  if (postError)
    return <ErrorAlert message={postError?.data?.error || "Post not found"} />;
  if (!post && id)
    return (
      <div className="text-center py-20 text-gray-500">Post not found</div>
    );

  // === EDIT MODE ===
  if (isEditMode) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Typography.Title level={2} className="mb-8 text-center">
          {isEditMode ? "Edit Your Post" : "Write a New Post"}
        </Typography.Title>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Input
              size="large"
              placeholder="Post Title..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="text-4xl font-bold border-none shadow-none focus:border-primary"
            />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="border-b p-4 flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-800">
              <Button
                size="small"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={
                  editor?.isActive("bold") ? "bg-primary text-white" : ""
                }
              >
                Bold
              </Button>
              <Button
                size="small"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={
                  editor?.isActive("italic") ? "bg-primary text-white" : ""
                }
              >
                Italic
              </Button>
              <Button
                size="small"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={
                  editor?.isActive("underline") ? "bg-primary text-white" : ""
                }
              >
                Underline
              </Button>
              {[1, 2, 3].map((l) => (
                <Button
                  key={l}
                  size="small"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: l }).run()
                  }
                  className={
                    editor?.isActive("heading", { level: l })
                      ? "bg-primary text-white"
                      : ""
                  }
                >
                  H{l}
                </Button>
              ))}
              <Button
                size="small"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                • List
              </Button>
              <Button
                size="small"
                onClick={() => {
                  const url = prompt("Enter URL");
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
              >
                Link
              </Button>
            </div>
            <EditorContent editor={editor} />
          </div>

          <div className="flex justify-end">
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={!editor}
            >
              {isEditMode ? "Update Post" : "Publish"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // === VIEW MODE ===
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Article */}
        <article className="lg:col-span-8">
          {/* Author Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <RouterLink
                to={`/u/${post.poster?.username}`}
                className="flex items-center space-x-4 group"
              >
                <Avatar
                  size="56"
                  round
                  src={authorData?.avatar}
                  name={post.poster?.username}
                  className="ring-4 ring-white dark:ring-gray-900 shadow-lg"
                />
                <div>
                  <p className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {post.poster?.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(post.createdAt)} ·{" "}
                    {calculateReadTime(post.content)}
                  </p>
                </div>
              </RouterLink>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLike}
                  className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <FaHeart
                    className={`text-2xl ${
                      post?.liked
                        ? "text-red-500 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                  <span className="ml-2 text-sm font-medium">
                    {post?.likeCount || 0}
                  </span>
                </button>
                <button
                  onClick={() => setIsCommentOpen(!isCommentOpen)}
                  className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FaComment className="text-2xl text-gray-600" />
                  <span className="ml-2 text-sm font-medium">
                    {post?.commentCount || 0}
                  </span>
                </button>
                <button className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FaBookmark className="text-2xl text-gray-600" />
                </button>
                <button className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FaShareAlt className="text-2xl text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold leading-tight mb-8 text-gray-900 dark:text-gray-100">
            {post.title}
          </h1>

          {/* Featured Image */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-2xl shadow-xl mb-12 object-cover max-h-96"
            />
          )}

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-12">
              {post.tags.map((tag) => (
                <RouterLink
                  key={tag}
                  to={`/tags/${tag}`}
                  className="px-5 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-medium hover:bg-blue-200 dark:hover:bg-blue-800/50 transition"
                >
                  #{tag}
                </RouterLink>
              ))}
            </div>
          )}

          <Divider />

          {/* Comments */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-8">
              Discussion ({post.commentCount || 0})
            </h3>

            {user ? (
              <form
                onSubmit={handleCommentSubmit}
                className="flex items-start space-x-4 mb-10"
              >
                <Avatar
                  size="48"
                  round
                  src={user.avatar}
                  name={user.username}
                />
                <div className="flex-1">
                  <Input.TextArea
                    rows={3}
                    placeholder="Add to the discussion..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="mb-3"
                  />
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={commentLoading}
                    icon={<FaPaperPlane />}
                  >
                    Post Comment
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-center py-8 text-gray-500">
                <RouterLink
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Log in
                </RouterLink>{" "}
                to join the discussion
              </p>
            )}

            {commentsLoading ? (
              <Spin />
            ) : comments.length > 0 ? (
              <div className="space-y-8">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-4">
                    <Avatar
                      size="40"
                      round
                      src={comment.commenter?.avatar}
                      name={comment.commenter?.username}
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-6 py-4">
                        <p className="font-semibold">
                          {comment.commenter?.username}
                        </p>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                          {comment.content}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No comments yet. Start the conversation!
              </p>
            )}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-10">
          {/* Author Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="px-8 pt-4 pb-8 -mt-12">
              <Avatar
                size="100"
                round
                src={authorData?.avatar}
                name={post.poster?.username}
                className="ring-8 ring-white dark:ring-gray-900 shadow-2xl"
              />
              <h3 className="mt-4 text-2xl font-bold">
                {authorData?.username || post.poster?.username}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {authorData?.followers?.length || 0} followers
              </p>
              <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {authorData?.biography || "No bio yet."}
              </p>
              {!isOwnPost && user && (
                <Button
                  type={authorData?.isFollowing ? "default" : "primary"}
                  block
                  size="large"
                  className="mt-6"
                  onClick={handleFollow}
                  loading={fetchingAuthor}
                >
                  {authorData?.isFollowing ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          </div>

          {/* More from Author */}
          {authorPosts.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-6">
                More from {post.poster?.username}
              </h3>
              <div className="space-y-4">
                {authorPosts.map((p) => (
                  <RouterLink
                    key={p._id}
                    to={`/blog/${p._id}`}
                    className="block p-5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                      {p.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(p.createdAt)}
                    </p>
                  </RouterLink>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPostsData?.data?.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Related Reading</h3>
              <div className="space-y-4">
                {relatedPostsData.data.map((p) => (
                  <RouterLink
                    key={p._id}
                    to={`/blog/${p._id}`}
                    className="flex space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-2">{p.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(p.createdAt)}
                      </p>
                    </div>
                  </RouterLink>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default SingleBlog;
