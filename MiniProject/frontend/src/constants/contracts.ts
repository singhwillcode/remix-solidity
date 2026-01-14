import { ABI } from './abi';

// TODO: Replace with deployed address
export const CONTRACT_ADDRESS = "0xf7Cd05f5f49627BBf45Cc338195188A7c2909345";

export const CONTRACT_CONFIG = {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
} as const;
