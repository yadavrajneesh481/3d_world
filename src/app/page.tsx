'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <main className="flex flex-col items-center justify-center text-center">
          <h1 className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Code Among Us
          </h1>
          
          <p className="text-xl mb-12 max-w-2xl text-gray-300">
            Join the ultimate multiplayer coding experience! Complete coding challenges,
            work with other players, and discover who's helping and who's sabotaging.
          </p>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">🎮 Multiplayer Gaming</h3>
                <p className="text-gray-300">
                  Play with friends in real-time, solve coding challenges together, and watch out for impostors!
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">💻 Coding Challenges</h3>
                <p className="text-gray-300">
                  Test your programming skills with interactive challenges ranging from basic to advanced.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-green-400">🏆 Real-time Competition</h3>
                <p className="text-gray-300">
                  Compete against others, earn points, and climb the leaderboard as you solve challenges.
                </p>
              </div>
            </div>

            <Link
              href="/game"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Playing Now
            </Link>
          </div>

          <div className="mt-16 text-sm text-gray-400">
            <p>Use WASD or Arrow keys to move • Press E to interact with tasks</p>
          </div>
        </main>
      </div>
    </div>
  );
}
