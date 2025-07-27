import { DOMManager } from './core/DomManager.js';
import { EventManager } from './core/EventManager.js';
import { UIUpdater } from './core/UIUpdater.js';
import { CalculationEngine } from './helpers/CalculationEngine.js';
import { PromotionManager } from './helpers/PromotionManager.js';
import { ShoppingCartState } from './helpers/ShoppingCartState.js';

export class BootstrapApplication {
  constructor() {
    this.state = new ShoppingCartState();
    this.domManager = new DOMManager();
    this.calculationEngine = new CalculationEngine(this.state);
    this.uiUpdater = new UIUpdater(this.domManager, this.state);
    this.eventManager = new EventManager(
      this.state,
      this.domManager,
      this.calculationEngine,
      this.uiUpdater
    );
    this.promotionManager = new PromotionManager(this.state, this.uiUpdater, this.eventManager);
  }

  initialize() {
    // Initialize application state
    this.state.initializeProducts();

    // Create DOM structure
    this.domManager.createMainLayout();

    // Setup event listeners
    this.eventManager.setupEventListeners();

    // Initial UI update
    this.uiUpdater.updateProductSelector();
    this.eventManager.performFullUpdate();

    // Start promotion timers
    this.promotionManager.startPromotionTimers();
  }
}
