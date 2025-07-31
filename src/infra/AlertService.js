export default class AlertService {
  constructor() {
    /** @type {(msg:string)=>void} */
    this._handler = (msg) => window.alert(msg);
  }

  setHandler(fn) {
    this._handler = fn;
  }

  info(msg) {
    this._handler(msg);
  }

  error(msg) {
    this._handler(msg);
  }
}
