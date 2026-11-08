import View from './View.js';

// Add or edit a deposit (data: { deposit | null, today }).
export default class DepositFormView extends View {
  constructor() { super('.deposit-form'); }

  addHandlerSubmit(handler) {
    this._parent.addEventListener('submit', (e) => {
      e.preventDefault();
      handler(Object.fromEntries(new FormData(e.target)));
    });
  }

  addHandlerCancel(handler) {
    this._parent.addEventListener('click', (e) => {
      if (e.target.closest('[data-cancel]')) handler();
    });
  }

  _generateMarkup() {
    const { deposit, today } = this._data;
    return `
      <form class="stack" novalidate>
        <h2>${deposit ? 'Edit deposit' : 'Add deposit'}</h2>
        <input type="hidden" name="id" value="${deposit?.id ?? ''}" />
        <label>Amount (₱)<input name="amount" type="number" min="1" step="any" value="${deposit?.amount ?? ''}" /></label>
        <label>Date saved<input name="date" type="date" max="${today}" value="${deposit?.date ?? today}" /></label>
        <label>Note (optional)<input name="note" maxlength="60" value="${this._esc(deposit?.note)}" placeholder="e.g. baon savings" /></label>
        <p class="error" role="alert"></p>
        <div class="actions">
          <button class="btn" type="submit">${deposit ? 'Update deposit' : 'Add deposit'}</button>
          ${deposit ? '<button class="btn btn--ghost" type="button" data-cancel>Cancel</button>' : ''}
        </div>
      </form>`;
  }
}
