import { DependencyList, useEffect } from "react";

export const useIntervalEffect = <T = unknown>(
  fn: () => T,
  { delay = 0, interval = 30000 },
  deps: DependencyList = []
) => {
  let intervalId: number, delayId: number;

  useEffect(() => {
    delayId = setTimeout(() => {
      intervalId = setInterval(fn, interval);
    }, delay);

    return () => {
      clearTimeout(delayId);
      clearInterval(intervalId);
    };
  }, deps);
};
