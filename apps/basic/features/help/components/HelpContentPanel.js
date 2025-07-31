import { CloseIcon } from "../../../shared/components";

export function HelpContentPanel() {
	return /* HTML */ `
		<div
			class="fixed right-0 top-0 z-50 h-full w-80 translate-x-full transform overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300"
			id="help-content-panel"
		>
			<button
				class="absolute right-4 top-4 text-gray-500 hover:text-black"
				onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')"
			>
				${CloseIcon()}
			</button>
			<h2 class="mb-4 text-xl font-bold">📖 이용 안내</h2>
			<div class="mb-6">
				<h3 class="mb-3 text-base font-bold">💰 할인 정책</h3>
				<div class="space-y-3">
					<div class="rounded-lg bg-gray-100 p-3">
						<p class="mb-1 text-sm font-semibold">개별 상품</p>
						<p class="pl-2 text-xs text-gray-700">
							• 키보드 10개↑: 10%<br />
							• 마우스 10개↑: 15%<br />
							• 모니터암 10개↑: 20%<br />
							• 스피커 10개↑: 25%
						</p>
					</div>
					<div class="rounded-lg bg-gray-100 p-3">
						<p class="mb-1 text-sm font-semibold">전체 수량</p>
						<p class="pl-2 text-xs text-gray-700">• 30개 이상: 25%</p>
					</div>
					<div class="rounded-lg bg-gray-100 p-3">
						<p class="mb-1 text-sm font-semibold">특별 할인</p>
						<p class="pl-2 text-xs text-gray-700">
							• 화요일: +10%<br />
							• ⚡번개세일: 20%<br />
							• 💝추천할인: 5%
						</p>
					</div>
				</div>
			</div>
			<div class="mb-6">
				<h3 class="mb-3 text-base font-bold">🎁 포인트 적립</h3>
				<div class="space-y-3">
					<div class="rounded-lg bg-gray-100 p-3">
						<p class="mb-1 text-sm font-semibold">기본</p>
						<p class="pl-2 text-xs text-gray-700">• 구매액의 0.1%</p>
					</div>
					<div class="rounded-lg bg-gray-100 p-3">
						<p class="mb-1 text-sm font-semibold">추가</p>
						<p class="pl-2 text-xs text-gray-700">
							• 화요일: 2배<br />
							• 키보드+마우스: +50p<br />
							• 풀세트: +100p<br />
							• 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
						</p>
					</div>
				</div>
			</div>
			<div class="mt-4 border-t border-gray-200 pt-4">
				<p class="mb-1 text-xs font-bold">💡 TIP</p>
				<p class="text-2xs leading-relaxed text-gray-600">
					• 화요일 대량구매 = MAX 혜택<br />
					• ⚡+💝 중복 가능<br />
					• 상품4 = 품절
				</p>
			</div>
		</div>
	`;
}
