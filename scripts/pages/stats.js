import { fetchTickets } from "../modules/tickets";

const buscarInput = document.getElementById('buscarInput')
const statsCont = document.getElementById('statsCont')


let allTickets = []

async function init() {
    try{
    allTickets = await fetchTickets()
    renderStats(allTickets)
}catch (error) {
    showError(statsCont, error.message)
    }
}

function showError(container, message){
    container.innerHTML = ""
    const p = document.createElement('p')
    p.classList.add('error')
    p.textConteent = `Error: ${message}`

    container.appendChild(p)
}


function agruparPorFecha(tickets) {
    return tickets.reduce((acc, t) =>{
        const dia = t.tiemestamp.slice(0,10)
        acc[dia] = acc[dia] || []
        acc[dia].push(t)
        return acc
    }, {})


    
}
