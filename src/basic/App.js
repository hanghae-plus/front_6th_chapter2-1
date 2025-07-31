import Header from './components/layout/Header.js';
import ManualOverlay from './components/layout/HelpOverlay.js';
import ManualToggle from './components/layout/HelpToggle.js';
import MainLayout from './components/layout/MainLayout.js';
import Component from './lib/Component.js';

export default class App extends Component {
  mounted() {
    this.renderChildren({
      header: {
        selector: '#header',
        Component: Header,
      },
      mainLayout: {
        selector: '#main-layout',
        Component: MainLayout,
      },
      manualToggle: {
        selector: '#manual-toggle',
        Component: ManualToggle,
      },
      manualOverlay: {
        selector: '#manual-overlay',
        Component: ManualOverlay,
      },
    });
  }

  setEvent() {
    const $manualToggle = document.querySelector('#manualToggle');
    const $manualOverlay = document.querySelector('#manualOverlay');
    const $manualColumn = document.querySelector('#manualColumn');

    $manualToggle.addEventListener('click', () => {
      $manualOverlay.classList.toggle('hidden');
      $manualColumn.classList.toggle('translate-x-full');
    });

    $manualOverlay.addEventListener('click', e => {
      if (e.target === $manualOverlay) {
        $manualOverlay.classList.add('hidden');
        $manualColumn.classList.add('translate-x-full');
      }
    });
  }

  template() {
    return /* HTML */ `
      <div id="header"></div>
      <div id="main-layout"></div>
      <div id="manual-toggle"></div>
      <div id="manual-overlay"></div>
    `;
  }
}
