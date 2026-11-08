import View from './View.js';

// Progress donut and key numbers (data: summary object).
export default class SummaryView extends View {
  constructor() { super('.summary'); }

  _generateMarkup() {
    const s = this._data;
    return `
      <div class="donut" style="--p:${s.percent}"><span>${s.percent}%</span></div>
      <div>
        <h2>Your progress</h2>
        <div class="stats">
          <div><small>Saved</small><strong>${this._peso(s.saved)}</strong></div>
          <div><small>Remaining</small><strong>${this._peso(s.remaining)}</strong></div>
          <div><small>Per week</small><strong>${this._peso(s.perWeek)}</strong></div>
          <div><small>Per day</small><strong>${this._peso(s.perDay)}</strong></div>
          <div><small>Days left</small><strong>${s.daysLeft}</strong></div>
        </div>
        <span class="pill">${s.reached ? 'Goal reached! 🎉' : 'Keep going'}</span>
      </div>`;
  }
}
