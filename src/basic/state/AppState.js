import { INITIAL_PRODUCTS } from "../shared/constants/index.js";

class AppState {
  constructor() {
    this.state = {
      sum: null,
      prodList: [...INITIAL_PRODUCTS],
      bonusPts: 0,
      itemCount: 0,
      lastSel: null,
      totalAmt: 0,
      cartDisplay: null
    };
    this.subscribers = [];
  }

  getState() {
    return { ...this.state };
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notifySubscribers();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.state));
  }

  // Getter methods
  getSum() {
    return this.state.sum;
  }

  getProdList() {
    return [...this.state.prodList];
  }

  getBonusPts() {
    return this.state.bonusPts;
  }

  getItemCount() {
    return this.state.itemCount;
  }

  getLastSel() {
    return this.state.lastSel;
  }

  getTotalAmt() {
    return this.state.totalAmt;
  }

  getCartDisplay() {
    return this.state.cartDisplay;
  }

  // Setter methods
  setSum(sum) {
    this.setState({ sum });
  }

  setProdList(prodList) {
    this.setState({ prodList: [...prodList] });
  }

  setBonusPts(bonusPts) {
    this.setState({ bonusPts });
  }

  setItemCount(itemCount) {
    this.setState({ itemCount });
  }

  setLastSel(lastSel) {
    this.setState({ lastSel });
  }

  setTotalAmt(totalAmt) {
    this.setState({ totalAmt });
  }

  setCartDisplay(cartDisplay) {
    this.setState({ cartDisplay });
  }
}

export const appState = new AppState();