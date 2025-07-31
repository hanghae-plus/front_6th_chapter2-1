import { createCartAddButton } from '../components/cart/CartAddButton';
import { createCartDisplay } from '../components/cart/CartDisplay';
import { createUsageInfo } from '../components/guide/UsageInfo';
import { createHeader } from '../components/layout/Header';
import { createMainLayout } from '../components/layout/MainLayout';
import { createProductColumn } from '../components/layout/ProductColumn';
import { createSummaryColumn } from '../components/layout/SummaryColumn';
import { createProductSelector } from '../components/product/ProductSelector';
import { createStockInfo } from '../components/product/StockInfo';
import { getCartState } from '../state/appState';

export function useCreateAndMountApp() {
  // 핵심 컴포넌트 생성
  const coreComponents = {
    productSelector: createProductSelector(),
    cartAddButton: createCartAddButton(),
    stockInfo: createStockInfo(),
    cartDisplay: createCartDisplay(),
  };

  // 레이아웃 컴포넌트 생성
  const { productSelector, cartAddButton, stockInfo, cartDisplay } = coreComponents;

  const header = createHeader({ cartItemCount: getCartState().totalItemCount });
  const productColumn = createProductColumn({
    productSelector,
    cartAddButton,
    stockStatusElement: stockInfo,
    cartDisplay,
  });
  const summaryColumn = createSummaryColumn();
  const { usageToggle, usageOverlay } = createUsageInfo();
  const mainLayout = createMainLayout({ productColumn, summaryColumn });

  // DOM에 마운트
  const root = document.getElementById('app');
  if (root) {
    [header, mainLayout, usageToggle, usageOverlay].forEach((component) => {
      if (component) root.appendChild(component);
    });
  }

  return { ...coreComponents, header, mainLayout, usageToggle, usageOverlay };
}
