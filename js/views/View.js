// Base class every view extends. Views never import the model.
export default class View {
  _parent;
  _data;

  constructor(selector) {
    this._parent = document.querySelector(selector);
  }

  render(data) {
    this._data = data;
    this._parent.innerHTML = '';
    this._parent.insertAdjacentHTML('afterbegin', this._generateMarkup());
  }

  renderError(message = '') {
    const el = this._parent.querySelector('.error');
    if (el) el.textContent = message;
  }

  _generateMarkup() {
    throw new Error('Subclasses must implement _generateMarkup()');
  }

  _peso(n) {
    return `₱${Number(n).toLocaleString('en-PH', { maximumFractionDigits: 2 })}`;
  }

  _esc(text) {
    const el = document.createElement('div');
    el.textContent = text ?? '';
    return el.innerHTML;
  }
}
