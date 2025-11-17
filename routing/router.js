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
    navigate(path) {
        history.pushState(null, "", path);
        const { fn } = this.resolve(path);
        this.origin.innerHTML = '';
        window.dispatchEvent(new Event("urlchange"));
        this.origin?.append(fn());
    }
    resolve(path) {
        const fn = this.routes[path] ?? this.routes["/notfound"];
        const status = path in this.routes ? "200" : "404";
        return { status, fn };
    }
    listen() {
        window.addEventListener("popstate", () => {
            const path = window.location.pathname;
            const { fn } = this.resolve(path);
            window.dispatchEvent(new Event("urlchange"));
            this.origin.innerHTML = '';
            this.origin?.append(fn());
        });
    }
    redirect() {
    }
    getParams() {
    }
    addGuard(fn) {
    }
}
export function renderer(id) {
    let template = document.querySelector(`#${id}`);
    if (template)
        mount(template, id);
    return template?.content.cloneNode(true);
}
function mount(template, id) {
    let script = template?.getAttribute("scripting");
    if (script) {
        import(`../scripts/${script}.js`).then(module => {
            if (module.init)
                module.init();
        });
    }
    /* let style = template?.getAttribute("styling")
    if (style) {
      let link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `../styles/${style}.css`;
      document.head.append(link)
    } */
}
/* function unmount(id: string) {
  document.head.removeChild(document.querySelector<HTMLLinkElement>(`#${id}`);
} */
