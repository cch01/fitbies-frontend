import {
  toJS, observable, computed, action, decorate,
} from 'mobx';

const expires = parseInt(process.env.REACT_APP_LOGIN_TOKEN_EXPIRY_DAY as string, 10);
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
  token = localStorage.getItem('access-token');

  viewer: Viewer = {
    _id: null,
    firstName: null,
    lastName: null,
    email: null,
    type: null,
    nickName: null,
    isActivated: false,
  };

  get currentToken(): string | null { return toJS(this.token); }

  get currentViewer(): Viewer { return toJS(this.viewer); }

  setToken = (newToken: string) => {
    localStorage.setItem('access-token', newToken);
    this.token = localStorage.getItem('access-token');
  }

  setViewer(viewer: Viewer): void {
    this.viewer = viewer;
  }

  logout = () => {
    localStorage.removeItem('access-token');
    this.token = localStorage.getItem('access-token');
  }

  get isLoggedIn(): boolean {
    return !!this.currentViewer._id;
  }
}

decorate(AuthStore, {
  currentToken: computed,
  isLoggedIn: computed,
  token: observable,
  setToken: action,
  viewer: observable,
  setViewer: action,
  currentViewer: computed,
  logout: action,
} as any);

export default AuthStore;
