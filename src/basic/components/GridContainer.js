class GridContainer {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.container = null;
    this.leftSlot = null; // 왼쪽 Container
    this.rightSlot = null; // 오른쪽 Container
  }

  template() {
    return `
      <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
        <!-- Left Column -->
      </div>
      <div class="bg-black text-white p-8 flex flex-col">
        <!-- Right Column -->
      </div>
    `;
  }

  render() {
    this.container = document.createElement('div');
    this.container.className =
      'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
    this.container.innerHTML = this.template();
    this.parentElement.appendChild(this.container);

    this.leftSlot = this.container.querySelector('#left-column');
    this.rightSlot = this.container.querySelector('#right-column');
  }
}

export default GridContainer;
