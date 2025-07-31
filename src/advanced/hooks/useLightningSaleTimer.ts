import { useRef } from 'react';

import { DISCOUNT_RATE_LIGHTNING } from '@/advanced/data/discount.data';
import { LIGHTNING_SALE_INTERVAL, LIGHTNING_SALE_MAX_DELAY } from '@/advanced/data/time.data';
import { useProductStore } from '@/advanced/store';

export default function useLightningSaleTimer() {
  const { products, setProductOnSale } = useProductStore();

  const lightningIntervalId = useRef<number | null>(null);
  const lightningTimeoutId = useRef<number | null>(null);

  function executeLightningSale() {
    const luckyIdx = Math.floor(Math.random() * products.length);
    const luckyItem = products[luckyIdx];

    if (luckyItem.stock > 0 && !luckyItem.onSale) {
      setProductOnSale(luckyItem.id, DISCOUNT_RATE_LIGHTNING);

      alert(
        '⚡번개세일! ' + luckyItem.name + '이(가) ' + DISCOUNT_RATE_LIGHTNING + '% 할인 중입니다!'
      );
    }
  }

  function startLightningSaleTimer() {
    const lightningDelay = Math.random() * LIGHTNING_SALE_MAX_DELAY;

    lightningTimeoutId.current = setTimeout(() => {
      lightningIntervalId.current = setInterval(executeLightningSale, LIGHTNING_SALE_INTERVAL);
    }, lightningDelay);
  }

  function stopLightningSaleTimer() {
    if (lightningTimeoutId.current) {
      clearTimeout(lightningTimeoutId.current);
      lightningTimeoutId.current = null;
    }

    if (lightningIntervalId.current) {
      clearInterval(lightningIntervalId.current);
      lightningIntervalId.current = null;
    }
  }

  function restartLightningSaleTimer() {
    stopLightningSaleTimer();
    startLightningSaleTimer();
  }

  return {
    start: startLightningSaleTimer,
    stop: stopLightningSaleTimer,
    restart: restartLightningSaleTimer,
  };
}
