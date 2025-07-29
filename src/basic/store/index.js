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
      const newState = actions[actionName](state, ...args);
      store.setState(newState);
    };
  });

  return {
    ...store,
    ...boundActions,
  };
};
