'use client';
import { useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/constants/contracts';
import { formatUnits } from 'viem';
import { useState, useEffect } from 'react';

export function Dashboard() {
    // Live Oracle Address (Sepolia ETH/USD)
    const ORACLE_ADDRESS = '0x694AA1769357215DE4FAC081bf1f309aDC325306';

    const [lastChecked, setLastChecked] = useState<string>(new Date().toLocaleTimeString());

    // Read Price from Chainlink Direct
    const { data: roundData, isLoading: isPriceLoading, refetch } = useReadContract({
        address: ORACLE_ADDRESS,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'latestRoundData',
    });

    // Manual Polling to ensure updates
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Refetching Price...");
            refetch();
            setLastChecked(new Date().toLocaleTimeString());
        }, 5000);
        return () => clearInterval(interval);
    }, [refetch]);

    const priceData = roundData ? (roundData as any)[1] : null;

    // Helper to format price (8 decimals)
    const formattedPrice = priceData
        ? `$${(Number(priceData) / 1e8).toFixed(2)}`
        : '0.00';

    // Calculate Mood locally based on live price
    // Contract Logic: (Price / 100) % 3
    const calculateModState = (price: any) => {
        if (!price) return -1;
        const adjustedPrice = Number(price) / 1e8;
        const integerPrice = Math.floor(adjustedPrice);
        return Math.floor(integerPrice / 100) % 3;
    };

    const currentModState = calculateModState(priceData);

    // Helper for Mood
    const getMood = (state: number) => {
        if (state === 0) return { text: "Base Form", color: "text-blue-400" };
        if (state === 1) return { text: "Super Saiyan", color: "text-yellow-400" };
        if (state === 2) return { text: "Ultra Instinct", color: "text-white" };
        return { text: "Loading...", color: "text-gray-400" };
    };

    const mood = getMood(currentModState);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm transition-all w-full max-w-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-300">Live Dashboard</h2>
            <div className="space-y-4 text-center w-full">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-gray-400 text-xs uppercase tracking-widest">ETH Price (Oracle)</p>
                    <p className="text-3xl font-mono text-white mt-1">
                        {isPriceLoading ? "..." : formattedPrice}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-2">Last Checked: {lastChecked}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Current Mode</p>
                    <p className={`text-2xl font-bold mt-1 ${mood.color}`}>
                        {isPriceLoading ? "..." : mood.text}
                    </p>
                </div>
            </div>
        </div>
    );
}
