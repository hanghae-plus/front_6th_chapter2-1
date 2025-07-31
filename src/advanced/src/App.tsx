import { GlobalProvider } from './providers/GlobalProvider';
import Header from './layouts/Header';
import CartLayout from './layouts/CartLayout';
import ManualLayout from './layouts/ManualLayout';

function App() {
  return (
    <GlobalProvider>
      <Header />
      <CartLayout />
      <ManualLayout />
    </GlobalProvider>
  );
}

export default App;
