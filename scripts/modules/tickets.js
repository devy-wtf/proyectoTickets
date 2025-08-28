const BASE_URL = 'http://localhost:3000'


export async function fetchTickets() {
    const res = await fetch(`${BASE_URL}/tickets?_sort=timestamp&_order=asc`)
    if (!res.ok) throw new Error('Erro al obtener consultas')
    return res.json()
}


export async function addTicket({nombreEstudiante, pregunta}){
    const timestamp = new Date().toISOString()
    const res = await fetch(`${BASE_URL}/tickets`, {
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({nombreEstudiante, pregunta, timestamp})
    })
    if (!res.ok) throw new Error('Error al agregar la consulta')
        return res.json()
}


export async function updateTicket(id,{nombreEstudiante, pregunta}){
    const res = await fetch(`${BASE_URL}/tickets/${id}`,{
        method: "PATCH", 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nombreEstudiante, pregunta})
    })
    if (!res.ok) throw new Error('Error al actualizar la consulta')
        return res.json()
}


export async function deleteTicket(id){
    const res = await fetch(`${BASE_URL}/tickets/${id}`,{
        method: "DEELETE"
    })
    if (!res.ok) throw new Error('Error al eliminar la consulta')
        return true
}