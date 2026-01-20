function login() {
  let body = document.body;
  let form = body.querySelector<HTMLFormElement>(".auth-form");

  form?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.querySelector<HTMLInputElement>("#username");
    const password = document.querySelector<HTMLInputElement>("#password");

    const status = document.querySelector<HTMLInputElement>("#status-form");

    if (username?.value && password?.value) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          let { usernameStored, passwordStored } = JSON.parse(storedUser);

          if (
            username.value === usernameStored &&
            password.value === passwordStored
          ) {
            window.redirect("/dashboard");
          } else {
            console.error("Invalid username or password.");
            status!.textContent = "Invalid username or password.";
          }
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          status!.textContent = "Error parsing stored user data:";
        }
      } else {
        console.error("No user data found.");
        status!.textContent = "No user data found.";
      }
    } else {
      console.warn("Username or password cannot be empty.");
      status!.textContent = "Username or password cannot be empty.";
    }
  });
}

login();
