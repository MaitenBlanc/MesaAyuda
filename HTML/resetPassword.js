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

  // Obtiene los datos del form (password2 no es necesario para la API)
  const body = {
    contacto: data.contacto,
    password: data.password,
  };

  try {
    // Llamado a la API
    const res = await fetch("http://localhost:8080/api/resetCliente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Convierte la respuesta del servidor en un JSON
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
    mensaje.textContent = "DB access error: " + err;
  }
});
