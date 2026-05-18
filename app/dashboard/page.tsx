"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

type Message = {
  role: "user" | "ai";
  text: string;
};

type Notification = {
  id: number;
  text: string;
};

type Post = {
  id?: number;
  user_id?: string;

  author: string;
  avatar: string;
  bio: string;
  content: string;

  likes: number;
  liked: boolean;

  followed: boolean;
  followers: number;

  comments: string[];

  saved: boolean;

  created_at?: string;
};

export default function DashboardPage() {

  const [darkMode, setDarkMode] = useState(true);

  const [postInput, setPostInput] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [posts, setPosts] = useState<Post[]>([]);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello 👋 Welcome to AI Interest Platform.",
    },
  ]);

  const [aiInput, setAiInput] = useState("");

  const [currentUserEmail, setCurrentUserEmail] =
    useState("");

  useEffect(() => {

    fetchPosts();

    getCurrentUser();

  }, []);

  async function getCurrentUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setCurrentUserEmail(user.email || "");
    }
  }

  async function fetchPosts() {

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setPosts(data);
    }
  }

  function addNotification(text: string) {

    const newNotification = {
      id: Date.now(),
      text,
    };

    setNotifications((prev) => [
      newNotification,
      ...prev,
    ]);
  }

  async function createPost() {

    if (!postInput.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login");
      return;
    }

    const newPost = {

      user_id: user.id,

      author: user.email || "User",

      avatar:
        "https://i.pravatar.cc/150?img=45",

      bio: "AI Creator",

      content: postInput,

      likes: 0,

      liked: false,

      followed: false,

      followers: 0,

      comments: [],

      saved: false,
    };

    const { error } = await supabase
      .from("posts")
      .insert([newPost]);

    if (!error) {

      setPostInput("");

      fetchPosts();

      addNotification(
        "✅ New post created"
      );
    }
  }

  async function likePost(post: Post) {

    if (!post.id) return;

    const updatedLikes = post.liked
      ? post.likes - 1
      : post.likes + 1;

    const updatedLiked = !post.liked;

    await supabase
      .from("posts")
      .update({
        likes: updatedLikes,
        liked: updatedLiked,
      })
      .eq("id", post.id);

    fetchPosts();
  }

  async function followUser(post: Post) {

    if (!post.id) return;

    const updatedFollowers = post.followed
      ? post.followers - 1
      : post.followers + 1;

    const updatedFollowed = !post.followed;

    await supabase
      .from("posts")
      .update({
        followers: updatedFollowers,
        followed: updatedFollowed,
      })
      .eq("id", post.id);

    fetchPosts();
  }

  async function savePost(post: Post) {

    if (!post.id) return;

    await supabase
      .from("posts")
      .update({
        saved: !post.saved,
      })
      .eq("id", post.id);

    fetchPosts();
  }

  async function deletePost(id?: number) {

    if (!id) return;

    await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    fetchPosts();

    addNotification("🗑️ Post deleted");
  }

  async function addComment(
    post: Post,
    comment: string
  ) {

    if (!post.id) return;

    if (!comment.trim()) return;

    const updatedComments = [
      ...post.comments,
      comment,
    ];

    await supabase
      .from("posts")
      .update({
        comments: updatedComments,
      })
      .eq("id", post.id);

    fetchPosts();
  }

  async function logout() {

    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  async function sendAiMessage() {

    if (!aiInput.trim()) return;

    const userMessage = {
      role: "user" as const,
      text: aiInput,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    const currentInput = aiInput;

    setAiInput("");

    try {

      const response = await fetch(
        "/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: currentInput,
          }),
        }
      );

      const data =
        await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            data.reply ||
            "AI replied.",
        },
      ]);

    } catch {

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "AI server error.",
        },
      ]);
    }
  }

  const filteredPosts =
    useMemo(() => {

      return posts.filter((post) =>
        post.content
          .toLowerCase()
          .includes(
            searchInput.toLowerCase()
          )
      );

    }, [posts, searchInput]);

  const trendingTags =
    useMemo(() => {

      const hashtags =
        posts.flatMap((post) => {

          const matches =
            post.content.match(
              /#\w+/g
            );

          return matches || [];
        });

      const counts: {
        [key: string]: number;
      } = {};

      hashtags.forEach((tag) => {
        counts[tag] =
          (counts[tag] || 0) + 1;
      });

      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1]);

    }, [posts]);

  return (
    <main
      className={`min-h-screen flex ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-black"
      }`}
    >

      {/* LEFT SIDEBAR */}

      <aside
        className={`w-80 p-6 border-r overflow-y-auto ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-300"
        }`}
      >

        <div className="flex items-center justify-between">

          <h1 className="text-3xl font-bold text-blue-500">
            AI Interest
          </h1>

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="text-2xl"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

        </div>

        {/* USER */}

        <div className="mt-6">

          <p className="text-sm opacity-70">
            Logged in as:
          </p>

          <p className="font-bold mt-1">
            {currentUserEmail}
          </p>

          <button
            onClick={() => {
              window.location.href =
                "/profile";
            }}
            className="mt-4 bg-blue-600 px-5 py-2 rounded-xl w-full"
          >
            Open Profile
          </button>

          <button
            onClick={logout}
            className="mt-4 bg-red-600 px-5 py-2 rounded-xl w-full"
          >
            Logout
          </button>

        </div>

        {/* Notifications */}

        <div className="mt-10">

          <h2 className="text-xl font-bold mb-4">
            Notifications 🔔
          </h2>

          <div className="flex flex-col gap-3">

            {notifications.length ===
              0 && (
              <p className="opacity-60">
                No notifications yet
              </p>
            )}

            {notifications.map(
              (notification) => (

                <div
                  key={notification.id}
                  className={`p-3 rounded-xl text-sm ${
                    darkMode
                      ? "bg-slate-800"
                      : "bg-slate-200"
                  }`}
                >
                  {notification.text}
                </div>

              )
            )}

          </div>

        </div>

        {/* AI CHAT */}

        <div className="mt-10">

          <h2 className="text-xl font-bold mb-4">
            AI Assistant 🤖
          </h2>

          <div
            className={`p-4 rounded-2xl h-96 overflow-y-auto ${
              darkMode
                ? "bg-slate-800"
                : "bg-slate-200"
            }`}
          >

            <div className="flex flex-col gap-4">

              {messages.map(
                (message, index) => (

                  <div
                    key={index}
                    className={`p-3 rounded-xl max-w-[90%] ${
                      message.role ===
                      "user"
                        ? "bg-blue-600 self-end text-white"
                        : darkMode
                        ? "bg-slate-700"
                        : "bg-white"
                    }`}
                  >
                    {message.text}
                  </div>

                )
              )}

            </div>

          </div>

          <div className="mt-4 flex gap-2">

            <input
              type="text"
              placeholder="Ask AI..."
              value={aiInput}
              onChange={(e) =>
                setAiInput(
                  e.target.value
                )
              }
              className={`flex-1 p-3 rounded-xl outline-none ${
                darkMode
                  ? "bg-slate-800 text-white"
                  : "bg-white text-black"
              }`}
            />

            <button
              onClick={sendAiMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl"
            >
              Send
            </button>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <section className="flex-1 p-10">

        <h1 className="text-5xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="mt-4 text-lg opacity-70">
          Build your AI creator network.
        </p>

        {/* SEARCH */}

        <div className="mt-8">

          <input
            type="text"
            placeholder="Search posts..."
            value={searchInput}
            onChange={(e) =>
              setSearchInput(
                e.target.value
              )
            }
            className={`w-full p-4 rounded-2xl outline-none border ${
              darkMode
                ? "bg-slate-900 border-slate-800 text-white"
                : "bg-white border-slate-300 text-black"
            }`}
          />

        </div>

        {/* CREATE POST */}

        <div
          className={`p-6 rounded-2xl border mt-8 ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-300"
          }`}
        >

          <textarea
            placeholder="What's on your mind?"
            value={postInput}
            onChange={(e) =>
              setPostInput(
                e.target.value
              )
            }
            className={`w-full p-4 rounded-xl outline-none h-32 resize-none ${
              darkMode
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-black"
            }`}
          />

          <button
            onClick={createPost}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Create Post
          </button>

        </div>

        {/* POSTS */}

        <div className="mt-10 flex flex-col gap-6">

          {filteredPosts.map(
            (post) => (

              <PostCard
                key={post.id}
                post={post}
                darkMode={darkMode}
                likePost={likePost}
                followUser={
                  followUser
                }
                savePost={savePost}
                deletePost={
                  deletePost
                }
                addComment={
                  addComment
                }
              />

            )
          )}

        </div>

      </section>

      {/* RIGHT SIDEBAR */}

      <aside
        className={`w-80 p-6 border-l ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-300"
        }`}
      >

        <h2 className="text-2xl font-bold">
          Trending 🔥
        </h2>

        <div className="mt-8 flex flex-col gap-4">

          {trendingTags.map(
            ([tag, count]) => (

              <div
                key={tag}
                className={`p-4 rounded-2xl ${
                  darkMode
                    ? "bg-slate-800"
                    : "bg-slate-100"
                }`}
              >

                <h3 className="font-bold text-lg text-blue-400">
                  {tag}
                </h3>

                <p className="opacity-70 mt-1">
                  {count} posts
                </p>

              </div>

            )
          )}

        </div>

      </aside>

    </main>
  );
}

