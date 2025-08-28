import { loginUser, registerUser } from "../modules/app.js";

const formulario = document.getElementById('loginForm')
const loginBtn = document.getElementById('loginBtn')
const regisBtn = document.getElementById('regisBtn')
const aviso = document.getElementById('aviso')


function getFormDatos() {
    const formDatos = new FormData(formulario)
    return{
        estudianteID: formDatos.get('estudianteID').trim(),
        password: formDatos.get('password').trim()  
    }
}

loginBtn.addEventListener("click", async() => {
    aviso.textContent = ''
    const {estudianteID, password} =getFormDatos()

    try{
        const user = await loginUser(estudianteID, password)
        if(user){
            aviso.textContent= `¡Bienvenido, ${estudianteID}!`
            window.location.href = '../../pages/index.html'
        }else{
            aviso.textContent = "Los datos son incorrectos."
        }
    } catch(error){
        aviso.textContent = `Error: ${Error.message}`
    } 
})

regisBtn.addEventListener("click", async() => {
    aviso.textContent = ''
    const{estudianteID, password} = getFormDatos()


    try{
        const newUser = await registerUser (estudianteID, password)
        if(newUser){
            aviso.textContent = `¡Usuario ${newUser.estudianteID} registrado! Ya puedes iniciar sesión.`
        }
        } catch(Error){
            aviso.textContent = 'Error: No se ha podido registrar el usuario.'
        } finally{
            formulario.reset();
        }
    }
    
) 
 