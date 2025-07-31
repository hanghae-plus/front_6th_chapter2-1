import { App } from './App.js';
import { AppInitializer } from './services/AppInitializer.js';

function main() {
  const root = document.getElementById('app');

  root.innerHTML = App();

  const appInitializer = new AppInitializer();
  appInitializer.initialize();
}

main();
