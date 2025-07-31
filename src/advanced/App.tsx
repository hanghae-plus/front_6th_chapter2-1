import ProductPicker from './components/cart/ProductPicker';
import ShoppingCart from './components/cart/ShoppingCart';
import GuideToggle from './components/guide/GuideToggle';
import Header from './components/layout/Header';
import Layout from './components/layout/Layout';
import OrderSummary from './components/order/OrderSummary';
import { useDiscountEvent } from './hooks/useDiscountEvent';

const App = () => {
  useDiscountEvent();
  return (
    <>
      <Header />
      <GuideToggle />
      <Layout>
        <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
          <ProductPicker />
          <ShoppingCart />
        </div>
        <OrderSummary />
      </Layout>
    </>
  );
};

export default App;
