"use client";
import React, { useEffect, useState } from "react";
// import GiftBoxAnimation from "@/components/GiftBoxAnimation";
import ReactConfetti from "react-confetti";
import { useAppContext } from "../context/AppContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GiftBoxAnimation from "@/components/GiftBoxAnimation";

const Page = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const router = useRouter();

  const { localClickCount, localBestScore } = useAppContext();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window?.innerWidth, height: window?.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="bg-white h-screen w-full flex items-center justify-center text-slate-700 relative overflow-hidden">
      {/* shows the confetti when user has a highscore */}
      {localClickCount <= localBestScore && (
        <ReactConfetti
          width={windowSize?.width}
          height={windowSize?.height}
          numberOfPieces={200}
        />
      )}
      <div
        className={`h-[80%] w-[60%] mx-auto flex items-center justify-center flex-col gap-12`}
      >
        {/* title for result screen */}
        <h1 className="text-4xl font-bold text-center">
          Hurray!, you just completed your Game.
        </h1>

        {/* show total clicks */}
        <div className="flex max-sm:flex-col items-center justify-between gap-4 w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <h4 className="text-lg font-medium">Current score</h4>
            <h2 className="text-6xl font-bold">{localClickCount}</h2>
          </div>
          <Image
            src={"/dices.png"}
            width={400}
            height={400}
            alt={"dices"}
            placeholder="blur"
            blurDataURL="/dices.png"
            className="rounded-md max-h-[180px] object-cover"
          />
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-lg font-medium">Best score</h2>
            <h4 className="text-6xl font-bold">{localBestScore}</h4>
          </div>
        </div>

        {/* compare scores with that on local storage */}
        {/* Add an encouragement/reward message based on performance (e.g., if the user achieves a new best score). */}
        {localBestScore !== 0 ? (
          localClickCount <= localBestScore ? (
            <div className="flex flex-col items-center justify-center w-full gap-14">
              {localClickCount !== localBestScore ? (
                <h3 className="text-center text-xl">
                  That was splendid!!!... This score is equal to your best
                  score, here&apos;s your gift! 🎁
                </h3>
              ) : (
                <h3 className="text-center text-xl">
                  That was splendid!!!...you scored a better score than your
                  last attempt, here&apos;s your gift! 🎁
                </h3>
              )}
              <GiftBoxAnimation />
            </div>
          ) : (
            <h3 className="text-center text-xl">
              Nice job completing the game, you&apos;re just short of your best
              score.
            </h3>
          )
        ) : (
          <h3 className="text-center text-xl">
            Nice!!!...You&apos;ve set a new Record!!!
          </h3>
        )}
        {/* Restart Button & Game Reset */}
        <div className="flex gap8">
          <button
            onClick={() => router.push("/")}
            className="bg-green-500 px-8 py-4 text-semibold text-white rounded-lg"
          >
            Restart Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;

