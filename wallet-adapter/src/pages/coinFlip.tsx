import { useState } from "react";
import { Coins as Coin, PinOff as CoinOff } from 'lucide-react';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";
import Nav from "../components/nav";
import { BACKEND_URL, PLATFORM_FEE, PLATFORM_PUBLIC_KEY } from "@/config/utils";
import clsx from "clsx";
import { useAtom } from "jotai";
import { balanceUpdate } from "@/store/atom";

export const amounts = [0.1, 0.5, 1, 2];

export default function CoinFlip() {
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails' | null>(null);
  const [balanceUp, setBalanceUpdate] = useAtom(balanceUpdate);
  const [selectedCoin, setSelectedCoin] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [amount, setAmount] = useState<number>(0.1);
  const wallet = useWallet();
  const { connection } = useConnection();



  return <div>
    <Nav />
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat">
      <div className="space-y-6 mt-15">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Choose Your Side</h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setSelectedSide('heads')}
              className={`cursor-pointer p-4 rounded-lg ${selectedSide === 'heads'
                ? 'bg-blue-600'
                : 'bg-gray-700 hover:bg-gray-600'
                }`}
            >
              <Coin className="w-12 h-12" />
              <span className="block mt-2">Heads</span>
            </button>
            <button
              onClick={() => setSelectedSide('tails')}
              className={` cursor-pointer p-4 rounded-lg ${selectedSide === 'tails'
                ? 'bg-blue-600'
                : 'bg-gray-700 hover:bg-gray-600'
                }`}
            >
              <CoinOff className="w-12 h-12" />
              <span className="block mt-2">Tails</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Select Amount</h3>
          <div className="flex flex-col">
            <div className="flex gap-x-3 justify-center">
              {amounts.map((amount) => (
                <div key={amount} className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      setAmount(amount);
                      setSelectedCoin(amount)
                    }}
                    className={clsx(
                      "relative h-20 w-20 lg:h-20 lg:w-20 rounded-full border-2 transition-all duration-300",
                      "hover:scale-110 transform shadow-lg",
                      selectedCoin === amount
                        ? "border-yellow-400 ring-4 ring-yellow-300/50 scale-110"
                        : "border-gray-500 hover:border-yellow-400"
                    )}
                  >
                    <img
                      src={amount === 0.1 ? "/img4.png" :
                        amount === 0.5 ? "/img3.png" :
                          amount === 1 ? "/img2.png" : "/img1.png"}
                      className="w-full h-full object-cover rounded-full"
                      alt={`${amount} SOL chip`}
                    />
                    {selectedCoin === amount && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
                    )}
                  </button>
                  <span className="text-white text-xs lg:text-sm mt-1 lg:mt-2 font-medium text-center">
                    {amount} SOL
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-center font-semibold  text-xl gap-x-10 ">
              {amounts.map(x => {
                return <h2>{x} Sol</h2>
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={async () => {
              try {
                if (!wallet.publicKey || !selectedSide) {
                  return;
                }
                const transaction = new Transaction();

                transaction.add(SystemProgram.transfer({
                  fromPubkey: wallet.publicKey,
                  toPubkey: PLATFORM_PUBLIC_KEY,
                  lamports: amount * LAMPORTS_PER_SOL,
                }));
                const singnature = await wallet.sendTransaction(transaction, connection);
                const res = await axios.post(`${BACKEND_URL}/flip`, {
                  singnature,
                });
                if (res.data.won) {
                  setBalanceUpdate(!balanceUp);
                  alert("you won");
                } else {
                  setBalanceUpdate(!balanceUp);
                  alert("you lost");
                }
              } catch (err) {

              } finally {
                setIsFlipping(false);
              }
            }}
            disabled={!selectedSide || isFlipping}
            className={`cursor-pointer text-white flex  py-3 px-6 rounded-lg text-lg font-semibold ${!selectedSide || isFlipping
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isFlipping ? 'Flipping...' : 'Place Bet'}
          </button>
        </div>

        <p className="text-sm text-gray-400 text-center">
          Platform fee: {PLATFORM_FEE}%
        </p>
      </div>
    </div>
  </div>
}
