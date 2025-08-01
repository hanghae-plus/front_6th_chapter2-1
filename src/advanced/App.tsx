import React from 'react';
import {
  Header,
  MainGrid,
  LeftColumn,
  HelpToggleButton,
} from './shared/components';
import {
  ProductPanel,
  ProductSelect,
  AddToCartButton,
  StockInfo,
} from './features/product/components';
import { CartContainer, OrderSummary } from './features/cart/components';
import { useShoppingCart } from './shared/hooks/useShoppingCart';

function App() {
  const { state, actions, getProductById } = useShoppingCart();

  return (
    <div className="flex flex-col h-full">
      <Header itemCount={state.itemCount} />

      <MainGrid>
        <LeftColumn>
          <ProductPanel>
            <ProductSelect
              products={state.products}
              selectedProductId={state.selectedProductId}
              onProductChange={actions.selectProduct}
            />
            <AddToCartButton
              disabled={!state.selectedProductId}
              onClick={() => actions.addToCart(state.selectedProductId)}
            />
            <StockInfo products={state.products} />
          </ProductPanel>

          <CartContainer
            cartItems={state.cartItems}
            getProductById={getProductById}
            onUpdateQuantity={actions.updateQuantity}
            onRemoveItem={actions.removeFromCart}
          />
        </LeftColumn>

        <OrderSummary
          totalAmount={state.totalAmount}
          subtotal={state.subtotal}
          bonusPoints={state.bonusPoints}
          pointsDetails={state.pointsDetails || []}
          discountInfo={state.discountInfo}
          isTuesdaySpecial={state.isTuesdaySpecial}
          cartItems={state.cartItems}
          totalQuantity={state.itemCount}
          getProductById={getProductById}
        />
      </MainGrid>

      <HelpToggleButton />
    </div>
  );
}

export default App;
