import View from './View.js';

// Profile and goal card (data: { user, goal, summary }).
export default class SidebarView extends View {
  constructor() { super('.sidebar'); }

  _generateMarkup() {
    const { user, goal, summary } = this._data;
    return `
      <div class="avatar">${this._esc(user.name.charAt(0).toUpperCase())}</div>
      <div><strong>${this._esc(user.name)}</strong><div class="id">@${this._esc(user.username)}</div></div>
      <div class="goal-card">
        <h3>${this._esc(goal.name)}</h3>
        <p>Target ${this._peso(goal.target)} by ${goal.deadline}</p>
      </div>
      <div class="mini"><small>Total saved</small><strong>${this._peso(summary.saved)}</strong></div>
      <div class="mini mini--b"><small>Still to save</small><strong>${this._peso(summary.remaining)}</strong></div>
      <div class="mini mini--c"><small>Needed per week</small><strong>${this._peso(summary.perWeek)}</strong></div>`;
  }
}
