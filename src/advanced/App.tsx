import { useState, useCallback } from 'react';
import { MainLayout } from './components/MainLayout';
import { ShoppingPage } from './components/ShoppingPage';

function App() {
  const [cartCount, setCartCount] = useState(0);

  const handleCartCountChange = useCallback((count: number) => {
    setCartCount(count);
  }, []);

  return (
    <MainLayout cartCount={cartCount}>
      <ShoppingPage onCartCountChange={handleCartCountChange} />
    </MainLayout>
  );
}

export default App;