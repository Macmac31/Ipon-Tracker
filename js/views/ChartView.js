import View from './View.js';

// Last 7 days of savings (data: [{ label, total }]).
export default class ChartView extends View {
  constructor() { super('.chart'); }

  _generateMarkup() {
    const max = Math.max(...this._data.map((d) => d.total), 1);
    const bars = this._data
      .map((d) => `
        <div class="bar" title="${this._peso(d.total)}">
          <div class="bar__track"><div class="bar__fill" style="height:${(d.total / max) * 100}%"></div></div>
          <span>${d.label}</span>
        </div>`)
      .join('');
    return `<h2>Savings this week</h2><div class="bars">${bars}</div>`;
  }
}
