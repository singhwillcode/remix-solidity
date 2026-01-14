'use client';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/constants/contracts';

export function MintButton() {
    const { address } = useAccount();
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    // Check Balance
    const { data: balance } = useReadContract({
        ...CONTRACT_CONFIG,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
    });

    const hasMinted = balance && Number(balance) > 0;

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
                disabled={isPending || isConfirming || !!hasMinted}
                onClick={handleMint}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:from-gray-600 disabled:to-gray-700"
            >
                {isPending ? 'Minting...' : isConfirming ? 'Confirming...' : hasMinted ? 'You Own an Avatar' : 'Mint Avatar'}
            </button>
            <p className="text-xs text-gray-500 max-w-xs text-center mt-2">
                Minting creates your own NFT on the blockchain. <br /> Since this is a demo, you only need one to participate!
            </p>
            {isSuccess && <p className="text-green-400 text-sm">Mint Successful! Hash: {hash?.slice(0, 10)}...</p>}
            {error && <p className="text-red-400 text-sm">Error: {(error as any).shortMessage || error.message}</p>}
        </div>
    );
}
