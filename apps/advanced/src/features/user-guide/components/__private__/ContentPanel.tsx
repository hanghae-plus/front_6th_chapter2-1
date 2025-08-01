import { CloseIcon } from "../../../../shared/components";
import { BenefitCard } from "./BenefitCard";
import { HelpSection } from "./HelpSection";

type ContentPanelProps = {
	isOpen: boolean;
	onClose: () => void;
};

export function ContentPanel(props: ContentPanelProps) {
	const { isOpen, onClose } = props;

	return (
		<div
			className={`fixed right-0 top-0 z-50 h-full w-80 transform overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
		>
			<h2 className="mb-4 text-xl font-bold">📖 이용 안내</h2>
			<button className="absolute right-4 top-4 text-gray-500 hover:text-black" onClick={onClose}>
				<CloseIcon />
			</button>

			<HelpSection title="할인 정책" icon="💰">
				<BenefitCard title="개별 상품">
					• 키보드 10개↑: 10%
					<br />
					• 마우스 10개↑: 15%
					<br />
					• 모니터암 10개↑: 20%
					<br />• 스피커 10개↑: 25%
				</BenefitCard>
				<BenefitCard title="전체 수량">• 30개 이상: 25%</BenefitCard>
				<BenefitCard title="특별 할인">
					• 화요일: +10%
					<br />
					• ⚡번개세일: 20%
					<br />• 💝추천할인: 5%
				</BenefitCard>
			</HelpSection>

			<HelpSection title="포인트 적립" icon="🎁">
				<BenefitCard title="기본">• 구매액의 0.1%</BenefitCard>
				<BenefitCard title="추가">
					• 화요일: 2배
					<br />
					• 키보드+마우스: +50p
					<br />
					• 풀세트: +100p
					<br />• 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
				</BenefitCard>
			</HelpSection>

			<div className="mt-4 border-t border-gray-200 pt-4">
				<p className="mb-1 text-xs font-bold">💡 TIP</p>
				<p className="text-2xs leading-relaxed text-gray-600">
					• 화요일 대량구매 = MAX 혜택
					<br />
					• ⚡+💝 중복 가능
					<br />• 상품4 = 품절
				</p>
			</div>
		</div>
	);
}
