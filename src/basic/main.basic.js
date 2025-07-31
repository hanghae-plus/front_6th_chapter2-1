import { App } from './App.js';
import { initializeApp } from './services/AppInitializer.js';

function main() {
  try {
    // 1. 렌더링
    const root = document.getElementById('app');
    root.innerHTML = App();

    // 2. 초기화
    initializeApp();
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

main();
