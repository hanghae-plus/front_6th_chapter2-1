import Header from "./Header";
import ProductSelector from "./ProductSelector";
import { CartDisplay } from "./CartDisplay";
import { OrderSummary } from "./OrderSummary";
import { Manual } from "./Manual";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
          <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
            <ProductSelector />
            <CartDisplay />
          </div>

          <OrderSummary />
        </div>

        <Manual />
      </div>
    </div>
  );
};
