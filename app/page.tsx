"use client";

export default function HomePage() {

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="max-w-7xl mx-auto px-10 py-28">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div>

            <h1 className="text-7xl font-black leading-tight">

              AI Powered
              <br />

              Social Network

            </h1>

            <p className="mt-8 text-zinc-400 text-xl leading-relaxed">

              Discover people, communities,
              startups, tools, and content
              powered by intelligent AI recommendations.

            </p>

            <div className="flex gap-5 mt-10">

              <button
                onClick={() => {
                  window.location.href =
                    "/signup";
                }}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl text-lg font-bold"
              >
                Get Started
              </button>

              <button
                onClick={() => {
                  window.location.href =
                    "/login";
                }}
                className="bg-zinc-800 hover:bg-zinc-700 px-8 py-4 rounded-2xl text-lg font-bold"
              >
                Login
              </button>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="relative">

            <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">

              <div className="flex items-center gap-4">

                <img
                  src="https://i.pravatar.cc/150?img=45"
                  alt="avatar"
                  className="w-16 h-16 rounded-full"
                />

                <div>

                  <h2 className="text-2xl font-bold">
                    AI Creator
                  </h2>

                  <p className="text-zinc-400">
                    Building the future with AI 🚀
                  </p>

                </div>

              </div>

              <p className="mt-8 text-lg leading-relaxed">

                Just launched my new AI startup platform.
                Looking for developers, founders,
                and creators to collaborate.

              </p>

              <div className="flex gap-6 mt-8 text-zinc-400">

                <span>❤️ 2.4k</span>
                <span>💬 480</span>
                <span>🔖 Saved</span>

              </div>

            </div>

            <div className="absolute -bottom-8 -left-8 bg-blue-600 px-8 py-5 rounded-2xl shadow-2xl">

              <h3 className="text-3xl font-black">
                10K+
              </h3>

              <p>AI Creators</p>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section className="max-w-7xl mx-auto px-10 py-20">

        <h2 className="text-5xl font-black text-center">

          Why AI Interest?

        </h2>

        <div className="grid md:grid-cols-3 gap-10 mt-20">

          <div className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800">

            <div className="text-5xl">
              🤖
            </div>

            <h3 className="text-3xl font-bold mt-6">
              AI Recommendations
            </h3>

            <p className="mt-5 text-zinc-400 leading-relaxed">

              Personalized communities,
              content, and people
              based on your interests.

            </p>

          </div>

          <div className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800">

            <div className="text-5xl">
              🌍
            </div>

            <h3 className="text-3xl font-bold mt-6">
              Global Network
            </h3>

            <p className="mt-5 text-zinc-400 leading-relaxed">

              Connect with founders,
              developers, creators,
              and AI enthusiasts worldwide.

            </p>

          </div>

          <div className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800">

            <div className="text-5xl">
              🚀
            </div>

            <h3 className="text-3xl font-bold mt-6">
              Build Faster
            </h3>

            <p className="mt-5 text-zinc-400 leading-relaxed">

              Discover AI tools,
              startup ideas,
              and growth opportunities.

            </p>

          </div>

        </div>

      </section>

    </main>
  );
}