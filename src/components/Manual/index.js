import { createManualColumn } from './ManualColumn.js';

export function createManual() {
  const container = document.createElement('div');
  container.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  const column = createManualColumn();
  container.appendChild(column);

  return container;
}
