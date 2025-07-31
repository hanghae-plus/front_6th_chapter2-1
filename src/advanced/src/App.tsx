import Header from './layouts/Header';
import ManualLayout from './layouts/ManualLayout';
import CartLayout from './layouts/CartLayout';
import { useSaleAlert } from './services/useSaleAlert';

function App() {
  useSaleAlert();

  return (
    <>
      <Header />
      <ManualLayout />
      <CartLayout />
    </>
  );
}

export default App;
