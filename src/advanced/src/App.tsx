import { useState } from 'react';
import './index.css';
import Header from './components/Header';
import MainLayout from './components/MainLayout';
import CartDisplay from './components/CartDisplay';
import OrderSummary from './components/OrderSummary';
import InfoButton from './components/ManualButton';
import ManualModal from './components/ManualModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="bg-gray-50 text-black overflow-hidden text-sm max-w-screen-xl h-screen max-h-800 mx-auto p-8 flex flex-col">
      <Header count={0} />
      <MainLayout left={<CartDisplay />} right={<OrderSummary />} />
      <InfoButton onClick={handleOpenModal} />
      <ManualModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
