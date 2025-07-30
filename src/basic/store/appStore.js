import Store from "../lib/Store";

const appState = {
  itemCounts: 0,
  lastSelect: null,
  totalAmount: 0,
};

const appStore = new Store(appState);

export const resetAppStore = () => appStore.setState(appState);

export default appStore;
