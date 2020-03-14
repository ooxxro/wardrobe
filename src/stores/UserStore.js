export default class UserStore {
  currentUser = null;

  get isLoggedIn() {
    return this.currentUser != null;
  }
}
