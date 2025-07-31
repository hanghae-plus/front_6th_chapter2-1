import Header from "./Header";
import ProductSelector from "./ProductSelector";
import CartList from "./CartList";
import OrderSummary from "./OrderSummary";
import Manual from "./Manual";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
          <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
            <ProductSelector />
            <CartList />
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
