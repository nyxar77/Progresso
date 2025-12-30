export class Router {
    origin;
    routes = {};
    constructor(origin) {
        this.origin = document.querySelector(origin);
        this.listen();
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
    listen() {
        window.addEventListener("popstate", async () => {
            const path = window.location.pathname;
            const { pageRenderer } = this.resolve(path);
            window.dispatchEvent(new Event("urlchange"));
            this.origin.innerHTML = "";
            this.origin?.append(await pageRenderer());
        });
    }
    async loadTemplates(path) {
        const result = await fetch("templates/" + path + `.html?v=${Date.now()}`);
        const htmlStr = await result.text();
        const templateDoc = new DOMParser().parseFromString(htmlStr.trim(), "text/html");
        const template = templateDoc.querySelector("template");
        console.log(template);
        if (template)
            loadRessources(template); // TODO: fix typing later
        return template?.content.cloneNode(true);
    }
    redirect() { }
    //TODO : get params from the uri e.g  :id
    getParams() { }
    addGuard(fn) { }
}
//ATT:legacy
export function renderer(id) {
    let template = document.querySelector(`#${id}`);
    if (template)
        loadRessources(template);
    return template?.content.cloneNode(true);
}
function loadRessources(template) {
    let script = template?.getAttribute("scripting");
    let style = template?.getAttribute("styling");
    if (style && !document.head.querySelector(`#${style}`)) {
        const link = document.createElement("link");
        link.id = style;
        link.rel = "stylesheet";
        link.href = `styles/${style}.css`;
        /* cache busting
        link.href = `styles/${style}.css?v=${Date.now()}`;
        */
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
}
/* function unloadRessources(id: string) {
  document.head.removeChild(document.querySelector<HTMLLinkElement>(`#${id}`);
} */
