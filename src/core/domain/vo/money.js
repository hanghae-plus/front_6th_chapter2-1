class Money {
  constructor(amount, currency = "KRW") {
    this.amount = amount;
    this.currency = currency;
  }

  getAmount() {
    return this.amount;
  }

  add(money) {
    return new Money(this.getAmount() + money.getAmount());
  }

  subtract(money) {
    return new Money(this.getAmount() - money.getAmount());
  }

  multiply(multiplier) {
    return new Money(this.getAmount() * multiplier);
  }

  applyDiscount(discountRate) {
    return new Money(this.getAmount() * (1 - discountRate.getDecimalValue()));
  }

  equals(money) {
    return (
      this.getAmount() === money.getAmount() &&
      this.getCurrency() === money.getCurrency()
    );
  }

  getCurrency() {
    return this.currency;
  }

  format() {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: this.getCurrency(),
    }).format(this.getAmount());
  }
}

export default Money;
