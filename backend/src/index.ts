import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { PLATFORM_KEYPAIR, PLATFORM_PUBLIC_KEY } from "./config/utils";


const app = express();
app.use(cors());
app.use(express.json());
const connection = new Connection("https://api.devnet.solana.com");

app.post("/flip", async (req: Request, res: Response) => {
  // TODO: what if i send the signature many times , i still make a bet for them 
  const signature = req.body.singnature;

  try {
    const ans = await axios.post("https://api.devnet.solana.com", {
      jsonrpc: "2.0",
      id: 1,
      method: "getTransaction",
      params: [
        signature,
        {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
          encoding: "json"
        }
      ]
    });
    const accounts = await ans.data.result.transaction.message.accountKeys;
    const senderPublicKey = accounts[0];
    const receiverPublicKey = accounts[1];
    const preBalance = ans.data.result.meta.preBalances[1];
    const postBalance = ans.data.result.meta.postBalances[1];
    const amount = (postBalance - preBalance) / LAMPORTS_PER_SOL;

    if (receiverPublicKey != PLATFORM_PUBLIC_KEY || amount < 0.1 || !ans.data.result) {
      res.json({
        msg: "transaction failed ",
      });
      return;
    }
    const { blockhash } = await connection.getLatestBlockhash();
    const winOrLoose = Math.random() < 0.5;
    console.log(winOrLoose);

    if (winOrLoose) {
      //TODO: what if this request to transfer solana to user fails 
      const transaction = new Transaction({
        feePayer: PLATFORM_PUBLIC_KEY,
        recentBlockhash: blockhash,
      });
      transaction.add(SystemProgram.transfer({
        fromPubkey: PLATFORM_PUBLIC_KEY,
        toPubkey: senderPublicKey,
        lamports: (amount * LAMPORTS_PER_SOL) * 2
      }));

      await connection.sendTransaction(transaction, [PLATFORM_KEYPAIR]);
      console.log("you won");
      res.json({
        won: true,
        msg: "you won",
      });
    } else {
      console.log("you lost ");
      res.json({
        won: false,
        msg: "you lost"
      })
    }
  } catch (err) {
    console.log("error occured while sending rpc request", err);
  }
});

app.post("/roulette", async (req: Request, res: Response) => {
  console.log(req.body);
  const signature = req.body.signature;
  console.log("actual signature", signature);
  const selectedNumber = req.body.selectedNumber;

  try {
    const ans = await axios.post("https://api.devnet.solana.com", {
      jsonrpc: "2.0",
      id: 1,
      method: "getTransaction",
      params: [
        signature,
        {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
          encoding: "json"
        }
      ]
    });
    console.log(ans.data);
    const accounts = await ans.data.result.transaction.message.accountKeys;
    const senderPublicKey = accounts[0];
    const receiverPublicKey = accounts[1];
    const preBalance = ans.data.result.meta.preBalances[1];
    const postBalance = ans.data.result.meta.postBalances[1];
    const amount = (postBalance - preBalance) / LAMPORTS_PER_SOL;

    if (receiverPublicKey != PLATFORM_PUBLIC_KEY || amount < 0.1 || !ans.data.result) {
      res.json({
        msg: "transaction failed ",
      });
      return;
    }
    const { blockhash } = await connection.getLatestBlockhash();
    const randomNumber = Math.floor(Math.random() * 37);
    if (selectedNumber == randomNumber) {
      const transaction = new Transaction();
      transaction.add(SystemProgram.transfer({
        fromPubkey: PLATFORM_PUBLIC_KEY,
        toPubkey: senderPublicKey,
        lamports: 10 * (amount / LAMPORTS_PER_SOL),
      }));
      await connection.sendTransaction(transaction, [PLATFORM_KEYPAIR]);
      console.log("JACKPOT");
      res.json({
        number: randomNumber,
        msg: "won"
      });
    } else {
      console.log("you lost");
      res.json({
        number: randomNumber,
        msg: "lost"
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
})
