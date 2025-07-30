import './index.css';

function App() {
  return (
    <div className="bg-gray-50 text-black antialiased overflow-hidden h-screen text-sm">
      <div
        id="app"
        className="max-w-screen-xl h-screen max-h-800 mx-auto p-8 flex flex-col"
      >
        <div className="mb-8">
          <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">
            🛒 Hanghae Online Store
          </h1>
          <div className="text-5xl tracking-tight leading-none">
            Shopping Cart
          </div>
          <p id="item-count" className="text-sm text-gray-500 font-normal mt-3">
            🛍️ 0 items in cart
          </p>
        </div>
        {/* 여기에 추가 컴포넌트들이 들어갈 예정 */}
      </div>
    </div>
  );
}

export default App;
