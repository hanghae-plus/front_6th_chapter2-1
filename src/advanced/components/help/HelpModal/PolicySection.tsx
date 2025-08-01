import React from 'react';

const PolicySection: React.FC = () => {
  const discountPolicies = [
    {
      label: '개별 상품 할인:',
      description: '10개 이상 구매 시 상품별 할인율 적용',
    },
    {
      label: '전체 수량 할인:',
      description: '30개 이상 구매 시 25% 할인',
    },
    {
      label: '화요일 할인:',
      description: '매주 화요일 10% 추가 할인',
    },
    {
      label: '⚡ 번개세일:',
      description: '무작위 시간에 시작, 30초마다 랜덤 상품 20% 할인',
    },
    {
      label: '💝 추천할인:',
      description: '무작위 시간에 시작, 60초마다 추천 상품 5% 할인',
    },
    {
      label: '🔥 SUPER SALE:',
      description: '번개세일 + 추천할인 동시 적용 시 25% 할인',
    },
  ];

  const pointsPolicies = [
    {
      label: '기본 적립:',
      description: '최종 결제 금액의 0.1% (1,000원당 1포인트)',
    },
    {
      label: '화요일 보너스:',
      description: '화요일 구매 시 기본 포인트 2배',
    },
    {
      label: '세트 구매 보너스:',
      description: '키보드+마우스 세트: +50p, 풀세트: +100p',
    },
    {
      label: '수량 보너스:',
      description: '10개 이상: +20p, 20개 이상: +50p, 30개 이상: +100p',
    },
  ];

  const stockPolicies = [
    {
      label: '재고 부족:',
      description: '5개 미만 시 "재고 부족" 표시',
    },
    {
      label: '품절:',
      description: '0개 시 "품절" 표시 및 선택 불가',
    },
    {
      label: '전체 재고:',
      description: '50개 미만 시 드롭다운 테두리 색상 변경',
    },
  ];

  const tips = [
    {
      label: '화요일 대량구매:',
      description: 'MAX 혜택을 받을 수 있는 최고의 타이밍',
    },
    {
      label: '⚡+💝 중복:',
      description: '25% SUPER SALE로 최대 할인 혜택',
    },
    {
      label: '실시간 알림:',
      description: 'Toast 알림으로 할인 정보 실시간 확인',
    },
    {
      label: '재고 관리:',
      description: '실시간 재고 확인으로 품절 방지',
    },
  ];

  // 정책 섹션 렌더링 (카드 스타일)
  const renderPolicyCard = (
    title: string,
    icon: string,
    policies: Array<{ label: string; description: string }>,
    bgColor: string,
    textColor: string,
    borderColor: string
  ) => {
    return (
      <div
        className={`${bgColor} ${borderColor} border-2 rounded-lg p-6 shadow-sm`}
      >
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">{icon}</span>
          <h3 className={`text-xl font-semibold ${textColor}`}>{title}</h3>
        </div>
        <div className="space-y-3">
          {policies.map((policy) => (
            <div key={policy.label} className="flex items-start">
              <span className={`font-medium w-40 ${textColor} text-sm`}>
                {policy.label}
              </span>
              <span className={`${textColor} text-sm flex-1`}>
                {policy.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 할인 정책 */}
      {renderPolicyCard(
        '할인 정책',
        '🎯',
        discountPolicies,
        'bg-blue-50',
        'text-blue-900',
        'border-blue-200'
      )}

      {/* 포인트 적립 */}
      {renderPolicyCard(
        '포인트 적립',
        '🎁',
        pointsPolicies,
        'bg-green-50',
        'text-green-900',
        'border-green-200'
      )}

      {/* 재고 관리 */}
      {renderPolicyCard(
        '재고 관리',
        '📦',
        stockPolicies,
        'bg-yellow-50',
        'text-yellow-900',
        'border-yellow-200'
      )}

      {/* 사용 팁 */}
      {renderPolicyCard(
        '사용 팁',
        '💡',
        tips,
        'bg-purple-50',
        'text-purple-900',
        'border-purple-200'
      )}
    </div>
  );
};

export default PolicySection;
