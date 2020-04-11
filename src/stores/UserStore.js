import { observable, computed, action } from 'mobx';

class UserStore {
  @observable currentUser = null;

  @computed
  get isLoggedIn() {
    return this.currentUser != null;
  }

  @action
  setUser(user) {
    if (user) {
      this.currentUser = { ...user };
    } else {
      this.currentUser = null;
    }
  }
}

const userStore = new UserStore();
export default userStore;
