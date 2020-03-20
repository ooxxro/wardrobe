import { observable, computed } from 'mobx';
import * as firebase from 'firebase/app';
import 'firebase/auth';

class UserStore {
  @observable currentUser = null;

  @computed
  get isLoggedIn() {
    let user = firebase.auth().currentUser;
    if (user) {
      return true;
    } else {
      return false;
    }
    //return this.currentUser != null;
  }
}

export default new UserStore();
