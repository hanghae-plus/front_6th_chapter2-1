import { GlobalProvider } from './providers/GlobalProvider';
import Header from './layouts/Header';
import CartLayout from './layouts/CartLayout';
import ManualButton from './components/Button/ManualButton';

function App() {
  return (
    <GlobalProvider>
      <Header />
      <CartLayout />
      <ManualButton />
    </GlobalProvider>
  );
}

export default App;
