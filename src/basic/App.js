import Header from "./components/Header.js";
import MainLayout from "./components/MainLayout.js";
import Component from "./lib/Component.js";

export default class App extends Component {
  mounted() {
    this.renderChildren({
      header: {
        selector: "#header",
        Component: Header,
      },
      mainLayout: {
        selector: "#main-layout",
        Component: MainLayout,
      },
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
