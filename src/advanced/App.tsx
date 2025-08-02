import { AppProvider } from "./context/AppContext";
import { CartPage } from "./pages/CartPage";

function App() {
  return (
    <AppProvider>
      <CartPage />
    </AppProvider>
  );
}

export default App;
