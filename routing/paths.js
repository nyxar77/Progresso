import { Router } from "./router.js";
let r1 = new Router("#app");
r1.register("", () => r1.loadTemplates("dashboard"));
r1.register("/home", () => r1.loadTemplates("home"));
r1.register("/about", () => r1.loadTemplates("about"));
r1.register("/quizzes", () => r1.loadTemplates("quizzes"));
r1.register("/login", () => r1.loadTemplates("login"));
r1.register("/dashboard", () => r1.loadTemplates("dashboard"));
r1.register("/notfound", () => r1.loadTemplates("notfound"));
window.redirect = function (path) {
    r1.navigate(path);
};
//ATT: legacy routing
/* r1.register("/home", () => renderer("home-template"));
r1.register("/about", () => renderer("about-template"));
r1.register("/quizzes", () => renderer("quizzes-template"));
r1.register("/dashboard", () => renderer("dashboard-template"));
r1.register("/notfound", () => renderer("notfound-template")); */
