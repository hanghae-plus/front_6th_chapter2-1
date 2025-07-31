import { useEffect } from 'react';

import { LIGHTNING_DELAY, LIGHTNING_INTERVAL, SUGGEST_DELAY, SUGGEST_INTERVAL } from '../constant';
import type { Action } from '../reducer';

export function useSaleTimers(dispatch: React.Dispatch<Action>) {
  useEffect(() => {
    const startLightningSale = () => {
      dispatch({
        type: 'START_LIGHTNING_SALE',
        payload: {
          productId: '',
        },
      });
    };

    const startSuggestSale = () => {
      dispatch({
        type: 'START_SUGGEST_SALE',
        payload: {
          productId: '',
        },
      });
    };

    const lightningTimeoutId = setTimeout(() => {
      const lightningIntervalId = setInterval(startLightningSale, LIGHTNING_INTERVAL);
      return lightningIntervalId;
    }, LIGHTNING_DELAY);

    const suggestTimeoutId = setTimeout(() => {
      const suggestIntervalId = setInterval(startSuggestSale, SUGGEST_INTERVAL);
      return suggestIntervalId;
    }, SUGGEST_DELAY);

    return () => {
      clearTimeout(lightningTimeoutId);
      clearTimeout(suggestTimeoutId);
    };
  }, [dispatch]);
}
