'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useEffect, useState } from 'react';

export function Navbar() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <nav className="p-4 bg-gray-900 text-white flex justify-between"><div>The Volatile Avatar</div></nav>;

    return (
        <nav className="flex justify-between items-center p-4 bg-gray-900 text-white border-b border-gray-800">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                The Volatile Avatar
            </div>
            <div>
                {isConnected ? (
                    <div className="flex gap-4 items-center">
                        <span className="text-sm text-gray-400 font-mono">
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                        <button
                            onClick={() => disconnect()}
                            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition font-semibold text-sm"
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => connect({ connector: injected() })}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition font-semibold text-sm"
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
        </nav>
    );
}
