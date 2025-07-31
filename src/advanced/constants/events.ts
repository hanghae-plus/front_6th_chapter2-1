// ============== 자동 이벤트 관련 상수 ==============

export const EVENT_CONSTANTS = {
  // 타이머 타입
  TIMER_TYPES: {
    LIGHTNING: 'lightning',
    SUGGESTED: 'suggested',
  } as const,
  
  // 이벤트 상태
  EVENT_STATUS: {
    RUNNING: true,
    STOPPED: false,
  } as const,
  
  // 타이머 초기값
  TIMER_INITIAL: null,
} as const; 