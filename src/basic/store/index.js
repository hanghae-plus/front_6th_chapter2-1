export const ACTION_TYPE = {
  QUERY: "QUERY",
};

/**
 * 스토어 생성
 * @param {Object} initialState - 초기 상태
 * @param {Object} actions - 액션 함수들
 * @returns {Object} 스토어 객체
 */
export const createStore = (initialState, actions = {}) => {
  let state = initialState;
  const listeners = [];

  // 스토어 객체 생성
  const store = {
    getState: () => state,
    setState: (newState) => {
      state = newState;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
  };

  // action 함수들을 store에 바인딩
  const boundActions = {};
  Object.keys(actions).forEach((actionName) => {
    boundActions[actionName] = (...args) => {
      const result = actions[actionName](state, ...args);

      if (!result) return;

      // 모든 액션은 상태 변경을 위한 것이므로 결과를 새로운 state로 설정
      if (typeof result === "object" && result.type === "QUERY") {
        return result.data;
      }
      store.setState(result);
      return result;
    };
  });
  return {
    ...store,
    ...boundActions,
  };
};
