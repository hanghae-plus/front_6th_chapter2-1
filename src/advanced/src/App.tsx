import './index.css';
import Header from './components/Header';
import MainLayout from './components/MainLayout';
import CartDisplay from './components/CartDisplay';
import OrderSummary from './components/OrderSummary';

function App() {
  return (
    <div className="bg-gray-50 text-black overflow-hidden text-sm max-w-screen-xl h-screen max-h-800 mx-auto p-8 flex flex-col">
      <Header count={0} />
      <MainLayout left={<CartDisplay />} right={<OrderSummary />} />
    </div>
  );
}

export default App;
