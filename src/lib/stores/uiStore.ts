import {
  toJS, observable, computed, action, decorate,
} from 'mobx';

class UIStore {
  @observable
  title='';

  @action
  setTitle(title: string) {
    this.title = title;
  }
}

export default UIStore;
