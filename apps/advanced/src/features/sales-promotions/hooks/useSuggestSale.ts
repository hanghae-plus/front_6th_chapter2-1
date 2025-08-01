import { useEffect } from "react";

import { TIMER_INTERVALS } from "../../../shared/constants";
import { applySuggestSale, createSuggestSaleMessage, findSuggestSaleCandidate } from "../services";
import type { SalesPromotionConfig } from "../types";

/**
 * 추천세일 기능을 관리하는 훅
 * 마지막 선택 상품을 기반으로 다른 상품에 추천세일을 적용합니다.
 */
export const useSuggestSale = ({
	products,
	lastSelectedProductId,
	onProductsUpdate
}: SalesPromotionConfig) => {
	useEffect(() => {
		// 추천세일 시작 지연 시간 (0~20초 랜덤)
		const suggestDelay = Math.random() * TIMER_INTERVALS.SUGGEST_DELAY_MAX;

		const suggestTimeout = setTimeout(() => {
			const suggestInterval = setInterval(() => {
				// 장바구니가 비어있으면 추천하지 않음 (기존 로직 유지)
				// if (cartItems.length === 0) return; // 이 부분은 App.tsx에서 처리

				if (lastSelectedProductId) {
					// 추천세일 대상 상품 찾기
					const candidate = findSuggestSaleCandidate(products, lastSelectedProductId);

					if (candidate) {
						// 추천세일 적용
						const saleResult = applySuggestSale(candidate);

						// 상품 목록 업데이트
						onProductsUpdate((prev) =>
							prev.map((item) =>
								item.id === candidate.id
									? {
											...item,
											val: saleResult.salePrice,
											suggestSale: true
										}
									: item
							)
						);

						// 사용자에게 알림
						alert(createSuggestSaleMessage(candidate.name));
					}
				}
			}, TIMER_INTERVALS.SUGGEST_SALE);

			// 컴포넌트 언마운트 시 interval 정리를 위해 반환
			return () => clearInterval(suggestInterval);
		}, suggestDelay);

		// 컴포넌트 언마운트 시 timeout 정리
		return () => clearTimeout(suggestTimeout);
	}, []); // 의존성 배열을 비워두어 한 번만 설정 (기존 로직과 동일)
};
