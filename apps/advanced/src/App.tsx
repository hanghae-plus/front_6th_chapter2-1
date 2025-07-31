import { useState, useEffect, useMemo } from "react";

const PRODUCT_ONE = 'p1';
const p2 = 'p2';
const product_3 = 'p3';
const p4 = "p4";
const PRODUCT_5 = `p5`;

interface Product {
	id: string;
	name: string;
	val: number;
	originalVal: number;
	q: number;
	onSale: boolean;
	suggestSale: boolean;
}

interface CartItem {
	id: string;
	name: string;
	val: number;
	originalVal: number;
	q: number;
	onSale: boolean;
	suggestSale: boolean;
	quantity: number;
}


export default function App() {
	const [lastSel, setLastSel] = useState<string | null>(null)

	const [prodList, setProdList] = useState<Product[]>([
		{id: PRODUCT_ONE, name: '버그 없애는 키보드', val: 10000, originalVal: 10000, q: 50, onSale: false, suggestSale: false},
		{id: p2, name: '생산성 폭발 마우스', val: 20000, originalVal: 20000, q: 30, onSale: false, suggestSale: false},
		{id: product_3, name: "거북목 탈출 모니터암", val: 30000, originalVal: 30000, q: 20, onSale: false, suggestSale: false},
		{id: p4, name: "에러 방지 노트북 파우치", val: 15000, originalVal: 15000, q: 0, onSale: false, suggestSale: false},
		{
			id: PRODUCT_5,
			name: `코딩할 때 듣는 Lo-Fi 스피커`,
			val: 25000,
			originalVal: 25000,
			q: 10,
			onSale: false,
			suggestSale: false
		}
	])

	const [cartItems, setCartItems] = useState<CartItem[]>([])
	const [selectedItem, setSelectedItem] = useState<string>('')
	const [showManual, setShowManual] = useState<boolean>(false)

	useEffect(() => {
		const lightningDelay = Math.random() * 10000;
		setTimeout(() => {
			setInterval(function () {
				const luckyIdx = Math.floor(Math.random() * prodList.length);
				const luckyItem = prodList[luckyIdx];
				if (luckyItem.q > 0 && !luckyItem.onSale) {
					setProdList(prev => prev.map(item => 
						item.id === luckyItem.id 
							? {...item, val: Math.round(item.originalVal * 80 / 100), onSale: true}
							: item
					))
					alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
				}
			}, 30000);
		}, lightningDelay);

		setTimeout(function () {
			setInterval(function () {
				if (cartItems.length === 0) {
				}
				if (lastSel) {
					let suggest = null;

					for (let k = 0; k < prodList.length; k++) {
						if (prodList[k].id !== lastSel) {
							if (prodList[k].q > 0) {
								if (!prodList[k].suggestSale) {
									suggest = prodList[k];
									break;
								}
							}
						}
					}
					if (suggest) {
						alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
						setProdList(prev => prev.map(item => 
							item.id === suggest.id 
								? {...item, val: Math.round(item.val * (100 - 5) / 100), suggestSale: true}
								: item
						))
					}
				}
			}, 60000);
		}, Math.random() * 20000);
	}, [])  // Empty dependency array is correct for one-time setup

	const handleAddToCart = () => {
		const selItem = selectedItem

		let hasItem = false;
		for (let idx = 0; idx < prodList.length; idx++) {
			if (prodList[idx].id === selItem) {
				hasItem = true;
				break;
			}
		}
		if (!selItem || !hasItem) {
			return;
		}
		let itemToAdd = null;
		for (let j = 0; j < prodList.length; j++) {
			if (prodList[j].id === selItem) {
				itemToAdd = prodList[j];
				break;
			}
		}
		if (itemToAdd && itemToAdd.q > 0) {
			const existingItem = cartItems.find(item => item.id === itemToAdd.id)
			if (existingItem) {
				const newQty = existingItem.quantity + 1
				if (newQty <= itemToAdd.q + existingItem.quantity) {
					setCartItems(prev => prev.map(item => 
						item.id === itemToAdd.id 
							? {...item, quantity: newQty}
							: item
					))
					setProdList(prev => prev.map(item => 
						item.id === itemToAdd.id 
							? {...item, q: item.q - 1}
							: item
					))
				} else {
					alert('재고가 부족합니다.');
				}
			} else {
				setCartItems(prev => [...prev, {...itemToAdd, quantity: 1}])
				setProdList(prev => prev.map(item => 
					item.id === itemToAdd.id 
						? {...item, q: item.q - 1}
						: item
				))
			}
			setLastSel(selItem);
		}
	}

	const handleQuantityChange = (productId: string, change: number) => {
		const cartItem = cartItems.find(item => item.id === productId)
		const prod = prodList.find(item => item.id === productId)
		
		if (cartItem) {
			const currentQty = cartItem.quantity;
			const newQty = currentQty + change;
			if (prod && newQty > 0 && newQty <= prod.q + currentQty) {
				setCartItems(prev => prev.map(item => 
					item.id === productId 
						? {...item, quantity: newQty}
						: item
				))
				setProdList(prev => prev.map(item => 
					item.id === productId 
						? {...item, q: item.q - change}
						: item
				))
			} else if (prod && newQty <= 0) {
				setProdList(prev => prev.map(item => 
					item.id === productId 
						? {...item, q: item.q + currentQty}
						: item
				))
				setCartItems(prev => prev.filter(item => item.id !== productId))
			} else {
				alert('재고가 부족합니다.');
			}
		}
	}

	const handleRemoveItem = (productId: string) => {
		const cartItem = cartItems.find(item => item.id === productId)
		if (cartItem) {
			setProdList(prev => prev.map(item => 
				item.id === productId 
					? {...item, q: item.q + cartItem.quantity}
					: item
			))
			setCartItems(prev => prev.filter(item => item.id !== productId))
		}
	}

	// 계산 로직들을 useMemo로 최적화
	const calculations = useMemo(() => {
		let totalAmt = 0;
		let itemCnt = 0;
		let subTot = 0;
		const itemDiscounts: {name: string; discount: number}[] = [];

		for (let i = 0; i < cartItems.length; i++) {
			const cartItem = cartItems[i];
			const curItem = prodList.find(p => p.id === cartItem.id);
			if (!curItem) continue;
			const q = cartItem.quantity;
			const itemTot = curItem.val * q;
			let disc = 0;
			itemCnt += q;
			subTot += itemTot;
			
			if (q >= 10) {
				if (curItem.id === PRODUCT_ONE) {
					disc = 10 / 100;
				} else {
					if (curItem.id === p2) {
						disc = 15 / 100;
					} else {
						if (curItem.id === product_3) {
							disc = 20 / 100;
						} else {
							if (curItem.id === p4) {
								disc = 5 / 100;
							} else {
								if (curItem.id === PRODUCT_5) {
									disc = 25 / 100;
								}
							}
						}
					}
				}
				if (disc > 0) {
					itemDiscounts.push({name: curItem.name, discount: disc * 100});
				}
			}
			totalAmt += itemTot * (1 - disc);
		}

		let discRate = 0;
		const originalTotal = subTot;
		if (itemCnt >= 30) {
			totalAmt = subTot * 75 / 100;
			discRate = 25 / 100;
		} else {
			discRate = (subTot - totalAmt) / subTot;
		}

		const today = new Date();
		const isTuesday = today.getDay() === 2;
		if (isTuesday) {
			if (totalAmt > 0) {
				totalAmt = totalAmt * 90 / 100;
				discRate = 1 - (totalAmt / originalTotal);
			}
		}

		// 포인트 계산
		const basePoints = Math.floor(totalAmt / 1000)
		let finalPoints = 0;
		const pointsDetail = [];

		if (basePoints > 0) {
			finalPoints = basePoints;
			pointsDetail.push('기본: ' + basePoints + 'p');
		}
		if (new Date().getDay() === 2) {
			if (basePoints > 0) {
				finalPoints = basePoints * 2;
				pointsDetail.push('화요일 2배');
			}
		}
		const hasKeyboard = cartItems.some(item => item.id === PRODUCT_ONE);
		const hasMouse = cartItems.some(item => item.id === p2);
		const hasMonitorArm = cartItems.some(item => item.id === product_3);

		if (hasKeyboard && hasMouse) {
			finalPoints = finalPoints + 50;
			pointsDetail.push('키보드+마우스 세트 +50p');
		}
		if (hasKeyboard && hasMouse && hasMonitorArm) {
			finalPoints = finalPoints + 100;
			pointsDetail.push('풀세트 구매 +100p');
		}

		if (itemCnt >= 30) {
			finalPoints = finalPoints + 100;
			pointsDetail.push('대량구매(30개+) +100p');
		} else {
			if (itemCnt >= 20) {
				finalPoints = finalPoints + 50;
				pointsDetail.push('대량구매(20개+) +50p');
			} else {
				if (itemCnt >= 10) {
					finalPoints = finalPoints + 20;
					pointsDetail.push('대량구매(10개+) +20p');
				}
			}
		}
		const bonusPts = finalPoints;

		// 재고 메시지
		let stockMsg = '';
		for (let stockIdx = 0; stockIdx < prodList.length; stockIdx++) {
			const item = prodList[stockIdx];
			if (item.q < 5) {
				if (item.q > 0) {
					stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
				} else {
					stockMsg = stockMsg + item.name + ': 품절\n';
				}
			}
		}

		const totalStock = prodList.reduce((sum, item) => sum + item.q, 0);

		return {
			totalAmt,
			itemCnt,
			subTot,
			itemDiscounts,
			discRate,
			originalTotal,
			isTuesday,
			bonusPts,
			pointsDetail,
			stockMsg,
			totalStock
		};
	}, [cartItems, prodList]);

	const { totalAmt, itemCnt, subTot, itemDiscounts, discRate, originalTotal, isTuesday, bonusPts, pointsDetail, stockMsg, totalStock } = calculations;

	return (
		<>
			<div className="mb-8">
				<h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
				<div className="text-5xl tracking-tight leading-none">Shopping Cart</div>
				<p id="item-count" className="text-sm text-gray-500 font-normal mt-3">🛍️ {itemCnt} items in cart</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
				<div className="bg-white border border-gray-200 p-8 overflow-y-auto">
					<div className="mb-6 pb-6 border-b border-gray-200">
						<select 
							id="product-select"
							className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
							style={{borderColor: totalStock < 50 ? 'orange' : ''}}
							value={selectedItem}
							onChange={(e) => setSelectedItem(e.target.value)}
						>
							<option value="">상품을 선택하세요</option>
							{prodList.map(item => {
								var discountText = '';
								if (item.onSale) discountText += ' ⚡SALE';
								if (item.suggestSale) discountText += ' 💝추천';
								
								if (item.q === 0) {
									return (
										<option 
											key={item.id} 
											value={item.id} 
											disabled 
											className="text-gray-400"
										>
											{item.name} - {item.val}원 (품절){discountText}
										</option>
									)
								} else {
									let optionText = '';
									let optionClass = '';
									if (item.onSale && item.suggestSale) {
										optionText = `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`;
										optionClass = 'text-purple-600 font-bold';
									} else if (item.onSale) {
										optionText = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`;
										optionClass = 'text-red-500 font-bold';
									} else if (item.suggestSale) {
										optionText = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`;
										optionClass = 'text-blue-500 font-bold';
									} else {
										optionText = `${item.name} - ${item.val}원${discountText}`;
									}
									return (
										<option 
											key={item.id} 
											value={item.id} 
											className={optionClass}
										>
											{optionText}
										</option>
									)
								}
							})}
						</select>
						<button 
							id="add-to-cart"
							className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
							onClick={handleAddToCart}
						>
							Add to Cart
						</button>
						<div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
							{stockMsg}
						</div>
					</div>

					<div id="cart-items">
						{cartItems.map(cartItem => {
							const product = prodList.find(p => p.id === cartItem.id);
							if (!product) return null;
							return (
								<div id={cartItem.id} key={cartItem.id} className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
									<div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
										<div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
									</div>
									<div>
										<h3 className="text-base font-normal mb-1 tracking-tight">
											{product.onSale && product.suggestSale ? '⚡💝' : product.onSale ? '⚡' : product.suggestSale ? '💝' : ''}{product.name}
										</h3>
										<p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
										<p className="text-xs text-black mb-3">
											{product.onSale || product.suggestSale ? (
												<>
													<span className="line-through text-gray-400">₩{product.originalVal.toLocaleString()}</span>{' '}
													<span className={product.onSale && product.suggestSale ? 'text-purple-600' : product.onSale ? 'text-red-500' : 'text-blue-500'}>
														₩{product.val.toLocaleString()}
													</span>
												</>
											) : (
												`₩${product.val.toLocaleString()}`
											)}
										</p>
										<div className="flex items-center gap-4">
											<button 
												className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
												data-change="-1"
												onClick={() => handleQuantityChange(cartItem.id, -1)}
											>
												−
											</button>
											<span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
												{cartItem.quantity}
											</span>
											<button 
												className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
												data-change="1"
												onClick={() => handleQuantityChange(cartItem.id, 1)}
											>
												+
											</button>
										</div>
									</div>
									<div className="text-right">
										<div className="text-lg mb-2 tracking-tight tabular-nums" style={{fontWeight: cartItem.quantity >= 10 ? 'bold' : 'normal'}}>
											{product.onSale || product.suggestSale ? (
												<>
													<span className="line-through text-gray-400">₩{product.originalVal.toLocaleString()}</span>{' '}
													<span className={product.onSale && product.suggestSale ? 'text-purple-600' : product.onSale ? 'text-red-500' : 'text-blue-500'}>
														₩{product.val.toLocaleString()}
													</span>
												</>
											) : (
												`₩${product.val.toLocaleString()}`
											)}
										</div>
										<button 
											className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
											onClick={() => handleRemoveItem(cartItem.id)}
										>
											Remove
										</button>
									</div>
								</div>
							)
						})}
					</div>
				</div>

				<div className="bg-black text-white p-8 flex flex-col">
					<h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
					<div className="flex-1 flex flex-col">
						<div className="space-y-3">
							{cartItems.map(cartItem => {
								const product = prodList.find(p => p.id === cartItem.id);
								if (!product) return null;
								const itemTotal = product.val * cartItem.quantity;
								return (
									<div key={cartItem.id} className="flex justify-between text-xs tracking-wide text-gray-400">
										<span>{product.name} x {cartItem.quantity}</span>
										<span>₩{itemTotal.toLocaleString()}</span>
									</div>
								)
							})}
							
							{subTot > 0 && (
								<>
									<div className="border-t border-white/10 my-3"></div>
									<div className="flex justify-between text-sm tracking-wide">
										<span>Subtotal</span>
										<span>₩{subTot.toLocaleString()}</span>
									</div>
									
									{itemCnt >= 30 && (
										<div className="flex justify-between text-sm tracking-wide text-green-400">
											<span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
											<span className="text-xs">-25%</span>
										</div>
									)}
									
									{itemCnt < 30 && itemDiscounts.map(item => (
										<div key={item.name} className="flex justify-between text-sm tracking-wide text-green-400">
											<span className="text-xs">{item.name} (10개↑)</span>
											<span className="text-xs">-{item.discount}%</span>
										</div>
									))}
									
									{isTuesday && totalAmt > 0 && (
										<div className="flex justify-between text-sm tracking-wide text-purple-400">
											<span className="text-xs">🌟 화요일 추가 할인</span>
											<span className="text-xs">-10%</span>
										</div>
									)}
									
									<div className="flex justify-between text-sm tracking-wide text-gray-400">
										<span>Shipping</span>
										<span>Free</span>
									</div>
								</>
							)}
						</div>
						<div className="mt-auto">
							{/* Always present discount info element for tests */}
							<span id="discount-info" style={{ display: 'none' }}>{(discRate * 100).toFixed(1)}%</span>
							{discRate > 0 && totalAmt > 0 && (
								<div className="mb-4">
									<div className="bg-green-500/20 rounded-lg p-3">
										<div className="flex justify-between items-center mb-1">
											<span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
											<span className="text-sm font-medium text-green-400">{(discRate * 100).toFixed(1)}%</span>
										</div>
										<div className="text-2xs text-gray-300">₩{Math.round(originalTotal - totalAmt).toLocaleString()} 할인되었습니다</div>
									</div>
								</div>
							)}
							<div className="pt-5 border-t border-white/10">
								<div className="flex justify-between items-baseline">
									<span className="text-sm uppercase tracking-wider">Total</span>
									<div id="cart-total" className="text-2xl tracking-tight">₩{Math.round(totalAmt).toLocaleString()}</div>
								</div>
								{bonusPts > 0 ? (
									<div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
										<div>적립 포인트: <span className="font-bold">{bonusPts}p</span></div>
										<div className="text-2xs opacity-70 mt-1">{pointsDetail.join(', ')}</div>
									</div>
								) : (
									<div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
								)}
							</div>
							{isTuesday && totalAmt > 0 && (
								<div className="mt-4 p-3 bg-white/10 rounded-lg">
									<div className="flex items-center gap-2">
										<span className="text-2xs">🎉</span>
										<span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
									</div>
								</div>
							)}
						</div>
					</div>
					<button className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
						Proceed to Checkout
					</button>
					<p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
						Free shipping on all orders.<br />
						<span>Earn loyalty points with purchase.</span>
					</p>
				</div>
			</div>

			<button 
				className="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"
				onClick={() => setShowManual(!showManual)}
			>
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
			</button>

			{showManual && (
				<div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={() => setShowManual(false)}>
					<div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform transition-transform duration-300 ${showManual ? 'translate-x-0' : 'translate-x-full'}`}>
						<button 
							className="absolute top-4 right-4 text-gray-500 hover:text-black" 
							onClick={() => setShowManual(false)}
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
						<h2 className="text-xl font-bold mb-4">📖 이용 안내</h2>
						
						<div className="mb-6">
							<h3 className="text-base font-bold mb-3">💰 할인 정책</h3>
							<div className="space-y-3">
								<div className="bg-gray-100 rounded-lg p-3">
									<p className="font-semibold text-sm mb-1">개별 상품</p>
									<p className="text-gray-700 text-xs pl-2">
										• 키보드 10개↑: 10%<br />
										• 마우스 10개↑: 15%<br />
										• 모니터암 10개↑: 20%<br />
										• 스피커 10개↑: 25%
									</p>
								</div>
								
								<div className="bg-gray-100 rounded-lg p-3">
									<p className="font-semibold text-sm mb-1">전체 수량</p>
									<p className="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
								</div>
								
								<div className="bg-gray-100 rounded-lg p-3">
									<p className="font-semibold text-sm mb-1">특별 할인</p>
									<p className="text-gray-700 text-xs pl-2">
										• 화요일: +10%<br />
										• ⚡번개세일: 20%<br />
										• 💝추천할인: 5%
									</p>
								</div>
							</div>
						</div>
						
						<div className="mb-6">
							<h3 className="text-base font-bold mb-3">🎁 포인트 적립</h3>
							<div className="space-y-3">
								<div className="bg-gray-100 rounded-lg p-3">
									<p className="font-semibold text-sm mb-1">기본</p>
									<p className="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
								</div>
								
								<div className="bg-gray-100 rounded-lg p-3">
									<p className="font-semibold text-sm mb-1">추가</p>
									<p className="text-gray-700 text-xs pl-2">
										• 화요일: 2배<br />
										• 키보드+마우스: +50p<br />
										• 풀세트: +100p<br />
										• 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
									</p>
								</div>
							</div>
						</div>
						
						<div className="border-t border-gray-200 pt-4 mt-4">
							<p className="text-xs font-bold mb-1">💡 TIP</p>
							<p className="text-2xs text-gray-600 leading-relaxed">
								• 화요일 대량구매 = MAX 혜택<br />
								• ⚡+💝 중복 가능<br />
								• 상품4 = 품절
							</p>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
