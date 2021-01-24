import {
  toJS, observable, computed, action, decorate,
} from 'mobx';

const expires = parseInt(process.env.REACT_APP_LOGIN_TOKEN_EXPIRY_DAY as string, 10);
interface Viewer {
  _id: string | undefined,
  firstName: string | undefined,
  lastName: string | undefined,
  email: string | undefined,
  type?: string | undefined,
  nickName: string | undefined,
  isActivated: boolean,
}
class AuthStore {
  token = localStorage.getItem('access-token');

  viewer: Viewer = {
    _id: undefined,
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    type: undefined,
    nickName: undefined,
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
