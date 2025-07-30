import React, { ReactElement } from 'react';

import CartItems from '@/advanced/components/cart/CartItems';
import Header from '@/advanced/components/layout/Header';
import HelpOverlay from '@/advanced/components/layout/HelpOverlay';
import HelpToggle from '@/advanced/components/layout/HelpToggle';
import MainLayout from '@/advanced/components/layout/MainLayout';
import SectionLayout from '@/advanced/components/layout/SectionLayout';
import OrderSummary from '@/advanced/components/order/OrderSummary';
import ProductSelect from '@/advanced/components/product/ProductSelect';
import { useLayoutStore } from '@/advanced/store/useLayoutStore';

function App(): ReactElement {
  const { showHelpOverlay } = useLayoutStore();

  return (
    <React.Fragment>
      <Header />

      <MainLayout>
        <SectionLayout>
          <ProductSelect />
          <CartItems />
        </SectionLayout>
        <OrderSummary />
      </MainLayout>

      {showHelpOverlay && <HelpOverlay />}
      <HelpToggle />
    </React.Fragment>
  );
}

export default App;
