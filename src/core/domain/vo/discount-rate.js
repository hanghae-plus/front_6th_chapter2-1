class DiscountRate {
  #decimalValue;

  constructor(decimalValue) {
    if (decimalValue < 0 || decimalValue > 1) {
      throw new Error("할인율은 0 ~ 1 사이여야 합니다.");
    }

    this.#decimalValue = decimalValue;
  }

  static fromDecimal(decimalValue) {
    return new DiscountRate(decimalValue);
  }

  static fromPercentage(percentage) {
    if (percentage < 0 || percentage > 100) {
      throw new Error("할인율은 0% ~ 100% 사이여야 합니다.");
    }

    return new DiscountRate(percentage / 100);
  }

  static fromString(str) {
    const match = str.match(/^(\d+(?:\.\d+)?)%$/);

    if (!match) throw new Error("올바른 퍼센트 형식이 아닙니다");

    return DiscountRate.fromPercentage(parseFloat(match[1]));
  }

  getDecimalValue() {
    return this.#decimalValue;
  }

  getPercentage() {
    return this.#decimalValue * 100;
  }

  format() {
    return `${this.getPercentage()}%`;
  }
}

export default DiscountRate;
