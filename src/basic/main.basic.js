import { GridContainer } from './components/layout/GridContainer.js';
import { Header } from './components/layout/Header.js';
import { ManualOverlay } from './components/manual/ManualOverlay.js';
import { ManualToggle } from './components/manual/ManualToggle.js';
import { AppInitializer } from './services/AppInitializer.js';
import { cartState } from './states/cartState.js';

/**
 * 애플리케이션의 메인 함수
 * UI를 렌더링하고 AppInitializer를 통해 초기화를 수행합니다.
 */
function main() {
  const root = document.getElementById('app');

  root.innerHTML = /* HTML */ `
    ${Header({ itemCount: cartState.itemCount })}
    ${GridContainer({
      total: cartState.total,
      bonusPoints: 0,
      pointsDetail: [],
    })}
    ${ManualToggle()} ${ManualOverlay()}
  `;

  // AppInitializer를 통한 초기화
  const appInitializer = new AppInitializer();
  appInitializer.initialize();
}

main();
