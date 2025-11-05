import React, { useState, useEffect } from "react";
import { Card, Input, Button, Typography, Spin, message } from "antd";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
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

// Helper: Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Helper: Estimate read time
const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};

// Custom hook for author posts
export const useGetAuthorPostsQuery = (
  authorId,
  currentPostId,
  options = {}
) => {
  return useGetPostsQuery(
    {
      poster: authorId,
      limit: 6,
      sortBy: "-createdAt",
    },
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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [serverError, setServerError] = useState("");
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const user = isLoggedIn();

  const isUpdateMode = !!id && window.location.pathname.includes("/edit");

  // Fetch post
  const {
    data: post,
    isLoading: fetchingPost,
    error: postError,
  } = useGetPostQuery(id, { skip: !id });

  // Fetch author posts
  const { data: authorPosts = [], isLoading: authorPostsLoading } =
    useGetAuthorPostsQuery(post?.poster?._id, id, {
      skip: !post?.poster?._id || !id,
    });

  const isOwnPost = user?._id === post?.poster?._id;

  // Fetch related posts
  const {
    data: relatedPostsData,
    isLoading: fetchingRelatedPosts,
    error: relatedPostsError,
  } = useGetPostsQuery(
    {
      category: post?.category?.slug,
      limit: 3,
      sortBy: "-createdAt",
    },
    { skip: !post?.category?.slug }
  );

  // Fetch author
  const {
    data: authorData,
    isLoading: fetchingAuthor,
    error: authorError,
  } = useGetUserQuery(post?.poster?.username, {
    skip: !post?.poster?.username,
  });

  // Fetch comments
  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useGetPostCommentsQuery(id, {
    skip: !isCommentSectionOpen || !id,
  });

  // Mutations
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [createComment, { isLoading: commentLoading }] =
    useCreateCommentMutation();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [follow] = useFollowMutation();
  const [unfollow] = useUnfollowMutation();

  // === TIPTAP EDITOR (Edit Mode Only) ===
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write your post content..." }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none min-h-[300px] p-3 focus:outline-none border rounded-lg",
      },
    },
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Populate editor in edit mode
  useEffect(() => {
    if (isUpdateMode && post && editor) {
      setFormData({
        title: post.title || "",
        content: post.content || "",
      });
      editor.commands.setContent(post.content || "");
    }
  }, [post, isUpdateMode, editor]);

  // Handle errors
  useEffect(() => {
    const error =
      postError || relatedPostsError || authorError || commentsError;
    if (error) {
      setServerError(error?.data?.error || "Something went wrong");
    }
  }, [postError, relatedPostsError, authorError, commentsError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      message.error("Title and content are required");
      return;
    }

    setLoading(true);
    const postData = {
      title: formData.title,
      content: formData.content,
      userId: user?._id,
      category: post?.category?.slug || "default",
    };

    try {
      let result;
      if (isUpdateMode) {
        result = await updatePost({ id, postData }).unwrap();
      } else {
        result = await createPost(postData).unwrap();
      }
      navigate(`/blog/${result._id || id}`);
    } catch (err) {
      setServerError(err?.data?.error || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) return navigate("/login");
    try {
      authorData?.isFollowing
        ? await unfollow(authorData._id).unwrap()
        : await follow(authorData._id).unwrap();
    } catch (err) {
      setServerError("Failed to update follow status");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return message.error("Please log in to comment.");
    if (!commentContent.trim())
      return message.error("Comment cannot be empty.");

    try {
      await createComment({ id, content: commentContent }).unwrap();
      message.success("Comment posted!");
      setCommentContent("");
    } catch (err) {
      message.error("Failed to post comment");
    }
  };

  const handleLike = async () => {
    if (!user) return message.error("Please log in to like.");
    try {
      post?.liked ? await unlikePost(id).unwrap() : await likePost(id).unwrap();
    } catch (err) {
      message.error("Failed to update like");
    }
  };

  // === TIPTAP TOOLBAR ===
  const MenuBar = () => {
    if (!editor) return null;
    return (
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 dark:bg-navy-700">
        {["Bold", "Italic", "Underline"].map((style) => (
          <Button
            key={style}
            size="small"
            onClick={() => editor.chain().focus()[`toggle${style}`]().run()}
            className={
              editor.isActive(style.toLowerCase())
                ? "bg-primary text-white"
                : ""
            }
          >
            {style === "Bold" ? (
              <b>B</b>
            ) : style === "Italic" ? (
              <i>I</i>
            ) : (
              <u>U</u>
            )}
          </Button>
        ))}
        {[1, 2, 3].map((level) => (
          <Button
            key={level}
            size="small"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
            className={
              editor.isActive("heading", { level })
                ? "bg-primary text-white"
                : ""
            }
          >
            H{level}
          </Button>
        ))}
        {["bulletList", "orderedList"].map((list) => (
          <Button
            key={list}
            size="small"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive(list) ? "bg-primary text-white" : ""}
          >
            {list === "bulletList" ? "•" : "1."} List
          </Button>
        ))}
        <Button
          size="small"
          onClick={() => {
            const url = window.prompt("URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          Link
        </Button>
      </div>
    );
  };

  // === RENDER LOADING / ERROR ===
  if (fetchingPost && id)
    return <Spin size="large" className="flex justify-center p-10" />;
  if (serverError) return <ErrorAlert message={serverError} />;

  // === EDIT MODE (with TipTap) ===
  if (isUpdateMode) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card title="Edit Post">
          <form onSubmit={handleSubmit}>
            <Typography.Title level={5}>Title</Typography.Title>
            <Input
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter post title"
              className="mb-4"
            />

            <Typography.Title level={5}>Content</Typography.Title>
            <div className="border rounded-lg overflow-hidden mb-4">
              <MenuBar />
              <EditorContent editor={editor} className="tiptap-editor" />
            </div>

            <Button type="primary" htmlType="submit" loading={loading}>
              Update Post
            </Button>
          </form>
          {serverError && <ErrorAlert message={serverError} />}
        </Card>
      </div>
    );
  }

  // === VIEW MODE (unchanged) ===
  if (!post && id) return <div>Post not found</div>;

  return (
    <div className="grid grid-cols-12 lg:gap-6">
      {/* Main Content */}
      <div className="col-span-12 pt-6 lg:col-span-8 lg:pb-6">
        <div className="card p-4 lg:p-6">
          {/* Author Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar
                name={post.poster?.username}
                src={authorData?.avatar}
                size="48"
                round={true}
                className="mask is-squircle"
              />
              <div>
                <a
                  href={`/profile/${post.poster?.username}`}
                  className="font-medium hover:text-primary"
                >
                  {post.poster?.username}
                </a>
                <div className="mt-1.5 flex items-center text-xs">
                  <span>{formatDate(post.createdAt)}</span>
                  <div className="mx-2 w-px h-4 bg-gray-300"></div>
                  <span>{calculateReadTime(post.content)}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleLike}
                className={`btn size-8 rounded-full p-0 ${
                  post.liked ? "text-secondary" : ""
                }`}
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              {user && (isOwnPost || user.role === "admin") && (
                <div className="inline-flex">
                  <button className="btn size-8 rounded-full p-0">
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                  <div className="popper-root">
                    <div className="popper-box rounded-md border bg-white py-1.5 dark:bg-navy-700">
                      <ul>
                        <li>
                          <a
                            href={`/blog/${id}/edit`}
                            className="block px-3 py-1 hover:bg-gray-100"
                          >
                            Edit Post
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-3 py-1 hover:bg-gray-100"
                          >
                            Delete Post
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="mt-4 whitespace-pre-wrap text-base leading-relaxed">
              {post.content.split("\n").map((p, i) => (
                <p key={i} className="mb-4">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Like & Comment Buttons */}
          <div className="mt-5 flex space-x-3">
            <button
              onClick={handleLike}
              className={`btn rounded-full border px-4 ${
                post.liked ? "text-secondary" : ""
              }`}
            >
              <svg
                className="size-4.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
              </svg>
              <span>{post.likeCount || 0}</span>
            </button>
            <button
              onClick={() => setIsCommentSectionOpen(!isCommentSectionOpen)}
              className="btn rounded-full border px-4"
            >
              <svg
                className="size-4.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
              </svg>
              <span>{post.commentCount || 0}</span>
            </button>
          </div>

          {/* Comment Section */}
          {isCommentSectionOpen && (
            <div className="mt-5 border-t pt-4">
              {user ? (
                <form onSubmit={handleCommentSubmit} className="flex mb-4">
                  <Input
                    placeholder="Write a comment..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={commentLoading}
                    className="ml-2"
                  >
                    Send
                  </Button>
                </form>
              ) : (
                <p className="mb-4">
                  Please{" "}
                  <a href="/login" className="text-primary">
                    log in
                  </a>{" "}
                  to comment.
                </p>
              )}
              {commentsLoading ? (
                <p>Loading comments...</p>
              ) : comments?.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div key={c._id} className="flex space-x-3">
                      <Avatar
                        size="32"
                        round
                        src={c.commenter?.avatar}
                        name={c.commenter?.username}
                      />
                      <div>
                        <p className="font-medium">{c.commenter?.username}</p>
                        <p className="text-sm">{c.content}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(c.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Related Posts */}
        <div className="mt-6">
          <div className="flex justify-between">
            <p className="font-medium">Related Articles</p>
            <a href="/blog" className="text-primary text-sm">
              View All
            </a>
          </div>
          {fetchingRelatedPosts ? (
            <p>Loading...</p>
          ) : relatedPostsData?.data?.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {relatedPostsData.data.map((p) => (
                <div key={p._id} className="card flex">
                  <img
                    src={p.image || "/placeholder.jpg"}
                    className="w-32 h-32 object-cover rounded-l"
                  />
                  <div className="p-3 flex-1">
                    <a
                      href={`/blog/${p._id}`}
                      className="font-medium hover:text-primary"
                    >
                      {p.title}
                    </a>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {p.content.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No related posts.</p>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="col-span-12 py-6 lg:col-span-4">
        <div className="card">
          <img
            src={authorData?.banner || "/banner.jpg"}
            className="h-24 w-full object-cover rounded-t"
          />
          <div className="p-4 -mt-12">
            <Avatar
              name={authorData?.username || post.poster?.username}
              src={authorData?.avatar}
              size="80"
              round
              className="border-4 border-white"
            />
            <h3 className="mt-2 font-medium">
              {authorData?.username || post.poster?.username}
            </h3>
            <p className="text-sm text-gray-600">
              {authorData?.biography?.substring(0, 50)}... |{" "}
              {authorData?.followers?.length || 0} followers
            </p>
            <p className="mt-3 text-sm">{authorData?.biography || "No bio."}</p>
            <div className="mt-4 flex gap-2">
              {!isOwnPost && (
                <Button
                  size="small"
                  onClick={handleFollowToggle}
                  disabled={fetchingAuthor}
                >
                  {authorData?.isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* More from Author */}
        <div className="mt-6">
          <p className="font-medium border-b pb-2">
            More from {authorData?.username}
          </p>
          {authorPostsLoading ? (
            <p>Loading...</p>
          ) : authorPosts.length > 0 ? (
            <div className="mt-4 space-y-3">
              {authorPosts.map((p) => (
                <a
                  key={p._id}
                  href={`/blog/${p._id}`}
                  className="block p-3 border rounded hover:bg-gray-50"
                >
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(p.createdAt)}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <p>No other posts.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
