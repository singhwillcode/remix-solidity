'use client';
import { useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/constants/contracts';
import { formatUnits } from 'viem';

export function Dashboard() {
    // Read Price
    const { data: priceData, isError: isPriceError, isLoading: isPriceLoading } = useReadContract({
        ...CONTRACT_CONFIG,
        functionName: 'currentPrice',
    });

    // Read Mod State
    const { data: modStateData, isError: isModError, isLoading: isModLoading } = useReadContract({
        ...CONTRACT_CONFIG,
        functionName: 'getModState',
    });

    // Helper to format price (assuming 8 decimals from Oracle)
    const formattedPrice = priceData
        ? `$${(Number(priceData) / 1e8).toFixed(2)}`
        : '0.00';

    // Helper for Mood
    const getMood = (state: any) => {
        const s = Number(state);
        if (s === 0) return { text: "Base Form", color: "text-blue-400" };
        if (s === 1) return { text: "Super Saiyan", color: "text-yellow-400" };
        if (s === 2) return { text: "Ultra Instinct", color: "text-white" };
        return { text: "Unknown", color: "text-gray-400" };
    };

    const mood = getMood(modStateData);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm transition-all w-full max-w-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-300">Live Dashboard</h2>
            <div className="space-y-4 text-center w-full">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-gray-400 text-xs uppercase tracking-widest">ETH Price (Oracle)</p>
                    <p className="text-3xl font-mono text-white mt-1">
                        {isPriceLoading ? "..." : formattedPrice}
                    </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Current Mode</p>
                    <p className={`text-2xl font-bold mt-1 ${mood.color}`}>
                        {isModLoading ? "..." : mood.text}
                    </p>
                </div>
            </div>
        </div>
    );
}
