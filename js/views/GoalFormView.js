import View from './View.js';

// Edit the savings goal (data: goal).
export default class GoalFormView extends View {
  constructor() { super('.goal-form'); }

  addHandlerSubmit(handler) {
    this._parent.addEventListener('submit', (e) => {
      e.preventDefault();
      handler(Object.fromEntries(new FormData(e.target)));
    });
  }

  _generateMarkup() {
    const g = this._data;
    return `
      <form class="stack" novalidate>
        <h2>Your goal</h2>
        <label>Goal name<input name="name" value="${this._esc(g.name)}" /></label>
        <label>Target amount (₱)<input name="target" type="number" min="1" step="any" value="${g.target}" /></label>
        <label>Target date<input name="deadline" type="date" value="${g.deadline}" /></label>
        <p class="error" role="alert"></p>
        <button class="btn" type="submit">Save goal</button>
      </form>`;
  }
}
