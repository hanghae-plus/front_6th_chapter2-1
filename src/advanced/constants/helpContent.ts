/**
 * 도움말 모달 내용 상수
 */
export const HELP_CONTENT = {
  title: "📖 이용 안내",
  sections: {
    discount: {
      title: "💰 할인 정책",
      items: [
        {
          subtitle: "개별 상품",
          content: [
            "• 키보드 10개↑: 10%",
            "• 마우스 10개↑: 15%",
            "• 모니터암 10개↑: 20%",
            "• 스피커 10개↑: 25%",
          ],
        },
        {
          subtitle: "전체 수량",
          content: ["• 30개 이상: 25%"],
        },
        {
          subtitle: "특별 할인",
          content: ["• 화요일: +10%", "• ⚡번개세일: 20%", "• 💝추천할인: 5%"],
        },
      ],
    },
    points: {
      title: "🎁 포인트 적립",
      items: [
        {
          subtitle: "기본",
          content: ["• 구매액의 0.1%"],
        },
        {
          subtitle: "추가",
          content: [
            "• 화요일: 2배",
            "• 키보드+마우스: +50p",
            "• 풀세트: +100p",
            "• 10개↑: +20p / 20개↑: +50p / 30개↑: +100p",
          ],
        },
      ],
    },
  },
  tips: {
    title: "💡 TIP",
    content: ["• 화요일 대량구매 = MAX 혜택", "• ⚡+💝 중복 가능", "• 상품4 = 품절"],
  },
} as const;
