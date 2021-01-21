import {
  toJS, observable, computed, action, decorate,
} from 'mobx';

class UIStore {
  title='';

  setTitle(title: string) {
    this.title = title;
  }
}

decorate(UIStore, { title: observable, setTitle: action });

export default UIStore;
