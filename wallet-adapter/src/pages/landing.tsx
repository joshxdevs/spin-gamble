import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl text-[#5191f2]  font-extrabold mb-4"
        >
          100xGamble
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-gray-300 max-w-2xl"
        >
          100x your money in this platform. Play, win, and multiply your fortune instantly.
        </motion.p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-20 pb-20">
        <Card className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <img
            src="/coin.jpg"
            alt="Coin Flip"
            className="w-full h-100 object-cover"
          />
          <CardContent className="p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-3">Coin Flip</h2>
            <p className="text-gray-400 mb-4 text-center">
              Double your bet instantly with our fast coin flip game.
            </p>
            <Button onClick={() => {
              navigate("/coinFlip")
            }} className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl">
              Play Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden ">
          <img
            src="https://res.cloudinary.com/kalispel/image/upload/f_auto,w_1600,q_auto/v1714690433/Craft%20Images/Roulette_header_2750x1600_jsg1ap.jpg"
            className="w-full h-100 object-cover  "
          />
          <CardContent className="p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-3">Roulette</h2>
            <p className="text-gray-400 mb-4 text-center">
              Bet on your lucky number and win big on the roulette table.
            </p>
            <Button onClick={() => {
              navigate("/roulette")
            }} className=" cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl">
              Play Now
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
