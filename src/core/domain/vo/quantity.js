class Quantity {
  constructor(value) {
    if (value < 0) {
      throw new Error("수량은 0 이상이어야 합니다.");
    }

    this.value = value;
  }

  add(quantity) {
    return new Quantity(this.value + quantity.getQuantity());
  }

  subtract(quantity) {
    return new Quantity(Math.max(0, this.value - quantity.getQuantity()));
  }

  isGreaterThan(quantity) {
    return this.value > quantity.getQuantity();
  }

  isLessThan(quantity) {
    return this.value < quantity.getQuantity();
  }

  equals(quantity) {
    return this.value === quantity.getQuantity();
  }

  getQuantity() {
    return this.value;
  }
}

export default Quantity;
