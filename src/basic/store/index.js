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

      // 결과가 객체이고 state 속성이 있으면 상태 변경으로 간주
      if (result && typeof result === "object" && "state" in result) {
        store.setState(result.state);
        return result.data; // 데이터 반환
      } else {
        // 조회 함수는 결과만 반환
        return result;
      }
    };
  });
  return {
    ...store,
    ...boundActions,
  };
};
