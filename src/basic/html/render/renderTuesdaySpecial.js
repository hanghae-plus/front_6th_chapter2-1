import { isTodayTuesday } from '../../utils/isTodayTuesday';

// 화요일 스페셜
export const renderTuesdaySpecial = (appState) => {
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (!tuesdaySpecial) return;

  if (isTodayTuesday() && appState.totalAfterDiscount > 0) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
};
