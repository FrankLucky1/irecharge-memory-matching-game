export const getClickCount = () => {
  if (typeof window === "undefined") return null;

  const clickCount = localStorage.getItem("irechargeTestClickCount");
  return clickCount === null || clickCount === undefined
    ? 0
    : parseInt(clickCount, 10) || 0;
};

