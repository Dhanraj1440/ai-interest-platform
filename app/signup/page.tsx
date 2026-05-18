"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../dashboard/supabase";

export default function SignupPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signup() {

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {

      await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email,
          username: email.split("@")[0],
          avatar: "https://i.pravatar.cc/150?img=12",
          bio: "New AI User",
        },
      ]);

      alert("Signup successful");

      router.push("/login");
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center text-white">

      <div className="bg-zinc-900 p-10 rounded-3xl w-[420px]">

        <h1 className="text-4xl font-bold text-blue-500">
          Create Account
        </h1>

        <p className="mt-3 text-zinc-400">
          Join AI Interest Platform
        </p>

        <div className="mt-8 flex flex-col gap-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800 outline-none"
          />

          <button
            onClick={signup}
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-bold"
          >
            Sign Up
          </button>

        </div>

      </div>

    </main>
  );
}