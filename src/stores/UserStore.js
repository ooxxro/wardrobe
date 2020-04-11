import { observable, computed, action } from 'mobx';

class UserStore {
  @observable currentUser = null;

  @computed
  get isLoggedIn() {
    return this.currentUser != null;
  }

  @action
  setUser(user) {
    this.currentUser = { ...user };
  }
}

const userStore = new UserStore();
export default userStore;
