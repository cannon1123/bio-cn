document.getElementById("loginBtn").addEventListener("click", function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username && password) {
    document.body.classList.add("success");
    document.body.classList.remove("error");

    this.style.background = "linear-gradient(135deg, #00ff88 0%, #00ffaa 100%)";
    this.innerHTML = "<span>✓ ACCESS GRANTED</span>";
    this.style.boxShadow = "0 0 50px rgba(0, 255, 136, 0.8)";

    setTimeout(() => {
      document.body.classList.remove("success");
      this.style.background =
        "linear-gradient(135deg, #0088ff 0%, #00d9ff 100%)";
      this.innerHTML = "<span>► LOGIN</span>";
      this.style.boxShadow = "0 0 30px rgba(0, 217, 255, 0.4)";
    }, 2500);
  } else {
    document.body.classList.add("error");
    document.body.classList.remove("success");

    this.style.background = "linear-gradient(135deg, #ff3333 0%, #ff6666 100%)";
    this.innerHTML = "<span>✗ INCOMPLETE DATA</span>";
    this.style.boxShadow = "0 0 50px rgba(255, 51, 51, 0.8)";

    setTimeout(() => {
      document.body.classList.remove("error");
      this.style.background =
        "linear-gradient(135deg, #0088ff 0%, #00d9ff 100%)";
      this.innerHTML = "<span>► LOGIN</span>";
      this.style.boxShadow = "0 0 30px rgba(0, 217, 255, 0.4)";
    }, 2000);
  }
});

const inputs = document.querySelectorAll("input");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentElement.style.transform = "scale(1)";
  });

  input.addEventListener("blur", function () {
    this.parentElement.style.transform = "scale(1)";
  });
});
