import { DOMElementManager } from './core/DomManager.js';
import { EventManager } from './core/EventManager.js';
import { UIUpdater } from './core/UIUpdater.js';
import { CalculationEngine } from './helpers/CalculationEngine.js';
import { PromotionManager } from './helpers/PromotionManager.js';
import { ShoppingCartState } from './helpers/ShoppingCartState.js';
import { ApplicationService } from './services/ApplicationService.js';

export class BootstrapApplication {
  constructor() {
    this.domElementManager = new DOMElementManager();
    this.eventManager = new EventManager();
    this.uiUpdater = new UIUpdater(this.domElementManager);
    this.state = new ShoppingCartState();
    this.calculationEngine = new CalculationEngine(this.state);
    this.promotionManager = new PromotionManager();
    this.applicationService = new ApplicationService(
      this.domElementManager,
      this.eventManager,
      this.uiUpdater,
      this.state,
      this.calculationEngine
    );
  }

  initialize() {
    this.applicationService.initialize();
  }
}
