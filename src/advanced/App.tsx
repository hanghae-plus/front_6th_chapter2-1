import ShoppingCart from './components/cart/ShoppingCart';
import GuideToggle from './components/guide/GuideToggle';
import Header from './components/layout/Header';
import Layout from './components/layout/Layout';
import OrderSummary from './components/order/OrderSummary';
import { CartProvider } from './hooks/CartContext';

const App = () => {
  return (
    <CartProvider>
      <Header />
      <GuideToggle />
      <Layout>
        <ShoppingCart />
        <OrderSummary />
      </Layout>
    </CartProvider>
  );
};

export default App;
