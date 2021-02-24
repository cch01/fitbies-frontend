import {
  toJS, observable, computed, action, decorate,
} from 'mobx';

const expires = parseInt(process.env.REACT_APP_LOGIN_TOKEN_EXPIRY_DAY as string, 10);

const emptyViewer = {
  _id: undefined,
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  type: undefined,
  nickname: undefined,
  isActivated: false,
};
interface Viewer {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  type?: string;
  nickname?: string;
  isActivated: boolean;
}
class AuthStore {
  @observable token = localStorage.getItem('access-token') || '';

  @observable
  viewer: Viewer = emptyViewer;

  @action
  setToken = (newToken: string) => {
    console.log('set token', newToken);
    localStorage.setItem('access-token', newToken);
    this.token = newToken;
  }

  @action
  setViewer(viewer: Viewer): void {
    this.viewer = viewer;
  }

  @action
  logout = () => {
    console.log('rm token');
    localStorage.removeItem('access-token');
    this.token = '';
    this.viewer = emptyViewer;
  }

  @computed
  get isRegistered(): boolean {
    return !!this.viewer._id;
  }
}

export default AuthStore;
