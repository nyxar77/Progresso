function signup() {
  let body = document.body;
  let form = body.querySelector<HTMLFormElement>(".auth-form");

  form?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.querySelector<HTMLInputElement>("#username");
    const password = document.querySelector<HTMLInputElement>("#password");
    const status = document.querySelector<HTMLInputElement>("#status-form");

    if (username?.value && password?.value) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          usernameStored: username.value,
          passwordStored: password.value,
        }),
      );
      status!.textContent = "user is created, you can login now!";
    }
  });
}

signup();
