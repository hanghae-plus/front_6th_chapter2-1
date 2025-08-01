export const setupIntervalEvent = ({ action, delay = 10000, interval = 30000 }) => {
  setTimeout(() => {
    setInterval(() => {
      action();
    }, interval);
  }, delay);
};
