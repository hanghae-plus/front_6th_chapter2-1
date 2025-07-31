import useLightningSaleTimer from '@/advanced/hooks/useLightningSaleTimer';
import useSuggestionSaleTimer from '@/advanced/hooks/useSuggestionSaleTimer';

export default function useTimer() {
  const lightningSaleTimer = useLightningSaleTimer();
  const suggestionSaleTimer = useSuggestionSaleTimer();

  function startAllTimers() {
    lightningSaleTimer.start();
    suggestionSaleTimer.start();
  }

  function stopAllTimers() {
    lightningSaleTimer.stop();
    suggestionSaleTimer.stop();
  }

  function restartAllTimers() {
    stopAllTimers();
    startAllTimers();
  }

  return {
    startAll: startAllTimers,
    stopAll: stopAllTimers,
    restartAll: restartAllTimers,
    startLightningSale: lightningSaleTimer.start,
    stopLightningSale: lightningSaleTimer.stop,
    startSuggestionSale: suggestionSaleTimer.start,
    stopSuggestionSale: suggestionSaleTimer.stop,
  };
}
