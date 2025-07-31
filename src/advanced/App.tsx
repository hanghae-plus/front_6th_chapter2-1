import { CartContainer } from './components/cart-section/CartContainer';
import { Header } from './components/header/Header';
import { Manual } from './components/manual/Manual';
import { OrderSummary } from './components/order-summary/OrderSummary';
import { useCartDispatch } from './contexts/CartContext';
import { useSaleTimers } from './hooks/useSaleTimers';

function App() {
  const dispatch = useCartDispatch();

  useSaleTimers(dispatch!);

  return (
    <>
      <Header />
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden'>
        <CartContainer />
        <OrderSummary />
      </div>
      <Manual />
    </>
  );
}

export default App;
