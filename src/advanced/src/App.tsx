import { useState, useEffect } from 'react';
import './index.css';
import Header from './components/Header';
import MainLayout from './components/MainLayout';
import CartDisplay from './components/CartDisplay';
import OrderSummary from './components/OrderSummary';
import InfoButton from './components/ManualButton';
import ManualModal from './components/ManualModal';
import { CartProvider } from './contexts/cart/CartProvider';
import { startLightningSale, startSuggestSale } from './services/saleService';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    startLightningSale();
    startSuggestSale();
  }, []);

  return (
    <CartProvider>
      <div className="bg-gray-50 text-black overflow-hidden text-sm max-w-screen-xl h-screen max-h-800 mx-auto p-8 flex flex-col">
        <Header count={0} />
        <MainLayout left={<CartDisplay />} right={<OrderSummary />} />
        <InfoButton onClick={handleOpenModal} />
        <ManualModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </CartProvider>
  );
}

export default App;
