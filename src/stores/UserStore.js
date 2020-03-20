import { observable, computed } from 'mobx';
import * as firebase from 'firebase/app';
import 'firebase/auth';

class UserStore {
  @observable currentUser = null;

  @computed
  get isLoggedIn() {
    return this.currentUser != null;
  }
}

export default new UserStore();
