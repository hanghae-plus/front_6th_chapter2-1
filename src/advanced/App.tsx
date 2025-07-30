import React, { useEffect } from 'react';

import getProducts from '@/advanced/api/getProducts';
import { CartList } from '@/advanced/components/cart';
import Header from '@/advanced/components/layout/Header';
import HelpOverlay from '@/advanced/components/layout/HelpOverlay';
import HelpToggle from '@/advanced/components/layout/HelpToggle';
import MainLayout from '@/advanced/components/layout/MainLayout';
import SectionLayout from '@/advanced/components/layout/SectionLayout';
import OrderSummary from '@/advanced/components/order/OrderSummary';
import ProductSelect from '@/advanced/components/product/ProductSelect';
import { useLayoutStore } from '@/advanced/store/useLayoutStore';
import { useProductStore } from '@/advanced/store/useProductStore';

function App() {
  const { showHelpOverlay } = useLayoutStore();
  const { setProducts } = useProductStore();

  useEffect(() => {
    getProducts().then(products => {
      setProducts(products);
    });
  }, []);

  return (
    <React.Fragment>
      <Header />

      <MainLayout>
        <SectionLayout>
          <ProductSelect />
          <CartList />
        </SectionLayout>
        <OrderSummary />
      </MainLayout>

      {showHelpOverlay && <HelpOverlay />}
      <HelpToggle />
    </React.Fragment>
  );
}

export default App;
