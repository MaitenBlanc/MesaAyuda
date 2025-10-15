const form = document.querySelector("#registroForm");
const mensaje = document.querySelector("#mensaje");
const mensaje1 = document.querySelector("#mensaje1");
const mensaje2 = document.querySelector("#mensaje2");
const mensaje3 = document.querySelector("#mensaje3");

// Limpiar mensajes y estilos
function limpiarMensajes() {
  [mensaje1, mensaje2, mensaje3].forEach((el) => (el.textContent = ""));
  form.password.classList.remove("error");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  limpiarMensajes();

  const data = Object.fromEntries(new FormData(form));

  // Validaciones
  if (!data.contacto || !data.password) {
    mensaje0.style.color = "red";
    mensaje0.textContent = "Debe completar todos los campos.";
    return;
  }
  
  if (!data.contacto) {
    mensaje1.style.color = "red";
    mensaje1.textContent = "Debe completar el campo usuario.";
    return;
  }

  if (!data.password || data.password.length < 4) {
    mensaje2.style.color = "red";
    mensaje2.textContent = "La contraseña debe tener al menos 4 caracteres.";
    return;
  }

  if (data.termscondition !== "on") {
    mensaje3.style.color = "red";
    mensaje3.textContent = "Debe aceptar los términos y condiciones.";
    return;
  }

  // Chequear si el usuario ya existe
  try {
    const existe = await fetch(
      `http://localhost:8080/api/getCliente/${encodeURIComponent(
        data.contacto
      )}`
    );
    if (existe.ok) {
      const json = await existe.json();
      if (json && json.contacto === data.contacto) {
        mensaje.style.color = "red";
        mensaje.textContent =
          "El usuario ya existe. No puede registrarse nuevamente.";
        return;
      }
    }
  } catch (err) {
    console.warn("No se pudo verificar existencia del usuario:", err);
  }

  // Crear el cuerpo del nuevo cliente
  const body = {
    contacto: data.contacto,
    password: data.password,
    nombre: data.contacto.split("@")[0],
    activo: true,
    registrado: true,
    fecha_alta: new Date().toISOString(),
    fecha_ultimo_ingreso: new Date().toISOString(),
  };

  try {
    const res = await fetch("http://localhost:8080/api/addCliente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (json.response === "OK") {
      mensaje.style.color = "green";
      mensaje.textContent = "Usuario creado exitosamente. Redirigiendo...";
      setTimeout(() => (window.location.href = "loginClient.html"), 1500);
    } else {
      mensaje.style.color = "red";
      mensaje.textContent = json.message || "Error al registrar.";
    }
  } catch (err) {
    mensaje.style.color = "red";
    mensaje.textContent = "Error de conexión con el servidor.";
  }
});
