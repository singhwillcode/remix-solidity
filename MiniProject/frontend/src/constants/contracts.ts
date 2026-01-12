import { ABI } from './abi';

// TODO: Replace with deployed address
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

export const CONTRACT_CONFIG = {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
} as const;
