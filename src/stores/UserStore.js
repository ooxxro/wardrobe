import { observable, computed } from 'mobx';
import * as firebase from 'firebase/app';
import 'firebase/auth';

class UserStore {
  @observable currentUser = null;

  @computed
  get isLoggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //User is Signed in
        return true;
      } else {
        //User is signed out
        return false;
      }
    });

    //return this.currentUser != null;
  }
}

export default new UserStore();
