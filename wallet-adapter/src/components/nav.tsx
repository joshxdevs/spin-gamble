import { balanceUpdate } from "@/store/atom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export default function Nav() {
  const [balance, setBalance] = useState(0);
  const balanceUp = useAtomValue(balanceUpdate);


  const { connection } = useConnection();
  const wallet = useWallet();
  useEffect(() => {
    const main = async () => {
      if (wallet.publicKey) {
        let bal = await connection.getBalance(wallet.publicKey);
        bal = bal / LAMPORTS_PER_SOL;
        setBalance(bal);
      }
    }
    main();
  }, [wallet, connection, balanceUp]);



  return <div className="flex justify-between shadow-xl border-b-1 p-3">
    <div className="flex justify-center items-center text-[#5191f2] font-semibold text-2xl"><span className="text-[#5191f2]">100x</span>Gamble</div>
    <div className="flex gap-x-2 justify-center items-center">
      <WalletMultiButton />
      <div className="font-semibold text-xl">Balance: {balance}    </div>
    </div>
  </div>

}
