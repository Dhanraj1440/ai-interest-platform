"use client";

import { useEffect, useState } from "react";
import { supabase } from "../dashboard/supabase";

export default function UsersPage() {

  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUser(user);

    const { data } = await supabase
      .from("users")
      .select("*");

    setUsers(data || []);
  }

  async function followUser(userId: string) {

    if (!currentUser) return;

    await supabase.from("follows").insert([
      {
        follower_id: currentUser.id,
        following_id: userId,
      },
    ]);

    alert("Followed user");
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          Discover Users
        </h1>

        <div className="flex flex-col gap-6">

          {users.map((user) => (

            <div
              key={user.id}
              className="bg-zinc-900 p-6 rounded-2xl flex items-center justify-between"
            >

              <div className="flex items-center gap-4">

                <img
                  src={
                    user.avatar ||
                    "https://i.pravatar.cc/150?img=12"
                  }
                  className="w-16 h-16 rounded-full"
                />

                <div>

                  <h2 className="text-xl font-bold">
                    {user.username}
                  </h2>

                  <p className="text-zinc-400">
                    {user.bio}
                  </p>

                </div>

              </div>

              {currentUser?.id !== user.id && (

                <button
                  onClick={() => followUser(user.id)}
                  className="bg-white text-black px-5 py-2 rounded-xl font-bold"
                >
                  Follow
                </button>

              )}

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}