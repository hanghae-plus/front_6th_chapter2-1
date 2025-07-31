export const useDelayedInterval = (fn, { delay = 0, interval = 30000 }) => {
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
