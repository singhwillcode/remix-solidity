'use client';
import { useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/constants/contracts';
import { useState, useEffect } from 'react';

// Simplified IPFS Gateway
const toGateway = (uri: string) => {
    if (!uri) return "";
    if (uri.startsWith('ipfs://')) {
        return uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    return uri;
}

export function NFTCard() {
    // Hardcoded Token ID 1 for demo (since we loop update all)
    const tokenId = BigInt(1);

    const { data: tokenURI, isLoading } = useReadContract({
        ...CONTRACT_CONFIG,
        functionName: 'tokenURI',
        args: [tokenId],
    });

    const [metadata, setMetadata] = useState<any>(null);

    useEffect(() => {
        if (tokenURI) {
            const url = toGateway(tokenURI as string);
            fetch(url)
                .then(res => res.json())
                .then(data => setMetadata(data))
                .catch(err => console.error("Metadata fetch error", err));
        }
    }, [tokenURI]);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm transition-all w-full max-w-sm group hover:border-blue-500/30">
            <h2 className="text-xl font-bold mb-6 text-gray-300">Your Avatar</h2>

            <div className="w-64 h-64 bg-gray-800 rounded-xl flex items-center justify-center mb-6 overflow-hidden border border-gray-700 relative">
                {isLoading ? (
                    <span className="animate-pulse text-gray-500">Loading Chain Data...</span>
                ) : metadata?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={toGateway(metadata.image)}
                        alt="Volatile Avatar"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="text-center p-4">
                        <p className="text-gray-500 text-sm">No Data</p>
                        <p className="text-xs text-gray-600 mt-2">Mint simple token #1 to view</p>
                    </div>
                )}
            </div>

            <div className="text-center">
                <p className="text-blue-400 font-semibold">{metadata?.name || "???"}</p>
                <p className="text-gray-500 text-xs mt-1">{metadata?.description || "Waiting for sync..."}</p>
            </div>
        </div>
    );
}
