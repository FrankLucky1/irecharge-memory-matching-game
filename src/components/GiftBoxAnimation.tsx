"use client";
import { motion } from "framer-motion";

const GiftBoxAnimation = () => {
  const showGift = true;
  return (
    <div className="hidden lg:flex flex-col items-center justify-center">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Box Lid Animation */}
        <motion.div
          className={`absolute top-0 w-40 h-10 bg-yellow-400 border-3 border-amber-600 ${
            showGift ? "rounded-b-lg" : "rounded-t-lg"
          }`}
          initial={{ y: 0 }}
          animate={showGift ? { y: -50, rotateX: 180 } : { y: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* Box Base */}
        <div className="w-40 h-30 bg-yellow-400 border-4 border-yellow-600 rounded-b-lg flex items-center justify-center">
          {showGift && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-[100px]"
            >
              🎁
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftBoxAnimation;

