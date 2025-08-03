export const SALE_EVENT = {
  NONE: 0x0,
  LIGHTNING: 0x1,
  SUGGEST: 0x2,
  ALL: 0x3,
};

interface SaleRecord {
  emoji: string;
  emojiWithText: string;
  text: string;
  className: {
    text: string;
    font: string;
  };
  rate: number;
}

const None: SaleRecord = {
  emoji: '',
  emojiWithText: '',
  text: '',
  className: {
    text: '',
    font: '',
  },
  rate: 0,
};

const Lightning: SaleRecord = {
  emoji: '⚡',
  emojiWithText: '⚡SALE',
  text: '20% SALE!',
  className: {
    text: 'text-red-500',
    font: 'font-bold',
  },
  rate: 0.2,
};

const Suggest: SaleRecord = {
  emoji: '💝',
  emojiWithText: '💝SALE',
  text: '5% 추천할인!',
  className: {
    text: 'text-blue-500',
    font: 'font-bold',
  },
  rate: 0.05,
};

const All: SaleRecord = {
  emoji: `${Lightning.emoji}${Suggest.emoji}`,
  emojiWithText: `${Lightning.emojiWithText}${Suggest.emojiWithText}`,
  text: '25% SUPER SALE!',
  className: {
    text: 'text-purple-600',
    font: 'font-bold',
  },
  rate: Lightning.rate + Suggest.rate,
};

type SaleEventInput = number | { saleEvent: number };

function checkSaleEvent(input: SaleEventInput, event: number): boolean {
  const inputEvent = typeof input === 'number' ? input : input.saleEvent;

  if (event === SALE_EVENT.NONE) {
    return (inputEvent | event) === event;
  }

  return (inputEvent & event) === event;
}

export function hasNoneSale(input: SaleEventInput): boolean {
  return checkSaleEvent(input, SALE_EVENT.NONE);
}

export function hasAllSale(input: SaleEventInput): boolean {
  return checkSaleEvent(input, SALE_EVENT.ALL);
}

export function hasLightningSale(input: SaleEventInput): boolean {
  return checkSaleEvent(input, SALE_EVENT.LIGHTNING);
}

export function hasSuggestSale(input: SaleEventInput): boolean {
  return checkSaleEvent(input, SALE_EVENT.SUGGEST);
}

export function getSaleRecord(input: SaleEventInput): SaleRecord {
  if (checkSaleEvent(input, SALE_EVENT.ALL)) {
    return All;
  }

  if (checkSaleEvent(input, SALE_EVENT.LIGHTNING)) {
    return Lightning;
  }

  if (checkSaleEvent(input, SALE_EVENT.SUGGEST)) {
    return Suggest;
  }

  return None;
}

// export function isNoneSale(saleEvent: number): boolean {
//   return (saleEvent | SALE_EVENT.NONE) === SALE_EVENT.NONE;
// }

// export function isLightningSale(saleEvent: number): boolean {
//   return (saleEvent & SALE_EVENT.LIGHTNING) === SALE_EVENT.LIGHTNING;
// }

// export function isSuggestSale(saleEvent: number): boolean {
//   return (saleEvent & SALE_EVENT.SUGGEST) === SALE_EVENT.SUGGEST;
// }

// export function isAllSale(saleEvent: number): boolean {
//   return (saleEvent & SALE_EVENT.ALL) === SALE_EVENT.ALL;
// }

export function saleEmoji(saleEvent: number) {
  return getSaleRecord(saleEvent).emoji;
}

export function saleEmojiWithText(saleEvent: number) {
  return getSaleRecord(saleEvent).emojiWithText;
}

export function saleText(saleEvent: number) {
  return getSaleRecord(saleEvent).text;
}

export function saleClassName(saleEvent: number) {
  return getSaleRecord(saleEvent).className;
}

export function saleRate(saleEvent: number) {
  return getSaleRecord(saleEvent).rate;
}
