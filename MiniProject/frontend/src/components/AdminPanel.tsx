'use client';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_CONFIG } from '@/constants/contracts';
import { useState } from 'react';

export function AdminPanel() {
    const { address } = useAccount();

    // Separate hooks for Force Update
    const { writeContract: writeForceUpdate, data: hashForce, isPending: isPendingForce, error: errorForce } = useWriteContract();
    const { isLoading: isConfirmingForce, isSuccess: isSuccessForce } = useWaitForTransactionReceipt({ hash: hashForce });

    // Separate hooks for Set URI
    const { writeContract: writeSetUri, data: hashUri, isPending: isPendingUri, error: errorUri } = useWriteContract();
    const { isLoading: isConfirmingUri, isSuccess: isSuccessUri } = useWaitForTransactionReceipt({ hash: hashUri });

    const [uriInput, setUriInput] = useState("");
    const [uriIndex, setUriIndex] = useState(0);

    const handleForceUpdate = () => {
        writeForceUpdate({
            ...CONTRACT_CONFIG,
            functionName: 'performUpkeep',
            args: ['0x'],
        });
    };

    const handleSetUri = () => {
        if (!uriInput) return;
        writeSetUri({
            ...CONTRACT_CONFIG,
            functionName: 'setIpfsUri',
            args: [BigInt(uriIndex), uriInput],
        });
    };

    if (!address) return null;

    return (
        <div className="flex flex-col gap-4 p-6 bg-red-900/20 border border-red-800 rounded-2xl w-full max-w-4xl mt-12">
            <h3 className="text-red-400 font-bold uppercase tracking-widest text-sm border-b border-red-800 pb-2">Admin / Debug Zone</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* FORCE UPDATE */}
                <div className="space-y-2">
                    <p className="text-gray-400 text-xs">Fix "Price: 0.00" by forcing an update manually (costs gas).</p>
                    <button
                        disabled={isPendingForce || isConfirmingForce}
                        onClick={handleForceUpdate}
                        className="px-4 py-2 bg-red-800 hover:bg-red-700 rounded text-sm font-semibold transition w-full disabled:opacity-50"
                    >
                        {isPendingForce ? 'Sending...' : isConfirmingForce ? 'Confirming...' : 'Force Price Update'}
                    </button>
                    {isSuccessForce && <p className="text-green-400 text-xs">✅ Price Updated!</p>}
                    {errorForce && <p className="text-red-400 text-xs">❌ Error</p>}
                </div>

                {/* SET URI */}
                <div className="space-y-2">
                    <p className="text-gray-400 text-xs">Fix "No Data" by setting real Metadata URIs.</p>
                    <div className="flex gap-2">
                        <select
                            value={uriIndex}
                            onChange={(e) => {
                                setUriIndex(Number(e.target.value));
                                setUriInput(""); // Clear input when switching states
                            }}
                            className="bg-gray-800 border-gray-700 rounded px-2 text-sm"
                        >
                            <option value={0}>State 0 (Base)</option>
                            <option value={1}>State 1 (Super)</option>
                            <option value={2}>State 2 (Ultra)</option>
                        </select>
                        <input
                            type="text"
                            placeholder="ipfs://..."
                            value={uriInput}
                            onChange={(e) => setUriInput(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm flex-1"
                        />
                    </div>
                    <button
                        disabled={isPendingUri || isConfirmingUri || !uriInput}
                        onClick={handleSetUri}
                        className="px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded text-sm font-semibold transition w-full disabled:opacity-50"
                    >
                        {isPendingUri ? 'Sending...' : isConfirmingUri ? 'Confirming...' : 'Update URI'}
                    </button>
                    {isSuccessUri && <p className="text-green-400 text-xs">✅ URI Updated! Refresh page to see changes.</p>}
                    {errorUri && <p className="text-red-400 text-xs">❌ Error</p>}
                </div>
            </div>
        </div>
    );
}
