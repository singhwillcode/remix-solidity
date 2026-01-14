'use client';
import { useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/constants/contracts';
import { useState, useEffect } from 'react';

const toGateway = (uri: string) => {
    if (!uri) return "";
    if (uri.startsWith('http://') || uri.startsWith('https://')) return uri;
    if (uri.startsWith('ipfs://')) return uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    if (uri.startsWith('Qm') || uri.startsWith('baf')) return `https://ipfs.io/ipfs/${uri}`;
    return uri;
}

export function NFTCard() {
    const tokenId = BigInt(1);
    const { data: tokenURI, isLoading } = useReadContract({
        ...CONTRACT_CONFIG,
        functionName: 'tokenURI',
        args: [tokenId],
    });

    const [metadata, setMetadata] = useState<any>(null);

    useEffect(() => {
        let isMounted = true;

        if (tokenURI) {
            const url = toGateway(tokenURI as string);
            console.log("Fetching:", url);

            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 8000);

            fetch(url, { signal: controller.signal })
                .then(r => r.ok ? r.text() : Promise.reject())
                .then(text => {
                    try {
                        return JSON.parse(text);
                    } catch {
                        return { name: "Raw", description: "Not JSON", image: url };
                    }
                })
                .then(data => isMounted && setMetadata(data))
                .catch(() => isMounted && setMetadata({
                    name: "Error",
                    description: "Failed to load. Use Admin Panel to update URI.",
                    image: ""
                }))
                .finally(() => clearTimeout(timer));

            return () => {
                isMounted = false;
                controller.abort();
                clearTimeout(timer);
            };
        }
    }, [tokenURI]);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm transition-all w-full max-w-sm group hover:border-blue-500/30">
            <h2 className="text-xl font-bold mb-6 text-gray-300">Your Avatar</h2>

            <div className="w-64 h-64 bg-gray-800 rounded-xl flex items-center justify-center mb-6 overflow-hidden border border-gray-700 relative">
                {isLoading ? (
                    <span className="animate-pulse text-gray-500">Loading...</span>
                ) : metadata?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={toGateway(metadata.image)}
                        alt="Volatile Avatar"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="text-center p-4">
                        <p className="text-gray-500 text-sm">No Image</p>
                        <p className="text-xs text-gray-600 mt-2">Use Admin Panel to set URI</p>
                    </div>
                )}
            </div>

            <div className="text-center">
                <p className="text-blue-400 font-semibold">{metadata?.name || "???"}</p>
                <p className="text-gray-500 text-xs mt-1">{metadata?.description || "..."}</p>


            </div>
        </div>
    );
}
