import { IntervalEventConfig } from '../types';

export const setupIntervalEvent = ({
  action,
  delay = 10000,
  interval = 30000,
}: IntervalEventConfig): void => {
  setTimeout(() => {
    setInterval(() => {
      action();
    }, interval);
  }, delay);
};
