import {
  toJS, observable, computed, action, decorate,
} from 'mobx';
import Cookie from 'mobx-cookie';

interface Viewer {
  _id: string | null,
  firstName: string | null,
  lastName: string | null,
  email: string | null,
  type?: string | null,
  nickName: string | null,
  isActivated: boolean,
}
class AuthStore {
  token = new Cookie('zoomed-token');

  viewer: Viewer = {
    _id: null,
    firstName: null,
    lastName: null,
    email: null,
    type: null,
    nickName: null,
    isActivated: false,
  };

  get currentToken(): string | undefined { return this.token.value; }

  get getViewer(): Viewer { return this.viewer; }

  setToken(token: string): void {
    this.token.set(token);
  }

  setViewer(viewer: Viewer): void {
    this.viewer = viewer;
  }

  logout(): void {
    this.token.remove();
  }

  isLoggedIn(): boolean {
    return !!this.viewer._id;
  }
}

decorate(AuthStore, {
  currentToken: computed,
  isLoggedIn: computed,
  cookie: observable,
  viewer: observable,
  setViewer: action,
  getViewer: computed,
  logout: action,
});

export default AuthStore;
