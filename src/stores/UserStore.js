import { observable, computed } from 'mobx';

class UserStore {
  @observable currentUser = null;

  @computed
  get isLoggedIn() {
    return this.currentUser != null;
  }
}

export default new UserStore();
