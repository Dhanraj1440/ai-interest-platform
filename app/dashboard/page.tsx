"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function DashboardPage() {

  const [content, setContent] = useState("");

  const [posts, setPosts] = useState<any[]>([]);

  const [interestScores, setInterestScores] =
    useState<any>({});

  useEffect(() => {

    loadPosts();

    loadScores();

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

  async function loadScores() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("users")
      .select("interest_scores")
      .eq("id", user.id)
      .single();

    setInterestScores(
      data?.interest_scores || {}
    );
  }

  function detectInterests(text: string) {

    const lower = text.toLowerCase();

    let found: string[] = [];

    const map: any = {

      football: ["football", "messi", "soccer"],

      gaming: ["game", "gaming", "pubg", "valorant"],

      fitness: ["gym", "workout", "fitness"],

      music: ["music", "spotify", "song"],

      coding: ["coding", "developer", "programming"],

      fashion: ["fashion", "clothes", "shopping"],

      movies: ["movie", "netflix", "series"],

      anime: ["anime", "naruto", "one piece"],

      cars: ["bmw", "car", "audi"],

    };

    Object.keys(map).forEach((interest) => {

      map[interest].forEach((word: string) => {

        if (lower.includes(word)) {

          found.push(interest);

        }

      });

    });

    return [...new Set(found)];
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

    const detected = detectInterests(content);

    let updatedScores = {
      ...interestScores,
    };

    detected.forEach((interest) => {

      if (!updatedScores[interest]) {

        updatedScores[interest] = 10;

      } else {

        updatedScores[interest] += 10;

      }

      if (updatedScores[interest] > 100) {

        updatedScores[interest] = 100;

      }

    });

    await supabase
      .from("users")
      .update({
        interest_scores: updatedScores,
      })
      .eq("id", user.id);

    setInterestScores(updatedScores);

    setContent("");

    loadPosts();
  }

  return (

    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Dashboard
        </h1>

        {/* INTEREST SCORES */}

        <div className="bg-zinc-900 p-6 rounded-3xl mb-10">

          <h2 className="text-3xl font-bold mb-6">
            AI Interest Analysis
          </h2>

          <div className="flex flex-col gap-5">

            {Object.keys(interestScores).length === 0 && (

              <p className="text-zinc-400">
                No interests detected yet
              </p>

            )}

            {Object.entries(interestScores).map(
              ([interest, score]: any) => (

                <div key={interest}>

                  <div className="flex justify-between mb-2">

                    <span className="capitalize font-bold">
                      {interest}
                    </span>

                    <span>
                      {score}%
                    </span>

                  </div>

                  <div className="w-full bg-black rounded-full h-4">

                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{
                        width: `${score}%`,
                      }}
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </div>

        {/* CREATE POST */}

        <div className="bg-zinc-900 p-6 rounded-3xl">

          <textarea
            placeholder="Share your daily routine..."
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
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