"use client";

import { useEffect, useState } from "react";
import { supabase } from "../dashboard/supabase";

export default function ProfilePage() {

  const [userData, setUserData] = useState<any>(null);

  const [posts, setPosts] = useState<any[]>([]);

  const [interestScores, setInterestScores] = useState<any>({
    fitness: 0,
    gaming: 0,
    music: 0,
    fashion: 0,
    travel: 0,
    technology: 0,
  });

  const [recommendations, setRecommendations] = useState<string[]>([]);

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

    const allPosts = userPosts || [];

    setPosts(allPosts);

    analyzeInterests(allPosts);
  }

  function analyzeInterests(postsData: any[]) {

    let scores = {
      fitness: 0,
      gaming: 0,
      music: 0,
      fashion: 0,
      travel: 0,
      technology: 0,
    };

    postsData.forEach((post) => {

      const text = post.content.toLowerCase();

      // FITNESS
      if (
        text.includes("gym") ||
        text.includes("workout") ||
        text.includes("fitness") ||
        text.includes("protein")
      ) {
        scores.fitness += 10;
      }

      // GAMING
      if (
        text.includes("gaming") ||
        text.includes("game") ||
        text.includes("keyboard") ||
        text.includes("pc")
      ) {
        scores.gaming += 10;
      }

      // MUSIC
      if (
        text.includes("music") ||
        text.includes("song") ||
        text.includes("spotify")
      ) {
        scores.music += 10;
      }

      // FASHION
      if (
        text.includes("fashion") ||
        text.includes("clothes") ||
        text.includes("shoes")
      ) {
        scores.fashion += 10;
      }

      // TRAVEL
      if (
        text.includes("travel") ||
        text.includes("trip") ||
        text.includes("vacation")
      ) {
        scores.travel += 10;
      }

      // TECHNOLOGY
      if (
        text.includes("ai") ||
        text.includes("tech") ||
        text.includes("laptop") ||
        text.includes("coding")
      ) {
        scores.technology += 10;
      }

    });

    setInterestScores(scores);

    generateRecommendations(scores);
  }

  function generateRecommendations(scores: any) {

    let items: string[] = [];

    // FITNESS
    if (scores.fitness >= 10) {
      items.push("🏋️ Gym Gloves");
      items.push("🥤 Protein Shaker");
      items.push("⌚ Fitness Watch");
    }

    // GAMING
    if (scores.gaming >= 10) {
      items.push("🎮 Gaming Mouse");
      items.push("⌨️ Mechanical Keyboard");
      items.push("🎧 Gaming Headphones");
    }

    // MUSIC
    if (scores.music >= 10) {
      items.push("🎵 Bluetooth Speaker");
      items.push("🎧 Studio Headphones");
    }

    // FASHION
    if (scores.fashion >= 10) {
      items.push("👟 Sneakers");
      items.push("🧥 Streetwear Hoodie");
    }

    // TRAVEL
    if (scores.travel >= 10) {
      items.push("🧳 Travel Backpack");
      items.push("📸 Action Camera");
    }

    // TECHNOLOGY
    if (scores.technology >= 10) {
      items.push("💻 Laptop Accessories");
      items.push("🖱️ Wireless Mouse");
      items.push("📱 Smart Gadgets");
    }

    setRecommendations(items);
  }

  return (

    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-5xl mx-auto">

        {/* PROFILE */}

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

        {/* AI INTEREST DASHBOARD */}

        <div className="mt-10">

          <h2 className="text-4xl font-bold mb-8">
            AI Interest Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-purple-700 p-6 rounded-3xl">
              <h3 className="text-2xl font-bold">
                Fitness
              </h3>
              <p className="mt-4 text-5xl font-bold">
                {interestScores.fitness}
              </p>
            </div>

            <div className="bg-blue-700 p-6 rounded-3xl">
              <h3 className="text-2xl font-bold">
                Gaming
              </h3>
              <p className="mt-4 text-5xl font-bold">
                {interestScores.gaming}
              </p>
            </div>

            <div className="bg-pink-700 p-6 rounded-3xl">
              <h3 className="text-2xl font-bold">
                Music
              </h3>
              <p className="mt-4 text-5xl font-bold">
                {interestScores.music}
              </p>
            </div>

            <div className="bg-green-700 p-6 rounded-3xl">
              <h3 className="text-2xl font-bold">
                Fashion
              </h3>
              <p className="mt-4 text-5xl font-bold">
                {interestScores.fashion}
              </p>
            </div>

            <div className="bg-orange-700 p-6 rounded-3xl">
              <h3 className="text-2xl font-bold">
                Travel
              </h3>
              <p className="mt-4 text-5xl font-bold">
                {interestScores.travel}
              </p>
            </div>

            <div className="bg-cyan-700 p-6 rounded-3xl">
              <h3 className="text-2xl font-bold">
                Technology
              </h3>
              <p className="mt-4 text-5xl font-bold">
                {interestScores.technology}
              </p>
            </div>

          </div>

        </div>

        {/* AI RECOMMENDATIONS */}

        <div className="mt-12">

          <h2 className="text-4xl font-bold mb-6">
            Recommended For You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {recommendations.map((item, index) => (

              <div
                key={index}
                className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800"
              >

                <p className="text-2xl font-semibold">
                  {item}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* POSTS */}

        <div className="mt-12">

          <h2 className="text-3xl font-bold mb-6">
            Your Posts
          </h2>

          <div className="flex flex-col gap-6">

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
                    💬 {post.comments?.length || 0}
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