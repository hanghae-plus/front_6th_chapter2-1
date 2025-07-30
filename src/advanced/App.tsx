import React, { useEffect } from 'react';

import getProducts from '@/advanced/api/getProducts';
import { CartList } from '@/advanced/components/cart';
import {
  Header,
  HelpOverlay,
  HelpToggle,
  MainLayout,
  SectionLayout,
} from '@/advanced/components/layout';
import { OrderSummary } from '@/advanced/components/order';
import { ProductSelect } from '@/advanced/components/product';
import { useLayoutStore, useProductStore } from '@/advanced/store';

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
