import AuthDialog from './AuthDialog.js';
import ApiBackend from '../ApiBackend.js';

export default class UserService {
  constructor() {}

  static async showAuthDialog() {
    const api = new ApiBackend('');
    const authDialog = new AuthDialog(api);
    const dialog = authDialog.render();
    document.body.appendChild(dialog);
    dialog.showModal();

    await new Promise((resolve) => {
      authDialog.addEventListener('auth', resolve, { once: true });
    });

    dialog.close();
    dialog.remove();
    return {
      username: authDialog.result,
      status: authDialog.status,
      isLoggedIn: authDialog.isLoggedIn,
      authBtnClick: authDialog.authBtnClick,
    };
  }
}
