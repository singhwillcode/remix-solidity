'use client';
import { useState, useEffect } from 'react';
import { Activity, Zap, Settings, Command, Terminal, Cpu, Share2 } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { MintButton } from './MintButton';
import { NFTCard } from './NFTCard';
import { Dashboard } from './Dashboard';
import { PriceChart } from './PriceChart';
import { ElectricBackground } from './ElectricBackground';

function ConnectWalletDisplay() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    if (isConnected) {
        return (
            <button
                onClick={() => disconnect()}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-md text-xs font-mono text-zinc-300 hover:bg-zinc-800 transition"
            >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
        );
    }
    return (
        <button
            onClick={() => connect({ connector: injected() })}
            className="px-4 py-1.5 bg-zinc-100 text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-zinc-200 transition"
        >
            Connect Wallet
        </button>
    );
}

export function VolatileAvatarInterface() {
    const [sessionHash, setSessionHash] = useState("0x...");

    useEffect(() => {
        setSessionHash("0x" + Math.random().toString(16).slice(2).toUpperCase());
    }, []);

    return (
        <div className="min-h-screen text-white p-4 md:p-8 font-sans selection:bg-purple-500/30 relative overflow-hidden">

            {/* FORCE BACKGROUND VIDEO */}
            <div className="fixed inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/background.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* CONTENT WRAPPER */}
            <div className="relative z-10">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-zinc-800 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2 text-white">
                            <Zap className="text-purple-500 w-6 h-6 fill-current" />
                            VOLATILE AVATAR
                        </h1>
                        <p className="text-zinc-500 text-xs font-mono mt-1 flex items-center gap-2">
                            <Terminal className="w-3 h-3" />
                            DYNAMIC IDENTITY GENERATOR // ETH_MAINNET_SYNCED
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <ConnectWalletDisplay />
                        <MintButton />
                    </div>
                </header>

                {/* BENTO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto">

                    {/* MAIN HERO: NFT DISPLAY (Span 2 cols, 2 rows) */}
                    <div className="md:col-span-2 md:row-span-2 border border-zinc-800 bg-black/10 backdrop-blur-md rounded-xl p-1 relative overflow-hidden group">
                        {/* ElectricBackground REMOVED as requested */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 z-10"></div>

                        {/* Content Container */}
                        <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-transparent relative z-20">
                            <div className="scale-100 transition-transform duration-500 ease-in-out">
                                <NFTCard />
                            </div>
                        </div>

                        {/* Overlay Tech Text */}
                        <div className="absolute bottom-4 left-4 text-[10px] font-mono text-zinc-600 border-l mb-1 pl-2 border-zinc-800 z-20">
                            STATUS: ACTIVE_LISTENER<br />
                            MODE: REACTIVE<br />
                            LATENCY: 12ms
                        </div>
                        <div className="absolute top-4 right-4 text-[10px] font-mono text-zinc-600 flex gap-1 items-center z-20">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                            LIVE
                        </div>
                    </div>

                    {/* DASHBOARD STATS (Span 2 cols, 2 rows to match Hero) */}
                    <div className="md:col-span-2 md:row-span-2 border border-zinc-800 bg-zinc-900/40 backdrop-blur-md rounded-xl p-6 relative flex flex-col justify-between min-h-[250px]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase tracking-wider">
                                <Activity className="w-4 h-4 text-blue-400" /> Market Data Stream
                            </div>
                            <Settings className="w-4 h-4 text-zinc-700 hover:text-white cursor-pointer transition" />
                        </div>

                        <div className="h-full flex items-center justify-center">
                            <div className="scale-100 w-full">
                                <Dashboard />
                            </div>
                        </div>
                    </div>

                    {/* LIVE CHART (Span 4 cols - Full Width) */}
                    <div className="md:col-span-4 border border-zinc-700 bg-zinc-900/40 backdrop-blur-md rounded-xl p-1 h-[400px] relative overflow-hidden mb-12 shadow-lg">
                        <div className="absolute top-0 right-0 p-2 z-10">
                            <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 px-2 py-1 rounded text-[10px] text-zinc-400 font-mono">
                                ETH/USD ORACLE FEED
                            </div>
                        </div>
                        <PriceChart />
                    </div>

                </div>
            </div>
        </div>
    )
}
