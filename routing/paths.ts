import { Router, renderer } from "./router.js";

declare global {
  interface Window {
    redirect: (path: string) => void;
  }
}

let r1 = new Router("#app");
r1.register("/home", () => renderer("home-template"));
r1.register("/about", () => renderer("about-template"));
r1.register("/quizzes", () => renderer("quizzes-template"));
r1.register("/dashboard", () => renderer("dashboard-template"));
r1.register("/notfound", () => renderer("notfound-template"));
// r1.register("/about", () => renderer("about-template"));
window.redirect = function(path: string) {
  r1.navigate(path);
}
