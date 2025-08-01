import Header from "./Header";
import ProductSelector from "./ProductSelector";
import CartList from "./CartList";
import OrderSummary from "./OrderSummary";
import Manual from "./Manual";

export default function Layout() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="bg-white border border-gray-200 p-8 flex flex-col h-[600px]">
            <div className="flex-shrink-0 mb-6">
              <ProductSelector />
            </div>
            <div className="flex-1 overflow-y-auto">
              <CartList />
            </div>
          </div>
          <div className="bg-black text-white p-8 flex flex-col">
            <OrderSummary />
          </div>
        </div>
        <Manual />
      </div>
    </div>
  );
}
