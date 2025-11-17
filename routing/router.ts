export class Router {
  public origin;
  private routes: Record<string, Function> = {};

  constructor(origin: string) {
    this.origin = document.querySelector<HTMLDivElement>(origin);
    this.listen();
    // this.navigate(defaultPath);
  }

  public register(path: string, handler: Function) {
    this.routes[path] = handler;
  }
  public navigate(path: string) {
    history.pushState(null, "", path)
    const { fn } = this.resolve(path);
    this.origin!.innerHTML = '';
    window.dispatchEvent(new Event("urlchange"));
    this.origin?.append(fn())
  }
  protected resolve(path: string): { status: string, fn: Function } {
    const fn = this.routes[path] ?? this.routes["/notfound"]!;
    const status = path in this.routes ? "200" : "404";
    return { status, fn };
  }

  protected listen() {
    window.addEventListener("popstate", () => {
      const path = window.location.pathname;
      const { fn } = this.resolve(path);
      window.dispatchEvent(new Event("urlchange"));
      this.origin!.innerHTML = '';
      this.origin?.append(fn());
    });
  }

  public redirect() {

  }

  private getParams() {

  }
  private addGuard(fn: Function) {

  }
}


export function renderer(id: string) {
  let template = document.querySelector<HTMLTemplateElement>(`#${id}`);
  if (template)
    mount(template, id)
  return template?.content.cloneNode(true);
}

function mount(template: HTMLTemplateElement, id: string) {

  let script = template?.getAttribute("scripting")
  if (script) {
    import(`../scripts/${script}.js`).then(module => {
      if (module.init) module.init();
    })
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
