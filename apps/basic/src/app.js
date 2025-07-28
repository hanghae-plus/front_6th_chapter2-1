import { DOMElementManager } from '@core/DomManager';
import { EventManager } from '@core/EventManager';
import { UIUpdater } from '@core/UIUpdater';
import { CalculationEngine } from '@helpers/CalculationEngine';
import { PromotionManager } from '@helpers/PromotionManager';
import { ShoppingCartState } from '@helpers/ShoppingCartState';
import { ApplicationService } from '@services/ApplicationService';

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
