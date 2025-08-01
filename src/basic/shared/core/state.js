/**
 * 함수형 상태 관리 시스템
 * 리액트의 useState 패턴을 모방한 순수 함수 기반 상태 관리
 */

// 상태 저장소
const stateStore = new Map();

/**
 * 상태 생성 및 관리
 * @param {string} key - 상태 키
 * @param {any} initialState - 초기 상태
 * @returns {[any, Function]} [상태, 상태 업데이트 함수]
 */
export const createState = (key, initialState) => {
  if (!stateStore.has(key)) {
    stateStore.set(key, initialState);
  }

  const getState = () => stateStore.get(key);
  const setState = updates => {
    const currentState = getState();
    const newState =
      typeof updates === 'function'
        ? updates(currentState)
        : { ...currentState, ...updates };

    stateStore.set(key, newState);
    return newState;
  };

  return [getState, setState];
};
