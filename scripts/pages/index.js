import {
  fetchTickets,
  addTicket,
  updateTicket,
  deleteTicket
} from "../modules/tickets.js";

const formulario     = document.getElementById('formConsulta');
const listaConsultas = document.getElementById('listaConsultas');
const enviarBtn      = document.getElementById('sendConsulta');
const statsBtn       = document.getElementById('toggleStats');

const statsContainer = document.getElementById('statsContainer');

let editarId   = null;
let allTickets = [];


function obtenerFormDatos(){
  const formData = new FormData(formulario);
  return {
    nombreEstudiante: formData.get('nombreEstudiante'),
    consulta:         formData.get('consulta')
  };
}


function renderTickets(tickets){
  listaConsultas.innerHTML = '';

  tickets.forEach(ticket => {
    const li = document.createElement('li');
    li.dataset.id = ticket.id;

    const nombre = document.createElement('strong');
    nombre.textContent = ticket.nombreEstudiante;

    const tiempo = document.createElement('em');
    tiempo.textContent = new Date(ticket.timestamp).toLocaleString();

    const consulta = document.createElement('p');
    consulta.textContent = ticket.consulta;

    const editarBtn = document.createElement('button');
    editarBtn.className = "editarBtn";
    editarBtn.textContent = "Editar consulta";

    const eliminarBtn = document.createElement('button');
    eliminarBtn.className = "eliminarBtn";
    eliminarBtn.textContent = "Eliminar consulta";

    li.append(nombre, tiempo, consulta, editarBtn, eliminarBtn);
    listaConsultas.appendChild(li);
  });
}


// Agrupa los tickets por fecha (YYYY-MM-DD)
function groupByDate(tickets) {
  return tickets.reduce((acc, t) => {
    const day = t.timestamp.slice(0, 10);
    acc[day] = acc[day] || [];
    acc[day].push(t);
    return acc;
  }, {});
}

// Renderiza en statsContainer los últimos 3 días de historial
function renderStats(tickets) {
  const grouped = groupByDate(tickets);
  const days = Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 3);

  statsContainer.innerHTML = '';

  days.forEach(day => {
    const section = document.createElement('div');
    section.className = 'daySection';

    const h2 = document.createElement('h2');
    h2.textContent = new Date(day).toLocaleDateString();
    section.appendChild(h2);

    const ul = document.createElement('ul');
    grouped[day].forEach(t => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${t.nombreEstudiante}</strong>
        <em>${new Date(t.timestamp).toLocaleTimeString()}</em>
        <p>${t.consulta}</p>
      `;
      ul.appendChild(li);
    });
    section.appendChild(ul);

    statsContainer.appendChild(section);
  });

  if (days.length < 3) {
    const note = document.createElement('p');
    note.className = 'warning';
    note.textContent = 'Menos de 3 días de historial';
    statsContainer.appendChild(note);
  }
}


// Carga tickets, renderiza lista y estadísticas
async function cargarAndRender(){
  try {
    allTickets = await fetchTickets();
    renderTickets(allTickets);
    renderStats(allTickets);
  } catch(error) {
    alert(error.message);
  }
}


formulario.addEventListener('submit', async e => {
  e.preventDefault();
  enviarBtn.disabled = true;
  const data = obtenerFormDatos();

  try {
    if (editarId) {
      await updateTicket(editarId, data);
      editarId = null;
      enviarBtn.textContent = 'Enviar consulta';
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


listaConsultas.addEventListener("click", async event => {
  const li = event.target.closest('li');
  if (!li) return;
  const id = li.dataset.id;

  if (event.target.matches('.editarBtn')) {
    document.getElementById('nombreEstudiante').value =
      li.querySelector('strong').textContent;
    document.getElementById('consulta').value =
      li.querySelector('p').textContent;
    enviarBtn.textContent = "Actualizar consulta";
    editarId = id;
  }

  if (event.target.matches('.eliminarBtn')) {
    if (confirm('¿Estás seguro que quieres eliminar esta consulta?')) {
      try {
        await deleteTicket(id);
        await cargarAndRender();
      } catch (error) {
        alert(error.message);
      }
    }
  }
});


statsBtn.addEventListener('click', () => {
  statsContainer.classList.toggle('hidden');
});


cargarAndRender();
setInterval(cargarAndRender, 10000);

