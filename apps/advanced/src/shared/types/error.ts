export type AppError = {
	type: 'VALIDATION_ERROR' | 'STOCK_ERROR' | 'PRODUCT_ERROR' | 'CART_ERROR';
	message: string;
	productId?: string;
};

export type ErrorHandler = (error: AppError) => void;