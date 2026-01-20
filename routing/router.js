export class Router {
    origin;
    routes = {};
    constructor(origin, routes = {}) {
        this.origin = document.querySelector(origin);
        this.routes = routes;
        this.listen();
        this.handleCurrentPath();
        // this.navigate(defaultPath);
    }
    register(path, handler) {
        this.routes[path] = handler;
    }
    resolve(path) {
        const pageRenderer = this.routes[path] ?? this.routes["/notfound"];
        const status = path in this.routes ? "200" : "404";
        return { status, pageRenderer };
    }
    async navigate(path) {
        history.pushState(null, "", path);
        const { pageRenderer } = this.resolve(path);
        this.origin.innerHTML = "";
        window.dispatchEvent(new Event("urlchange"));
        this.origin?.append(await pageRenderer());
    }
    async handleCurrentPath() {
        const path = window.location.pathname;
        const { pageRenderer } = this.resolve(path);
        this.origin.innerHTML = "";
        window.dispatchEvent(new Event("urlchange"));
        this.origin?.append(await pageRenderer());
    }
    listen() {
        window.addEventListener("popstate", async () => {
            const path = window.location.pathname;
            const { pageRenderer } = this.resolve(path);
            window.dispatchEvent(new Event("urlchange"));
            this.origin.innerHTML = "";
            this.origin?.append(await pageRenderer());
        });
    }
    static async loadTemplates(path) {
        const result = await fetch("templates/" + path + `.html?v=${Date.now()}`);
        const htmlStr = await result.text();
        const templateDoc = new DOMParser().parseFromString(htmlStr.trim(), "text/html");
        const template = templateDoc.querySelector("template");
        console.log(template);
        if (template) {
            this.loadRessources(template); // TODO: fix typing later
            return template?.content.cloneNode(true);
        }
        else {
            return "";
        }
    }
    //TODO : get params from the uri e.g  :id
    getParams() {
        const path = window.location.pathname;
        for (const [route, _] of Object.entries(this.routes)) {
            const routePattern = this.routeToRegex(route);
            const match = path.match(routePattern);
            if (match) {
                const paramNames = this.extractParamsNames(route);
                const params = {};
                paramNames.forEach((paramName, index) => {
                    params[paramName] = match[index + 1] ?? "";
                });
                return params;
            }
        }
        return {};
    }
    extractParamsNames(route) {
        const paramNames = [];
        const matches = route.match("/:([a-zA-Z0-9_]+/g)");
        if (matches) {
            matches.forEach((match) => {
                paramNames?.push(match.substring(1));
            });
        }
        return paramNames;
    }
    routeToRegex(route) {
        const regexString = route.replace(/:([a-zA-Z0-9_]+)/g, "([^/]+)");
        return new RegExp(`^${regexString}$`);
    }
    static loadRessources(template) {
        let script = template?.getAttribute("scripting");
        let style = template?.getAttribute("styling");
        console.log(style);
        if (style && !document.head.querySelector(`#${style}`)) {
            const link = document.createElement("link");
            link.id = style;
            link.rel = "stylesheet";
            link.href = `styles/${style}.css`;
            //NOTE: cache busting
            //link.href = `styles/${style}.css?v=${Date.now()}`;
            document.head.appendChild(link);
        }
        if (script) {
            import(`../scripts/${script}.js?v=${Date.now()}`)
                .then((module) => {
                try {
                    if (module.init)
                        module.init();
                }
                catch (err) {
                    console.error("script isn't loading: " + err);
                }
            })
                .catch((err) => console.error("script wasn't found: " + err));
        }
    }
}
//ATT:legacy
/* export function renderer(id: string) {
  let template = document.querySelector<HTMLTemplateElement>(`#${id}`);
  if (template) loadRessources(template);
  return template?.content.cloneNode(true);
} */
//ATT: Legacy css import
/* fetch(`styles/${style}.css`, {
    headers: { "Content-Type": "text/css" },
    mode: "cors",
    cache: "force-cache"
  }).then(async module => {

    console.log()
    const css = await module.text()
    const styleTag = document.createElement("style");
    styleTag.id = style;
    styleTag.textContent = css;
    document.head.appendChild(styleTag)
  }).catch(console.log) */
/* function unloadRessources(id: string) {
  document.head.removeChild(document.querySelector<HTMLLinkElement>(`#${id}`);
} */
