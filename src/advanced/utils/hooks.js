import { useEffect } from "react";

export const useIntervalEffect = (fn, { delay = 0, interval = 30000 }) => {
  let intervalId, delayId;

  useEffect(() => {
    delayId = setTimeout(() => {
      intervalId = setInterval(fn, interval);
    }, delay);

    return () => {
      clearTimeout(delayId);
      clearInterval(intervalId);
    };
  }, []);
};
