import { fetchTickets, addTicket, updateTicket, deleteTicket } from "../modules/tickets.js";

const formulario = document.getElementById('formConsulta')
const listaConsultas = document.getElementById('listaConsultas')
const enviarBtn = document.getElementById('sendConsulta')
const statsBtn = document.getElementById('statsPagBtn')

let editarId = null

function obtenerFormDatos(){
    const formData = new FormData(formulario)
    return{
        nombreEstudiante: formData.get('nombreEstudiante'),
        consulta: formData.get('consulta')
    }
}


function renderTickets(tickets){
    listaConsultas.innerHTML = ''

    tickets.forEach(ticket => {
        const li = document.createElement('li')
        li.dataset.id = ticket.id

        const nombre = document.createElement('strong')
        nombre.textContent = ticket.nombreEstudiante

        const tiempo = document.createElement('em')
        tiempo.textContent = new Date(ticket.timestamp).toLocaleString()

        const consulta = document.createElement('p')
        consulta.textContent = ticket.consulta

        const editarBtn = document.createElement('button')
        editarBtn.className = "editarBtn"
        editarBtn.textContent = "Editar consulta"


        const eliminarBtn = document.createElement('button')
        eliminarBtn.className = "eliminarBtn"
        eliminarBtn.textContent = "Eliminar consulta"


        li.appendChild(nombre)
        li.appendChild(tiempo)
        li.appendChild(consulta)
        li.appendChild(editarBtn)
        li.appendChild(eliminarBtn)


        listaConsultas.appendChild(li)
        
    });
}



async function cargarAndRender(){
    try{
        const tickets = await fetchTickets()
        renderTickets(tickets)
    } catch(error){
        alert(error.message)
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
})



listaConsultas.addEventListener("click", async event => {
    const li = event.target.closest('li')
    if (!li) return
     const id = li.dataset.id   


     if (event.target.matches('.editarBtn')) {
        document.getElementById('nombreEstudiante').value = li.querySelector('strong').textContent
        document.getElementById('consulta').value = li.querySeelector('p').textContent
        enviarBtn.textContent = "Actualizar consulta"
        editarId = id
     }


     if (event.target.matches('eliminarBtn')){
        if(confirm('¿Estás seguro que quieres eliminar esta consulta?')){
            try{
                await deleteTicket(id)
                await cargarAndRender()
            }catch(error){
                alert(error.message)
            }
        }
     }
})

cargarAndRender()
setInterval(cargarAndRender, 10000)
