import View from './View.js';

// Switches between the login screen and the dashboard.
export default class ScreenView extends View {
  constructor() { super('body'); }

  show(name) {
    this._parent.dataset.screen = name;
  }

  _generateMarkup() { return ''; }
}
