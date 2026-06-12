import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react"

export default function SendSol() {

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const wallet = useWallet();
  const { connection } = useConnection();

  return <div className="border border-black flex flex-col justify-center">
    <div className="flex justify-center items-center h-[500px] w-[500px] bg-red-50">
      <div className="flex flex-col gap-y-2 border border-black rounded-md p-3">
        <div className="flex gap-x-3 items-center">
          <label>Address: </label>
          <input
            className="border border-black p-2 rounded-md"
            onChange={(e) => {
              setAddress(e.target.value);

            }}
            placeholder="address" value={address} />
        </div>
        <div className="flex gap-x-3 items-center">
          <label>Amount: </label>
          <input
            className="border border-black p-2 rounded-md"
            onChange={(e) => {
              setAmount(e.target.value)
            }}
            placeholder="amount" value={amount} />
        </div>
        <button onClick={async () => {
          const transction = new Transaction();
          if (wallet.publicKey && address) {
            console.log(wallet.publicKey);
            console.log(address);
            console.log(amount);
            transction.add(SystemProgram.transfer({
              fromPubkey: wallet.publicKey,
              toPubkey: new PublicKey(address),
              lamports: Number(amount) * LAMPORTS_PER_SOL
            }));
          }
          await wallet.sendTransaction(transction, connection);
          alert("sent sol , please check");
        }} className="cursor-pointer p-2 bg-green-50">Send</button>
      </div>
    </div>
  </div>
}
