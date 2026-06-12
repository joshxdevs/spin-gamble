require('dotenv').config()
import { Keypair, PublicKey } from "@solana/web3.js";
import bs58 from 'bs58';

export const PLATFORM_FEE = 3;
export const PLATFORM_PUBLIC_KEY = new PublicKey(process.env.PLATFORM_PUBLIC_KEY || "");
const decoded = bs58.decode(process.env.PLATFORM_PRIVATE_KEY || "");
export const PLATFORM_KEYPAIR = Keypair.fromSecretKey(decoded);
