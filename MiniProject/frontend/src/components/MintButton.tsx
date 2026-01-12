'use client';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_CONFIG } from '@/constants/contracts';

export function MintButton() {
    const { address } = useAccount();
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const handleMint = () => {
        if (!address) return;
        writeContract({
            ...CONTRACT_CONFIG,
            functionName: 'mint',
            args: [address],
        });
    };

    if (!address) return <div className="text-gray-500">Connect Wallet to Mint</div>;

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                disabled={isPending || isConfirming}
                onClick={handleMint}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Minting...' : isConfirming ? 'Confirming...' : 'Mint Avatar'}
            </button>
            {isSuccess && <p className="text-green-400 text-sm">Mint Successful! Hash: {hash?.slice(0, 10)}...</p>}
            {error && <p className="text-red-400 text-sm">Error: {error.shortMessage || error.message}</p>}
        </div>
    );
}
