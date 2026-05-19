"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function DashboardPage() {

  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {

    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setPosts(data || []);
  }

  async function createPost() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !content) return;

    await supabase.from("posts").insert([
      {
        content,
        user_id: user.id,
        likes: 0,
      },
    ]);

    setContent("");

    loadPosts();
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          Dashboard
        </h1>

        {/* CREATE POST */}

        <div className="bg-zinc-900 p-6 rounded-3xl">

          <textarea
            placeholder="Share your daily routine..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-black p-4 rounded-2xl min-h-[120px]"
          />

          <button
            onClick={createPost}
            className="mt-4 bg-white text-black px-6 py-3 rounded-xl font-bold"
          >
            Post
          </button>

        </div>

        {/* POSTS */}

        <div className="mt-10 flex flex-col gap-6">

          {posts.map((post) => (

            <div
              key={post.id}
              className="bg-zinc-900 p-6 rounded-2xl"
            >

              <p className="text-lg">
                {post.content}
              </p>

              <div className="mt-4 text-sm text-zinc-400">

                ❤️ {post.likes}

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}