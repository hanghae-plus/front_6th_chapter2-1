import { useEffect } from "react";

import { TIMER_INTERVALS } from "../../../shared/constants";
import {
	applyLightningSale,
	createLightningSaleMessage,
	findLightningSaleCandidate
} from "../services";
import type { SalesPromotionConfig } from "../types";

/**
 * 번개세일 기능을 관리하는 훅
 * 일정 간격으로 랜덤한 상품에 번개세일을 적용합니다.
 */
export const useLightningSale = ({
	products,
	onProductsUpdate
}: Omit<SalesPromotionConfig, "lastSelectedProductId">) => {
	useEffect(() => {
		// 번개세일 시작 지연 시간 (0~10초 랜덤)
		const lightningDelay = Math.random() * TIMER_INTERVALS.LIGHTNING_DELAY_MAX;

		const lightningTimeout = setTimeout(() => {
			const lightningInterval = setInterval(() => {
				// 번개세일 대상 상품 찾기
				const candidate = findLightningSaleCandidate(products);

				if (candidate) {
					// 번개세일 적용
					const saleResult = applyLightningSale(candidate);

					// 상품 목록 업데이트
					onProductsUpdate((prev) =>
						prev.map((item) =>
							item.id === candidate.id
								? {
										...item,
										val: saleResult.salePrice,
										onSale: true
									}
								: item
						)
					);

					// 사용자에게 알림
					alert(createLightningSaleMessage(candidate.name));
				}
			}, TIMER_INTERVALS.LIGHTNING_SALE);

			// 컴포넌트 언마운트 시 interval 정리를 위해 반환
			return () => clearInterval(lightningInterval);
		}, lightningDelay);

		// 컴포넌트 언마운트 시 timeout 정리
		return () => clearTimeout(lightningTimeout);
	}, []); // products와 onProductsUpdate는 의존성에서 제외 (한 번만 설정)
};
