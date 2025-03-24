"use client";
import { getBestScore } from "@/functions/getScoreFromLocalStorage";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "./context/AppContext";
import AnimatedLoadingBox from "@/components/AnimatedLoadingBox";

export default function Home() {
  const router = useRouter();

  const {
    cards,
    setCards,
    loading,
    setLoading,
    setFlippedCards,
    clickCount,
    setClickCount,
    matchedCards,
    setMatchedCards,
    setIsEvaluating,
    refresh,
    setRefresh,
    bestScore,
    localBestScore,
    setBestScore,
    isFlipped,
    handleCardClick,
  } = useAppContext();

  // function to call images from picsum
  const fetchImages = async () => {
    try {
      const requests = Array.from({ length: 8 }, (_, i) =>
        axios.get(`https://picsum.photos/200?random=${i + 1}`, {
          responseType: "blob",
        })
      );
      const responses = await Promise.all(requests);
      const imageUrls = responses.map((response) =>
        URL.createObjectURL(response.data)
      );
      const shuffledImages = [...imageUrls, ...imageUrls]
        .sort(() => Math.random() - 0.5)
        .map((image, index) => ({ id: index + 1, image }));
      setCards(shuffledImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const localScore = getBestScore();
    setBestScore(localScore || 0);
  }, [refresh]);

  // refetches data when the refetch value changes
  useEffect(() => {
    fetchImages();
  }, [refresh]);

  // this resets the states and restarts the app
  useEffect(() => {
    setCards([]);
    setClickCount(0);
    setFlippedCards([]);
    setIsEvaluating(false);
    setMatchedCards([]);
  }, [refresh]);

  // this use effect sets the current clicked count if higher than previous into local storage, and also compares both scores
  useEffect(() => {
    if (matchedCards.length === 16) {
      const newBestScore = clickCount * 2;
      setLoading(true);
      localStorage.setItem(
        "irechargeTestClickCount",
        JSON.stringify(newBestScore)
      );

      if (newBestScore !== 0 && newBestScore < localBestScore) {
        setLoading(true);
        localStorage.setItem(
          "irechargeTestcompletionscore",
          JSON.stringify(newBestScore)
        );
      }
      if (localBestScore === 0) {
        setLoading(true);
        localStorage.setItem(
          "irechargeTestcompletionscore",
          JSON.stringify(newBestScore)
        );
      }

      // this timeout helps to create a delay before moving to the result page and empties the matched cards
      setTimeout(() => {
        setLoading(true);
        setMatchedCards([]);
        router.push("/result");
      }, 2000);
    }
  }, [matchedCards]);

  return (
    <div className="flex items-center justify-center flex-col w-full min-h-screen bg-white">
      <div className="bg-white h-[80%] w-[80%] py-12 flex flex-col gap-6 items-center justify-center">
        <h1 className="capitalize text-black font-bold text-2xl text-center lg:text-4xl">
          IRecharge Memory Matching Game
        </h1>
        <div className="flex justify-between items-center w-[300px] lg:w-[400px] mx-auto">
          <p className="text-slate-500">
            Your best score is: {bestScore || 0}{" "}
          </p>
          <p className={`text-slate-500`}>Current click: {clickCount * 2}</p>
        </div>
        {/* when loading it shows an animated box */}
        {loading ? (
          <AnimatedLoadingBox />
        ) : (
          //
          <div className="grid grid-cols-4 grid-rows-4 w-[300px] h-[300px] sm:w-[350px] sm:h-[350px]  lg:h-[500px] lg:w-[500px] mx-auto gap-3 mt-4">
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className="relative w-full h-full"
                style={{
                  perspective: "1000px",
                }}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform ${
                    isFlipped(index) ? "rotate-y-180" : ""
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* backface of the cards before they're flipped */}
                  <div
                    className="absolute w-full h-full overflow-clip text-black flex items-center justify-center text-center rounded-md lg:rounded-2xl backface-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="relative w-full h-full">
                      <span className="absolute z-10 bg-black/80  cursor-pointer w-full text-3xl h-full text-white flex items-center justify-center">
                        ?
                      </span>
                      <Image
                        src={"/pattern-2.jpg"}
                        width={400}
                        height={400}
                        alt={`Card ${card.id}`}
                        className="rounded-md "
                        blurDataURL={"/pattern-2.jpg"}
                        placeholder="blur"
                      />
                    </div>
                  </div>
                  {/*  image face of the images after they're flipped */}
                  <div
                    className="absolute w-full h-full "
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <Image
                      src={card.image}
                      width={400}
                      height={400}
                      alt={`Card ${card.id}`}
                      className="rounded-md"
                      placeholder="blur"
                      blurDataURL={card.image}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
        disabled={loading}
          onClick={() => setRefresh(refresh + 1)}
          className="bg-green-600 rounded-xl text-white px-6 py-2 cursor-pointer"
        >
          Reset game
        </button>
      </div>
    </div>
  );
}

