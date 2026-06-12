import clsx from "clsx";
import RouletteWheel from "../components/rouletteWhele";
import { BACKEND_URL, PLATFORM_PUBLIC_KEY, rouletteNumbers } from "../config/utils";
import { amounts } from "./coinFlip";
import { useState } from "react";
import axios from "axios";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import Nav from "@/components/nav";
import { useAtom } from "jotai";
import { balanceUpdate } from "@/store/atom";



export default function Roul() {
  const [selectedCoin, setSelectedCoin] = useState(0);
  const [balanceUp, setBalanceUpdate] = useAtom(balanceUpdate);
  const [betAmount, setBetAmount] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [finalNumber, setFinalNumber] = useState(null);

  const wallet = useWallet();
  const { connection } = useConnection();



  return <div>
    <div className="min-h-screen w-full bg-[url('/green-new.png')] bg-cover bg-center bg-no-repeat">

      <Nav />
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-x-3">
        <div className="w-full lg:w-1/2 min-h-[400px] lg:h-screen flex justify-center">
          <div className="flex flex-col justify-center">
            <RouletteWheel isSpinning={isSpinning} finalNumber={finalNumber || 0} onSpinComplete={() => {
              if (finalNumber == selectedNumber) {
                alert("you won , jackpot");
                setBalanceUpdate(!balanceUp)
              } else {
                alert("you lost ");
                setBalanceUpdate(!balanceUp)
              }
            }} />
          </div>
        </div>
        <div className="w-full lg:w-1/2 min-h-screen lg:h-screen flex flex-col justify-between">


          <div className="mt-20 lg:mt-40 grid grid-cols-13 mx-4 lg:mr-8 ">
            {rouletteNumbers.map((x: any) => {
              return <button
                onClick={() => {

                  setBetAmount(selectedCoin);
                  setSelectedNumber(x.number);

                }} className={clsx(x.color == 'red' ? " bg-[#e70f19] " : " bg-[#303030] ") + clsx(selectedNumber == x.number ? "border border-black bg-white shadow-inner" : "") + "text-white h-12 w-12 md:h-16 md:w-16 lg:h-18 lg:w-18 cursor-pointer text-sm md:text-base lg:text-lg font-bold"}>{x.number}</button>
            })}
          </div>



          <div className="bg-gray-800 mb-20 lg:mb-40 mx-4 lg:mr-8 rounded-xl p-4 lg:p-6 shadow-2xl border border-gray-700">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

              {/* Coin Selection */}
              <div className="flex flex-col items-center">
                <h3 className="text-white font-semibold mb-3 text-lg">Select Bet Amount</h3>
                <div className="flex flex-wrap gap-2 lg:gap-3 justify-center">
                  {amounts.map((amount) => (
                    <div key={amount} className="flex flex-col items-center">
                      <button
                        onClick={() => setSelectedCoin(amount)}
                        className={clsx(
                          "relative h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full border-2 transition-all duration-300",
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
                        />
                        {selectedCoin === amount && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
                        )}
                      </button>
                      <span className="text-white text-sm mt-2 font-medium">{amount} SOL</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bet Info */}
              <div className="flex flex-col items-center gap-4">
                <div className="bg-gray-700 rounded-lg p-3 lg:p-4 min-w-[150px] lg:min-w-[200px]">
                  <div className="text-center">
                    <div className="text-gray-300 text-sm">Total Bet</div>
                    <div className="text-white text-xl lg:text-2xl font-bold">
                      {(parseFloat(betAmount.toString() || "0")).toFixed(1)} SOL
                    </div>
                  </div>
                </div>

                {/* Spin Button */}
                <button
                  onClick={async () => {
                    if (!wallet.publicKey) {
                      return;
                    }
                    const transaction = new Transaction();

                    transaction.add(SystemProgram.transfer({
                      fromPubkey: wallet.publicKey,
                      toPubkey: PLATFORM_PUBLIC_KEY
                      ,
                      lamports: betAmount * LAMPORTS_PER_SOL,
                    }));
                    const singnature = await wallet.sendTransaction(transaction, connection);
                    const res = await axios.post(`${BACKEND_URL}/roulette`, {
                      signature: singnature
                    });
                    console.log(res.data);
                    const finalNumber = res.data.number;
                    const message = res.data.message;
                    if (message == "won") {
                      setFinalNumber(finalNumber);
                      setIsSpinning(true);
                      // show user won
                    } else {
                      setFinalNumber(finalNumber);
                      setIsSpinning(true);
                    }
                    //TODO: win or loose
                  }}
                  disabled={!selectedCoin || selectedNumber == 0}
                  className={clsx(
                    "relative px-6 lg:px-8 py-3 lg:py-4 rounded-full font-bold text-lg lg:text-xl transition-all duration-300",
                    "shadow-xl transform hover:scale-105 disabled:transform-none",
                    "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500",
                    "text-black border-2 border-yellow-300",
                    "disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:border-gray-600",
                    "disabled:cursor-not-allowed",
                  )}
                >
                  SPIN TO WIN
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div >
}
