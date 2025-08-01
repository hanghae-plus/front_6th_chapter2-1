export const useDOMManager = {
  elements: {
    stockStatus: null,
    productSelect: null,
    addToCartButton: null,
    cartDisplay: null,
    cartSummary: null,
  } as Record<string, HTMLElement | null>,

  state: {
    lastSelectedProductId: null,
  } as Record<string, any>,

  getElement(elementName: string): HTMLElement | null {
    return this.elements[elementName];
  },

  setElement(elementName: string, element: HTMLElement | null): void {
    this.elements[elementName] = element;
  },

  getState(stateName: string): any {
    return this.state[stateName];
  },

  setState(stateName: string, value: any): void {
    this.state[stateName] = value;
  },
};
