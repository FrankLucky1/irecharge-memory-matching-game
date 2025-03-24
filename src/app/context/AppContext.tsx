"use client";
import { getClickCount } from "@/functions/getClickCountFromLocalStorage";
import { getBestScore } from "@/functions/getScoreFromLocalStorage";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  cards: { id: number; image: string }[];
  setCards: (cards: { id: number; image: string }[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  flippedCards: number[];
  setFlippedCards: (flippedCards: number[]) => void;
  clickCount: number;
  localClickCount: number;
  setClickCount: (clickCount: number) => void;
  matchedCards: number[];
  setMatchedCards: (matchedCards: number[]) => void;
  isEvaluating: boolean;
  setIsEvaluating: (isEvaluating: boolean) => void;
  refresh: number;
  setRefresh: (prev: number) => void;
  bestScore: number;
  setBestScore: (bestScore: number) => void;
  localBestScore: number;
  isFlipped: (index: number) => boolean;
  handleCardClick: (index: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    // state declearation
  const [cards, setCards] = useState<{ id: number; image: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [clickCount, setClickCount] = useState<number>(0);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [refresh, setRefresh] = useState(0);
  const localBestScore = getBestScore() ?? 0;
  const localClickCount = getClickCount() ?? 0;

  const [bestScore, setBestScore] = useState(0);

//   function to compare if cards have been flipped
  const isFlipped = (index: number) =>
    flippedCards.includes(index) || matchedCards.includes(index);

  const handleCardClick = (index: number) => {
    if (
      isEvaluating ||
      flippedCards.includes(index) ||
      matchedCards.includes(index)
    ) {
      return;
    }

    // function to add flipped cards to an matchedCards array for comparison
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setClickCount(clickCount + 1);
      setIsEvaluating(true);
      const [firstIndex, secondIndex] = newFlippedCards;
      if (cards[firstIndex].image === cards[secondIndex].image) {
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
      }
      setTimeout(() => {
        setFlippedCards([]);
        setIsEvaluating(false);
      }, 1000);
    }
  };

  return (
    <AppContext.Provider
      value={{
        cards,
        setCards,
        loading,
        setLoading,
        flippedCards,
        setFlippedCards,
        clickCount,
        setClickCount,
        matchedCards,
        setMatchedCards,
        isEvaluating,
        setIsEvaluating,
        refresh,
        setRefresh,
        bestScore,
        setBestScore,
        localBestScore,
        localClickCount,
        isFlipped,
        handleCardClick,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

