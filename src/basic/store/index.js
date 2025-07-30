export const createStore = (initialState, actions = {}) => {
  let state = initialState;
  const listeners = [];

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

      // 모든 액션은 상태 변경을 위한 것이므로 결과를 새로운 state로 설정
      if (result && typeof result === "object") {
        store.setState(result);
        return result;
      }
      return result;
    };
  });
  return {
    ...store,
    ...boundActions,
  };
};
