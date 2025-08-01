import { IBonusPointsResult } from "./types";

interface PointsDisplayProps {
  bonusPointsResult: IBonusPointsResult | null;
}

/**
 * Points 도메인 - 포인트 표시 컴포넌트
 *
 * 보너스 포인트 정보를 표시
 * - 총 포인트
 * - 포인트 적립 상세 내역
 * - 콤보/수량/특별날짜 보너스 표시
 */
export function PointsDisplay({ bonusPointsResult }: PointsDisplayProps) {
  if (!bonusPointsResult || bonusPointsResult.totalPoints === 0) {
    return null;
  }

  return (
    <div className="bg-blue-500/20 rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs uppercase tracking-wide text-blue-400">보너스 포인트</span>
        <span className="text-lg font-bold text-blue-400">{bonusPointsResult.totalPoints}p</span>
      </div>

      {bonusPointsResult.details.length > 0 && (
        <div className="space-y-1">
          {bonusPointsResult.details.map((detail, index) => (
            <div key={index} className="text-xs text-blue-300">
              {detail}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
