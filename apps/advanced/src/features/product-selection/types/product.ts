export type Product = {
	id: string;
	name: string;
	price: number;
	originalPrice: number;
	stock: number;
	onSale: boolean;
	suggestSale: boolean;
};

export type ProductSelectionProps = {
	products: Product[];
	selectedProductId: string;
	onProductSelect: (productId: string) => void;
	onAddToCart: () => void;
	stockMessage: string;
	totalStock: number;
};
