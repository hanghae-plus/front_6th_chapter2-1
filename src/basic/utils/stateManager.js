/** 초기 상태 값을 받아서 상태 관리 함수를 반환
 * @param initialValue - 초기 상태 값
 */
export function createState(initialValue) {
  let value = initialValue; // 현재 상태 값
  const listeners = new Set(); // 상태 변경을 구독할 리스너 집합

  /** 현재 상태 값을 반환 */
  function getState() {
    return value;
  }

  /** 상태 값을 갱신하고, 변경 시 구독자들에게 알림
   * @param newValue - 새로운 상태 값
   */
  function setState(newValue) {
    const nextValue = typeof newValue === 'function' ? newValue(value) : newValue;

    if (nextValue !== value) {
      value = nextValue;
      listeners.forEach((listener) => listener(value));
    }
  }

  /** 상태 변경 시 호출될 리스너를 등례
   * @param listener - 상태 변경 시 호출될 리스너
   */
  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return [getState, setState, subscribe];
}