function PostCard({
  post,
  darkMode,
  likePost,
  followUser,
  savePost,
  deletePost,
  addComment,
}: any) {

  const [commentInput, setCommentInput] =
    useState("");

  return (
    <div
      className={`p-6 rounded-2xl border ${
        darkMode
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-slate-300"
      }`}
    >

      <div className="flex items-start justify-between">

        <div className="flex gap-4">

          <img
            src={post.avatar}
            alt="avatar"
            className="w-14 h-14 rounded-full"
          />

          <div>

            <h2 className="text-xl font-bold">
              {post.author}
            </h2>

            <p className="opacity-70 text-sm">
              {post.bio}
            </p>

            <p className="opacity-50 text-sm mt-1">
              {post.followers} followers
            </p>

          </div>

        </div>

        <div className="flex gap-3">

          <button
            onClick={() =>
              followUser(post)
            }
            className={`px-4 py-2 rounded-lg text-white ${
              post.followed
                ? "bg-green-600"
                : "bg-blue-600"
            }`}
          >
            {post.followed
              ? "Following"
              : "Follow"}
          </button>

          <button
            onClick={() =>
              deletePost(post.id)
            }
            className="bg-red-600 px-4 py-2 rounded-lg text-white"
          >
            Delete
          </button>

        </div>

      </div>

      <p className="mt-6 text-lg">
        {post.content}
      </p>

      <div className="flex gap-4 mt-6">

        <button
          onClick={() =>
            likePost(post)
          }
          className={`px-4 py-2 rounded-lg text-white ${
            post.liked
              ? "bg-pink-600"
              : "bg-slate-700"
          }`}
        >
          ❤️ {post.likes}
        </button>

        <button
          onClick={() =>
            savePost(post)
          }
          className={`px-4 py-2 rounded-lg text-white ${
            post.saved
              ? "bg-yellow-600"
              : "bg-slate-700"
          }`}
        >
          {post.saved
            ? "Saved"
            : "Save"}
        </button>

      </div>

      <div className="mt-6">

        <input
          type="text"
          placeholder="Write comment..."
          value={commentInput}
          onChange={(e) =>
            setCommentInput(
              e.target.value
            )
          }
          className={`w-full p-3 rounded-xl outline-none ${
            darkMode
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-black"
          }`}
        />

        <button
          onClick={() => {
            addComment(
              post,
              commentInput
            );

            setCommentInput("");
          }}
          className="mt-3 bg-blue-600 px-5 py-2 rounded-xl text-white"
        >
          Add Comment
        </button>

      </div>

      <div className="mt-4 flex flex-col gap-3">

        {post.comments?.map(
          (
            comment: string,
            index: number
          ) => (

            <div
              key={index}
              className={`p-3 rounded-xl ${
                darkMode
                  ? "bg-slate-800"
                  : "bg-slate-100"
              }`}
            >
              {comment}
            </div>

          )
        )}

      </div>

    </div>
  );
}