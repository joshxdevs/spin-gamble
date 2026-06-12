import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { rouletteNumbers } from '../config/utils';

interface RouletteWheelProps {
  isSpinning: boolean;
  finalNumber: number;
  onSpinComplete: () => void;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({
  isSpinning,
  finalNumber,
  onSpinComplete
}) => {
  const {
    finalIndex,
    anglePerSegment,
    finalAngle,
    wheelTargetRotation,
    ballTargetRotation
  } = useMemo(() => {
    const idx = rouletteNumbers.findIndex(n => n.number === finalNumber);
    const angle = 360 / rouletteNumbers.length;
    const centerAngle = (idx >= 0 ? idx : 0) * angle + angle / 2;
    const angleToFinal = -centerAngle;
    const totalSpins = 6;
    const wheelRotate = isSpinning ? angleToFinal + totalSpins * 360 : angleToFinal;
    const ballSpins = 8;
    const ballRotate = isSpinning ? -(ballSpins * 360) : 0;

    return {
      finalIndex: idx,
      anglePerSegment: angle,
      finalAngle: angleToFinal,
      wheelTargetRotation: wheelRotate,
      ballTargetRotation: ballRotate
    };
  }, [finalNumber, isSpinning]);

  return (
    <div className="relative w-[20rem] h-[20rem] md:w-[34rem] md:h-[34rem] select-none">
      {/* Enhanced Outer rim with realistic casino styling */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 shadow-2xl border-8 border-amber-900">
        {/* Wood grain effect */}
        <div className="absolute inset-0 rounded-full opacity-30 bg-[radial-gradient(ellipse_at_30%_30%,transparent,rgba(0,0,0,0.3))] mix-blend-multiply"></div>
      </div>

      {/* Enhanced shadow and depth */}
      <div className="absolute inset-2 rounded-full bg-[radial-gradient(closest-side,rgba(0,0,0,0.4),rgba(0,0,0,0.1)_60%)] pointer-events-none" />

      {/* Main wheel with enhanced styling */}
      <motion.div
        className="absolute inset-4 rounded-full bg-neutral-900 shadow-inner overflow-hidden border-2 border-amber-600"
        initial={{ rotate: finalAngle }}
        animate={{ rotate: wheelTargetRotation }}
        transition={{ duration: 7, ease: [0.17, 0.67, 0.12, 0.99] }}
        onAnimationComplete={() => { if (isSpinning) onSpinComplete(); }}
        style={{ willChange: 'transform' }}
      >
        {/* Enhanced segment dividers */}
        {rouletteNumbers.map((_, index) => (
          <div
            key={`divider-${index}`}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${index * anglePerSegment}deg)`, transformOrigin: 'center' }}
          >
            <div className="absolute top-2 left-1/2 w-0.5 h-[calc(50%-12px)] -translate-x-1/2 bg-gradient-to-b from-amber-300 to-amber-500 shadow-sm" />
          </div>
        ))}

        {/* Enhanced number segments */}
        {rouletteNumbers.map((item, index) => {
          const angle = (index * 360) / rouletteNumbers.length + anglePerSegment / 2;
          const isGreen = item.color === 'green';
          const isRed = item.color === 'red';
          const display = item.number === 0 && index === rouletteNumbers.length - 1 ? '00' : String(item.number);
          const isWinning = finalIndex === index && !isSpinning;

          return (
            <div
              key={`${item.number}-${index}`}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${angle}deg)`, transformOrigin: 'center' }}
            >
              <div
                className={`absolute top-2 left-1/2 -translate-x-1/2 flex items-center justify-center text-white font-black tracking-wide rounded-b-sm shadow-xl border border-opacity-20 ${isGreen
                  ? 'bg-gradient-to-b from-green-500 to-green-700 border-green-300'
                  : isRed
                    ? 'bg-gradient-to-b from-red-500 to-red-700 border-red-300'
                    : 'bg-gradient-to-b from-gray-800 to-black border-gray-600'
                  } ${isWinning ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-neutral-900 animate-pulse' : ''}`}
                style={{
                  width: '2.8rem',
                  height: '2.4rem',
                  clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}
              >
                <span className="text-base md:text-lg font-black drop-shadow-lg">{display}</span>
              </div>
            </div>
          );
        })}

        {/* Enhanced center hub */}
        <div className="absolute inset-1/2 w-12 h-12 -ml-6 -mt-6 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 shadow-2xl border-4 border-amber-300">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 shadow-inner">
            <div className="absolute inset-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-amber-100 shadow-sm"></div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced ball with realistic physics */}
      <motion.div
        className="absolute inset-4"
        initial={{ rotate: 0 }}
        animate={{ rotate: ballTargetRotation }}
        transition={{ duration: 7, ease: [0.17, 0.67, 0.12, 0.99] }}
        style={{ willChange: 'transform' }}
      >
        <div className="absolute top-1.5 left-1/2 w-3 h-3 -translate-x-1/2 bg-gradient-to-br from-white to-gray-200 rounded-full shadow-lg border border-gray-300">
          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full opacity-80"></div>
        </div>
      </motion.div>

      {/* Enhanced pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
        <div className="relative">
          <div className="w-0 h-0 border-l-5 border-r-5 border-b-10 border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg filter" />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-b-6 border-l-transparent border-r-transparent border-b-yellow-300" />
        </div>
      </div>

      {/* Enhanced glass reflection */}
      <div className="absolute inset-4 rounded-full pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60" />
      <div className="absolute inset-6 rounded-full pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-transparent" />
    </div>
  );
};

export default RouletteWheel;
