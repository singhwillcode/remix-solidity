'use client';
import { Navbar } from '@/components/Navbar';
import { NFTCard } from '@/components/NFTCard';
import { Dashboard } from '@/components/Dashboard';
import { MintButton } from '@/components/MintButton';
import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col bg-black text-white selection:bg-purple-500/30">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse drop-shadow-2xl">
            The Volatile Avatar
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-lg leading-relaxed">
            An autonomous NFT that evolves based on real-time Ethereum market data.
            <br />
            <span className="text-sm opacity-70">Powered by Chainlink Automation & Price Feeds</span>
          </p>

          <div className="flex items-center justify-center gap-4">
            <div className="inline-block px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700 backdrop-blur-sm">
              <span className="text-gray-400 text-sm">Logic: </span>
              <code className="text-yellow-400 font-mono text-sm">(Price / 100) % 3</code>
            </div>
          </div>

          <div className="mt-8">
            <MintButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-4">
          <NFTCard />
          <Dashboard />
        </div>
      </div>
    </main>
  );
}
