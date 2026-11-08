import View from './View.js';

// Top bar (data: { name }).
export default class HeaderView extends View {
  constructor() { super('.topbar'); }

  addHandlerLogout(handler) {
    this._parent.addEventListener('click', (e) => {
      if (e.target.closest('[data-logout]')) handler();
    });
  }

  _generateMarkup() {
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    return `
      <nav>Dashboard</nav>
      <div class="right">
        <span>${date}</span>
        <span>Hi, ${this._esc(this._data.name)}</span>
        <button class="btn btn--ghost btn--small" data-logout>Log out</button>
      </div>`;
  }
}
