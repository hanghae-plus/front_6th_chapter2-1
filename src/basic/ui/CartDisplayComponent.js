export function CartDisplay({ DOM_IDS, onCartAction }) {
  const cartDisp = document.createElement("div");
  cartDisp.id = DOM_IDS.CART_ITEMS;

  if (onCartAction) {
    cartDisp.addEventListener("click", onCartAction);
  }

  return cartDisp;
}

export function CartItem({ product }) {
  const newItem = document.createElement("div");
  newItem.id = product.id;
  newItem.className =
    "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";

  const priceDisplay = getPriceDisplay(product);
  const nameDisplay = getNameDisplay(product);

  newItem.innerHTML = `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${nameDisplay}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceDisplay}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
    </div>
  `;

  return newItem;
}

export function updateCartItemPrices({ cartDisplay, products }) {
  const cartItems = cartDisplay.children;

  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;

    for (let productIdx = 0; productIdx < products.length; productIdx++) {
      if (products[productIdx].id === itemId) {
        product = products[productIdx];
        break;
      }
    }

    if (product) {
      const priceDiv = cartItems[i].querySelector(".text-lg");
      const nameDiv = cartItems[i].querySelector("h3");
      const smallPriceDiv = cartItems[i].querySelector("p.text-xs.text-black");

      const priceDisplay = getPriceDisplay(product);
      const nameDisplay = getNameDisplay(product);

      priceDiv.innerHTML = priceDisplay;
      nameDiv.textContent = nameDisplay;
      smallPriceDiv.innerHTML = priceDisplay;
    }
  }
}

function getPriceDisplay(product) {
  if (product.isOnLightningSale && product.isSuggestedSale) {
    return `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-purple-600">₩${product.price.toLocaleString()}</span>`;
  } else if (product.isOnLightningSale) {
    return `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-red-500">₩${product.price.toLocaleString()}</span>`;
  } else if (product.isSuggestedSale) {
    return `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-blue-500">₩${product.price.toLocaleString()}</span>`;
  } else {
    return `₩${product.price.toLocaleString()}`;
  }
}

function getNameDisplay(product) {
  let prefix = "";
  if (product.isOnLightningSale && product.isSuggestedSale) {
    prefix = "⚡💝";
  } else if (product.isOnLightningSale) {
    prefix = "⚡";
  } else if (product.isSuggestedSale) {
    prefix = "💝";
  }
  return prefix + product.name;
}
