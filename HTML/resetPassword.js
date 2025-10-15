const form = document.querySelector("#resetForm");
const mensaje = document.querySelector("#resultado1");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  if (data.password !== data.password2) {
    mensaje.style.color = "red";
    mensaje.textContent = "Las contraseñas no coinciden";
    return;
  }

  const body = {
    contacto: data.contacto,
    password: data.password,
  };

  try {
    const res = await fetch("http://localhost:8080/api/resetCliente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (json.response === "OK") {
      mensaje.className = "exito";
      mensaje.style.color = "green";
      mensaje.textContent = "Contraseña actualizada. Redirigiendo...";
      setTimeout(() => (window.location.href = "loginClient.html"), 1500);
    } else {
      mensaje.className = "mensaje";
      mensaje.style.color = "red";
      mensaje.textContent = json.message || "Error al actualizar";
    }
  } catch (err) {
    mensaje.style.color = "red";
    mensaje.textContent = "Error de red: " + err;
  }
});
