import { PRODUCT_IDS } from "./constants";

export const products = [
	{
		id: PRODUCT_IDS.KEYBOARD,
		name: "버그 없애는 키보드",
		val: 10000,
		originalVal: 10000,
		q: 50,
		onSale: false,
		suggestSale: false
	},
	{
		id: PRODUCT_IDS.MOUSE,
		name: "생산성 폭발 마우스",
		val: 20000,
		originalVal: 20000,
		q: 30,
		onSale: false,
		suggestSale: false
	},
	{
		id: PRODUCT_IDS.MONITOR_ARM,
		name: "거북목 탈출 모니터암",
		val: 30000,
		originalVal: 30000,
		q: 20,
		onSale: false,
		suggestSale: false
	},
	{
		id: PRODUCT_IDS.LAPTOP_POUCH,
		name: "에러 방지 노트북 파우치",
		val: 15000,
		originalVal: 15000,
		q: 0,
		onSale: false,
		suggestSale: false
	},
	{
		id: PRODUCT_IDS.SPEAKER,
		name: "코딩할 때 듣는 Lo-Fi 스피커",
		val: 25000,
		originalVal: 25000,
		q: 10,
		onSale: false,
		suggestSale: false
	}
];
