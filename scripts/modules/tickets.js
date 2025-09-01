const BASE_URL = 'http://localhost:3001';

export async function fetchTickets() {
  const res = await fetch(`${BASE_URL}/tickets?_sort=timestamp&_order=asc`);
  if (!res.ok) throw new Error('Error al obtener consultas');
  return res.json();
}

export async function addTicket({ nombreEstudiante, consulta }) {
  const timestamp = new Date().toISOString();
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombreEstudiante, consulta, timestamp })
  });
  if (!res.ok) throw new Error('Error al agregar la consulta');
  return res.json();
}

export async function updateTicket(id, { nombreEstudiante, consulta }) {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombreEstudiante, consulta })
  });
  if (!res.ok) throw new Error('Error al actualizar la consulta');
  return res.json();
}

export async function deleteTicket(id) {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar la consulta');
  return true;
}
