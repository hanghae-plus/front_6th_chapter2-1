import { MainContent, useAppCalculations, useAppState } from "./features/app-state";
import { useProductSelection } from "./features/product-selection";
import { useSalesPromotions } from "./features/sales-promotions";
import { useShoppingCart } from "./features/shopping-cart";
import { HelpDrawer, HelpModalOpenButton, HelpPortalProvider } from "./features/user-guide";
import { Header } from "./shared/components";

export function App() {
	const {
		lastSelectedProductId,
		products,
		cartItems,
		setLastSelectedProductId,
		setProducts,
		setCartItems
	} = useAppState();

	const { selectedProductId, handleProductSelect, handleAddToCart } = useProductSelection({
		products,
		cartItems,
		onProductAdded: setLastSelectedProductId,
		onCartUpdate: setCartItems,
		onProductsUpdate: setProducts
	});

	useSalesPromotions({
		products,
		lastSelectedProductId,
		onProductsUpdate: setProducts
	});

	const { handleQuantityChange, handleRemoveItem } = useShoppingCart({
		cartItems,
		products,
		onCartUpdate: setCartItems,
		onProductsUpdate: setProducts
	});

	const calculations = useAppCalculations(cartItems, products);
	const { itemCount, stockMessage, totalStock } = calculations;

	return (
		<HelpPortalProvider>
			<Header itemCount={itemCount} />
			<MainContent
				products={products}
				cartItems={cartItems}
				selectedProductId={selectedProductId}
				stockMessage={stockMessage}
				totalStock={totalStock}
				calculations={calculations}
				onProductSelect={handleProductSelect}
				onAddToCart={handleAddToCart}
				onQuantityChange={handleQuantityChange}
				onRemove={handleRemoveItem}
			/>
			<HelpModalOpenButton />
			<HelpDrawer />
		</HelpPortalProvider>
	);
}
