import View from './View.js';

// List of deposits with edit and delete (data: [{ id, amount, date, note }]).
export default class DepositListView extends View {
  constructor() { super('.deposit-list'); }

  addHandlerEdit(handler) { this._listen('edit', handler); }

  addHandlerDelete(handler) {
    this._listen('delete', (id) => {
      if (window.confirm('Delete this deposit?')) handler(id);
    });
  }

  _listen(action, handler) {
    this._parent.addEventListener('click', (e) => {
      const btn = e.target.closest(`[data-action="${action}"]`);
      if (btn) handler(btn.dataset.id);
    });
  }

  _generateMarkup() {
    const items = this._data
      .map((d) => `
        <li class="item">
          <div><b>${d.note ? this._esc(d.note) : 'Ipon'}</b><small>${d.date}</small></div>
          <span class="amt">${this._peso(d.amount)}</span>
          <div class="actions">
            <button class="btn btn--ghost btn--small" data-action="edit" data-id="${d.id}">Edit</button>
            <button class="btn btn--ghost btn--small" data-action="delete" data-id="${d.id}">Delete</button>
          </div>
        </li>`)
      .join('');
    return `<h2>Deposits (${this._data.length})</h2>` +
      (items ? `<ul class="list">${items}</ul>` : '<p class="empty">No deposits yet. Add your first ipon.</p>');
  }
}
