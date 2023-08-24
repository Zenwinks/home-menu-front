import { defineStore } from 'pinia';

import AuthService from '__/services/auth.service';

const stringUser = localStorage.getItem('user');
let user;
if(stringUser) user = JSON.parse(stringUser);

const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const useAuthStore = defineStore('auth', {
  state: () => (initialState),
  getters: {},
  actions: {
    login(user: User) {
      return AuthService.login(user).then(
        user => {
          this.status.loggedIn = true;
          this.user = user;
          return Promise.resolve(user);
        },
        error => {
          this.status.loggedIn = false;
          this.user = null;
          return Promise.reject(error);
        }
      );
    },
    logout() {
      AuthService.logout();
      this.status.loggedIn = false;
      this.user = null;
    },
  }
});
