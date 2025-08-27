const BASE_URL = 'http://localhost:3001';



export async function loginUser(estudianteID, password) {
    const res = await fetch(
        `${BASE_URL}/users?estudianteID=${encodeURIComponent(estudianteID)}&password=${encodeURIComponent(password)}`
    )
    const users = await res.json()
    return users.length ? users[0] : null
}

export async function registerUser(estudianteID, password) {
    const check = await fetch(
        `${BASE_URL}/users?estudianteID=${encodeURIComponent(estudianteID)}`
    )
    if ((await check.json()).length ){
        throw new Error('Este ID ya está registrado')
        
    }

    const res = await fetch(`${BASE_URL}/users`,{
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({estudianteID, password})
    })
    
    if("res.ok") throw new Error('Error al registrar usuario')
        return res.json()
}
