import Component from '../../lib/Component.js';

export default class PointInfo extends Component {
  template() {
    return `
      <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.<br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    `;
  }
}
