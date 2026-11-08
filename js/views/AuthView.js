import View from './View.js';

// Login and register form (data: { mode: 'login' | 'register' }).
export default class AuthView extends View {
  constructor() { super('.auth__form'); }

  addHandlerSubmit(handler) {
    this._parent.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = Object.fromEntries(new FormData(e.target));
      handler({ mode: this._data.mode, ...fields });
    });
  }

  addHandlerSwitch(handler) {
    this._parent.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-switch]');
      if (btn) handler(btn.dataset.switch);
    });
  }

  _generateMarkup() {
    const login = this._data.mode === 'login';
    return `
      <form novalidate>
        <h1>${login ? 'LOGIN' : 'REGISTER'}</h1>
        <p class="sub">${login ? 'Welcome back. Log in to see your ipon.' : 'Create an account to start saving.'}</p>
        ${login ? '' : '<label>Full name<input name="name" autocomplete="name" /></label>'}
        <label>Username<input name="username" autocomplete="username" /></label>
        <label>Password<input name="password" type="password" autocomplete="${login ? 'current-password' : 'new-password'}" /></label>
        <p class="error" role="alert"></p>
        <button class="btn" type="submit">${login ? 'Login now' : 'Create account'}</button>
        <p class="switch">${login ? 'No account yet?' : 'Already registered?'}
          <button class="link" type="button" data-switch="${login ? 'register' : 'login'}">${login ? 'Register' : 'Login'}</button></p>
      </form>`;
  }
}
