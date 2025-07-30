import { createStore } from ".";

export const productIds = {
  p1: "p1",
  p2: "p2",
  p3: "p3",
  p4: "p4",
  p5: "p5",
};

const products = [
  {
    id: productIds.p1,
    name: "버그 없애는 키보드",
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: productIds.p2,
    name: "생산성 폭발 마우스",
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: productIds.p3,
    name: "거북목 탈출 모니터암",
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: productIds.p4,
    name: "에러 방지 노트북 파우치",
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: productIds.p5,
    name: "코딩할 때 듣는 Lo-Fi 스피커",
    val: 25000,
    originalVal: 25000,
    q: 10,
    onSale: false,
    suggestSale: false,
  },
];

// TODO: 여기도 아래 주석 풀고 스토어방식으로 해야하는데, 지금당장은 여길 수정중이 아니니 잠시 보류!
export const productState = {
  products,
  productIds,
};

const productActions = {
  getProduct: (state, productId) => {
    return state.products.find((product) => product.id === productId);
  },
  getAllProducts: (state) => {
    return state.products;
  },
  getProductIds: (state) => {
    return state.productIds;
  },
  updateStock: (state, productId, newQuantity) => {
    return {
      state: {
        ...state,
        products: state.products.map((product) =>
          product.id === productId ? { ...product, q: newQuantity } : product
        ),
      },
    };
  },
};

const productStore = createStore(productState, productActions);

export default productStore;
