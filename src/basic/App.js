import { GridContainer } from './components/layout/GridContainer';
import { Header } from './components/layout/Header';
import { ManualOverlay } from './components/manual/ManualOverlay';
import { ManualToggle } from './components/manual/ManualToggle';
import { cartState } from './states/cartState';

export function App() {
  return /* HTML */ `
    <div>
      ${Header({ itemCount: cartState.itemCount })}
      ${GridContainer({
        total: cartState.total,
        bonusPoints: 0,
        pointsDetail: [],
      })}
      ${ManualToggle()} ${ManualOverlay()}
    </div>
  `;
}
