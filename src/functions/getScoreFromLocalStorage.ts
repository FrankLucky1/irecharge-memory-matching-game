export const getBestScore = () => {
    if (typeof window === "undefined") return null;
    
    const score = localStorage.getItem("irechargeTestcompletionscore");
    return score === null || score === undefined ? 0 : parseInt(score, 10) || 0;
};