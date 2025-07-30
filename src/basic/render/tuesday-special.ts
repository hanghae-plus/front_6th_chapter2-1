import { isTuesday } from '../utils/day';
import { selectById } from '../utils/selector';

export function renderTuesdaySpecial() {
  const tuesdaySpecial = selectById('tuesday-special');
  if (isTuesday()) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}
