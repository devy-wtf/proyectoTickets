import {
  fetchTickets,
  addTicket,
  updateTicket,
  deleteTicket
} from "../modules/tickets.js";

const formulario     = document.getElementById("formConsulta");
const listaConsultas = document.getElementById("listaConsultas");
const enviarBtn      = document.getElementById("sendConsulta");
const statsBtn       = document.getElementById("toggleStats");
const statsSidebar   = document.getElementById("statsSidebar");
const statsContainer = document.getElementById("statsContainer");

let editarId   = null;
let allTickets = [];

function obtenerFormDatos() {
  const formData = new FormData(formulario);
  return {
    nombreEstudiante: formData.get("nombreEstudiante").trim(),
    consulta:         formData.get("consulta").trim()
  };
}

function renderTickets(tickets) {
  listaConsultas.innerHTML = "";
  tickets.forEach(ticket => {
    const li = document.createElement("li");
    li.dataset.id = ticket.id;
    li.innerHTML = `
      <strong>${ticket.nombreEstudiante}</strong>
      <em>${new Date(ticket.timestamp).toLocaleString()}</em>
      <p>${ticket.consulta}</p>
      <button class="editarBtn">Editar consulta</button>
      <button class="eliminarBtn">Eliminar consulta</button>
    `;
    listaConsultas.appendChild(li);
  });
}

function groupByDate(tickets) {
  return tickets.reduce((acc, t) => {
    const day = t.timestamp.slice(0, 10);
    acc[day] = acc[day] || [];
    acc[day].push(t);
    return acc;
  }, {});
}

function renderStats(tickets) {
  const grouped = groupByDate(tickets);
  const days = Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 3);

  statsContainer.innerHTML = "";

  if (days.length === 0) {
    statsContainer.innerHTML = `<p class="warning">No hay datos de consultas.</p>`;
    return;
  }

  days.forEach(day => {
    const section = document.createElement("div");
    section.className = "daySection";

    const header = document.createElement("h2");
    header.textContent = new Date(day).toLocaleDateString();
    section.appendChild(header);

    const ul = document.createElement("ul");
    grouped[day].forEach(ticket => {
      const item = document.createElement("li");
      item.innerHTML = `
        <strong>${ticket.nombreEstudiante}</strong>
        <em>${new Date(ticket.timestamp).toLocaleTimeString()}</em>
        <p>${ticket.consulta}</p>
      `;
      ul.appendChild(item);
    });
    section.appendChild(ul);
    statsContainer.appendChild(section);
  });

  if (days.length < 3) {
    const note = document.createElement("p");
    note.className = "warning";
    note.textContent = "Menos de 3 días de historial";
    statsContainer.appendChild(note);
  }
}

async function cargarAndRender() {
  try {
    allTickets = await fetchTickets();
    renderTickets(allTickets);
    renderStats(allTickets);
  } catch (error) {
    alert(error.message);
  }
}

formulario.addEventListener("submit", async e => {
  e.preventDefault();
  enviarBtn.disabled = true;
  const data = obtenerFormDatos();

  try {
    if (editarId) {
      await updateTicket(editarId, data);
      editarId = null;
      enviarBtn.textContent = "Enviar consulta";
    } else {
      await addTicket(data);
    }
    formulario.reset();
    await cargarAndRender();
  } catch (err) {
    alert(err.message);
  } finally {
    enviarBtn.disabled = false;
  }
});

listaConsultas.addEventListener("click", async e => {
  const li = e.target.closest("li");
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.matches(".editarBtn")) {
    document.getElementById("nombreEstudiante").value =
      li.querySelector("strong").textContent;
    document.getElementById("consulta").value =
      li.querySelector("p").textContent;
    enviarBtn.textContent = "Actualizar consulta";
    editarId = id;
  }

  if (e.target.matches(".eliminarBtn")) {
    if (confirm("¿Estás seguro que quieres eliminar esta consulta?")) {
      try {
        await deleteTicket(id);
        await cargarAndRender();
      } catch (err) {
        alert(err.message);
      }
    }
  }
});

statsBtn.addEventListener("click", () => {
  statsSidebar.classList.toggle("collapsed");
});

cargarAndRender();
setInterval(cargarAndRender, 10000);