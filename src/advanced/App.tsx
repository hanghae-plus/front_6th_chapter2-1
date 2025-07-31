import React, { useEffect, useState } from 'react';

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
import useTimer from '@/advanced/hooks/useTimer';
import { useLayoutStore, useProductStore } from '@/advanced/store';

function App() {
  const { showHelpOverlay } = useLayoutStore();
  const { setProducts, products } = useProductStore();
  const { startAll, stopAll } = useTimer();

  const [isProductsLoaded, setIsProductsLoaded] = useState(false);

  useEffect(() => {
    getProducts().then(products => {
      setProducts(products);
      setIsProductsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isProductsLoaded && products.length > 0) {
      startAll();
    }

    return () => stopAll();
  }, [isProductsLoaded, products.length]);

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
