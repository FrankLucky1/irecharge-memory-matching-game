import React from "react";

const AnimatedLoadingBox = () => {
  return (
    <div className="grid grid-cols-4 grid-rows-4 w-[300px] h-[300px] sm:w-[350px] sm:h-[350px]  lg:h-[500px] lg:w-[500px] mx-auto gap-3 mt-4">
      {Array.from({ length: 16 }).map((_, index) => (
        <div
          key={index}
          className="w-full h-full bg-gray-300 animate-pulse rounded-md lg:rounded-2xl"
        ></div>
      ))}
    </div>
  );
};

export default AnimatedLoadingBox;

