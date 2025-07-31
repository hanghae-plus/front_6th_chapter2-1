import { HEADER_ITEM_COUNT_ID, selectById } from '../utils/selector';

export function renderHeaderItemCount(count: number) {
  const headerItemCount = selectById(HEADER_ITEM_COUNT_ID);
  headerItemCount.textContent = `🛍️ ${count} items in cart`;
}
