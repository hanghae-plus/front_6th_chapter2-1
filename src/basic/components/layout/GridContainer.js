import { LeftColumn } from './LeftColumn.js';
import { RightColumn } from '../summary/RightColumn.js';

/**
 * GridContainer 컴포넌트
 * 메인 레이아웃의 그리드 컨테이너를 렌더링합니다.
 * @param {Object} props - 컴포넌트 props
 * @param {number} [props.total=0] - 총 금액
 * @param {number} [props.bonusPoints=0] - 보너스 포인트
 * @param {Array} [props.pointsDetail=[]] - 포인트 상세 내역
 * @returns {string} 그리드 컨테이너 HTML
 */
export function GridContainer({ total = 0, bonusPoints = 0, pointsDetail = [] }) {
  return /* HTML */ `
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      ${LeftColumn()} ${RightColumn({ total, bonusPoints, pointsDetail })}
    </div>
  `;
}
