import { CartDisplay } from './components/cart/CartDisplay';
import { ProductSelector } from './components/product/ProductSelector';
import { AppProvider } from './context/AppContext';

export const App = () => {
  return (
    <AppProvider>
      <div className='app min-h-screen bg-gray-50'>
        <header className='bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'>
          <div className='container mx-auto px-6 py-8'>
            <h1 className='text-4xl font-bold mb-2'>🛒 쇼핑몰 애플리케이션</h1>
          </div>
        </header>

        <main className='min-h-screen bg-gray-50'>
          <div className='container mx-auto px-6 py-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <section className='bg-white rounded-lg shadow-md p-6'>
                <ProductSelector />
              </section>

              <section className='bg-white rounded-lg shadow-md p-6'>
                <CartDisplay />
              </section>
            </div>
          </div>
        </main>

        <footer className='bg-gray-800 text-white py-8'>
          <div className='container mx-auto px-6 text-center'>
            <p className='text-gray-300 mb-2'>
              © 2024 쇼핑몰 애플리케이션 - React + TypeScript
            </p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
};

export default App;
