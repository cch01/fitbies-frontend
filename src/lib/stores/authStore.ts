import {
  toJS, observable, computed, action, decorate,
} from 'mobx';

const expires = parseInt(process.env.REACT_APP_LOGIN_TOKEN_EXPIRY_DAY as string, 10);
interface Viewer {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  type?: string;
  nickName?: string;
  isActivated: boolean;
}
class AuthStore {
  @observable token = localStorage.getItem('access-token');

  @observable
  viewer: Viewer = {
    _id: undefined,
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    type: undefined,
    nickName: undefined,
    isActivated: false,
  };

  @action
  setToken = (newToken: string) => {
    localStorage.setItem('access-token', newToken);
    this.token = localStorage.getItem('access-token');
  }

  @action
  setViewer(viewer: Viewer): void {
    this.viewer = viewer;
  }

  @action
  logout = () => {
    localStorage.removeItem('access-token');
    this.token = localStorage.getItem('access-token');
  }

  @computed
  get isLoggedIn(): boolean {
    return !!this.viewer._id;
  }
}

export default AuthStore;
