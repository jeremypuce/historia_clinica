const form = document.querySelector("#historia-clinica-form");
const message = document.querySelector("#form-message");
const painValue = document.querySelector("#valorDolor");
const submitButton = form.querySelector('button[type="submit"]');

if (window.location.hostname.endsWith(".github.io")) {
  submitButton.disabled = true;
  message.classList.add("is-error");
  message.textContent = "El formulario no está disponible en esta publicación estática: falta el backend.";
}

form.querySelector("#dolor").addEventListener("input", (event) => {
  painValue.textContent = event.target.value;
});

form.addEventListener("reset", () => {
  message.textContent = "";
  message.className = "form-message";
  painValue.textContent = "0";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  form.setAttribute("aria-busy", "true");
  message.className = "form-message";
  message.textContent = "Guardando...";

  try {
    const values = new FormData(form);
    const optionalText = (name) => values.get(name)?.trim() || null;
    const optionalNumber = (name) => {
      const value = values.get(name);
      return value === null || value === "" ? null : Number(value);
    };
    const appointment = values.get("cita");
    const patient = {
      nombre: values.get("nombre").trim(),
      cedula: values.get("cedula").trim(),
      email: values.get("email").trim(),
      fechaNacimiento: values.get("fecha_nacimiento"),
      telefono: optionalText("telefono"),
      cargas: optionalNumber("cargas"),
      genero: optionalText("genero"),
      ciudad: optionalText("ciudad"),
      sangre: optionalText("sangre"),
      motivo: optionalText("motivo"),
      dolor: optionalNumber("dolor"),
      cita: appointment ? new Date(appointment).toISOString() : null,
      especialidad: optionalText("especialidad")
    };
    const response = await fetch("/api/pacientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient)
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const details = result.details?.map((item) => item.message).join(". ");
      throw new Error(details || result.error || "No se pudo guardar la información.");
    }

    form.reset();
    message.classList.add("is-success");
    message.textContent = `Información guardada correctamente. Código: ${result.data.id}`;
  } catch (error) {
    message.classList.add("is-error");
    message.textContent = error.message || "No se pudo conectar con la API.";
  } finally {
    submitButton.disabled = false;
    form.removeAttribute("aria-busy");
  }
});
