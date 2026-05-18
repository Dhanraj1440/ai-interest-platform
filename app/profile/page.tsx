"use client";

import { useEffect, useState } from "react";
import { supabase } from "../dashboard/supabase";

export default function ProfilePage() {

  const [userData, setUserData] = useState<any>(null);

  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {

    loadProfile();

  }, []);

  async function loadProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    setUserData(profile);

    const { data: userPosts } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    setPosts(userPosts || []);
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-4xl mx-auto">

        <div className="bg-zinc-900 rounded-3xl p-10">

          <div className="flex items-center gap-6">

            <img
              src={
                userData?.avatar ||
                "https://i.pravatar.cc/150?img=12"
              }
              alt="avatar"
              className="w-28 h-28 rounded-full"
            />

            <div>

              <h1 className="text-4xl font-bold">
                {userData?.username}
              </h1>

              <p className="text-zinc-400 mt-2">
                {userData?.email}
              </p>

              <p className="mt-4">
                {userData?.bio}
              </p>

            </div>

          </div>

        </div>

        {/* POSTS */}

        <div className="mt-10">

          <h2 className="text-3xl font-bold">
            Your Posts
          </h2>

          <div className="mt-6 flex flex-col gap-6">

            {posts.map((post) => (

              <div
                key={post.id}
                className="bg-zinc-900 p-6 rounded-2xl"
              >

                <p className="text-lg">
                  {post.content}
                </p>

                <div className="mt-4 flex gap-6 text-sm text-zinc-400">

                  <span>
                    ❤️ {post.likes}
                  </span>

                  <span>
                    💬 {post.comments?.length}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </main>
  );
}