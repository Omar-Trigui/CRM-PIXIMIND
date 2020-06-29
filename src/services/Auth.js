export default class Auth {
  constructor(history) {
    this.history = history;
  }
  login = () => {
    window.location = "/login";
  };
  handelAuthentication = (user) => {
    if (user) {
      this.setSession(user);

      this.history.push("/dashboard");
      this.history.go("/dashboard");
    } else {
      this.history.push("/login");
      this.history.go("/login");
    }
  };
  setSession = (user) => {
    localStorage.setItem("access_token", user.token);
    localStorage.setItem("expires_at", user.expiresAt);
    localStorage.setItem("group", user.group);
  };
  logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("group");
    this.login();
  };
  isAuthenticated() {
    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    if (new Date().getTime() < expiresAt) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }
  hasGroup() {
    let group = localStorage.getItem("group");
    return group === "undefined" || group === "null" ? false : true;
  }
}
