let paso = 1;
const pasoInitial = 1;
const pasoFinal = 3;

const cita = {
    id:'',
    nombre: '',
    fecha: '',
    hora: '',
    servicios:[]
}

document.addEventListener("DOMContentLoaded", function(){
iniciarApp();
});

function iniciarApp(){
    mostrarSeccion(); //Muestra y oculta las secciones 
    tabs(); // Cambia la seccion cuando se presionesn los tabs
    botonesPaginador(); // agrega o quita los botones del paginador 
    paginaAnterior();
    paginaSiguiente();

    consultarAPI(); // Consulta la API en el backend de PHP
    idCliente();
    nombreCliente(); // Añade el nombre del cliente al objeto de cita 
    seleccionarFecha(); // añade la fecha de la cita en el objeto

    seleccionarHora(); // Añade la hora de la cita en el objetop

    mostrarResumen(); // Muestra el resumen de la cita 

}

function mostrarSeccion(){
    // Ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar');
    }
    

    // seleccionar la seccion  con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Quitar la clase actual a tab anterior
    const tabAnterior = document.querySelector('.actual')
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`)
    tab.classList.add('actual');
}


function tabs(){
    const botones = document.querySelectorAll('.tabs button');
    
    botones.forEach(boton => {
        boton.addEventListener('click', function(e){
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();

            botonesPaginador();
            if(paso === 3){
                mostrarResumen();
            }
        })
    })
}

function botonesPaginador(){
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1){
        paginaAnterior.classList.add('ocultar')
        paginaSiguiente.classList.remove('ocultar')
    }else if(paso === 3){
        paginaAnterior.classList.remove('ocultar')
        paginaSiguiente.classList.add('ocultar')
        mostrarResumen();
        
    }else{
        paginaAnterior.classList.remove('ocultar')
        paginaSiguiente.classList.remove('ocultar')
    }
    mostrarSeccion();
}
function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', ()=>{
        if(paso <= pasoInitial) return;
        paso--;
        botonesPaginador();
    })
    
}
function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', ()=>{
        if(paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    })
}

async function consultarAPI(){

    try {
        // const url = `${locatio.origin}/api/servicios`; // BAKEND EN DIFERENTES DOMINIOS
        const url = `/api/servicios`; // BACKEND EN EL MISMO DOMINIO
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios){
    servicios.forEach(servicio=>{
        const{id, nombre, precio} = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;

        servicioDiv.onclick = () => selecionarServicio(servicio);

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    })
}
function selecionarServicio(servicio){
    const {id} = servicio;
    const {servicios} = cita;
    // Identificar el elemento que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // comprobar si un servicio ya fue agragado 
    if(servicios.some( agregado => agregado.id === id )){ 
        // Eliminar
        cita.servicios = servicios.filter(agregado => agregado.id !== id)
        divServicio.classList.remove('seleccionado');
    }else {
        cita.servicios = [ ...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
    
}

function idCliente() {
    cita.id = document.querySelector('#id').value
}

function nombreCliente(){
    cita.nombre = document.querySelector('#nombre').value;

}
function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e){
        const dia = new Date(e.target.value).getUTCDay();

        if([6,0].includes(dia)){
            e.target.value = '';
            mostrarAlerta('Fines de semana no Permitimo', 'error', '.formulario')
        }else {
            cita.fecha = e.target.value;
        }
    })
}

function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if( hora < 10 || hora > 20){
            e.target.value = " ";
            mostrarAlerta('Hora No Válida', 'error', '.formulario')
        }else {
            cita.hora = e.target.value;
        }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true ){
    const alertaPrevia = document.querySelector('.alerta')

    //Previene que se generen mas de 1 aleta 

    if(alertaPrevia){
        alertaPrevia.remove();
    };
    const alerta = document. createElement('Div');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece){
        // Eliminar alerta
        setTimeout(() =>{
            alerta.remove;
        }, 3000)
    }
    
}

function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');

    // limpiar el contenido de de resumen
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0 ){
        mostrarAlerta('Faltan datos de servicios, Fecha u Hora','error', '.contenido-resumen', '.contenido-resumen')
        return;
    }

    // Formatear el div de resumen
    const { nombre, fecha, hora , servicios } = cita;

    // Heading para servicios y resumen
    const headindServicios = document.createElement('H3')
    headindServicios.textContent = 'Resumen de Servicios'
    resumen.appendChild(headindServicios)

    // Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre} = servicio
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio')

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio: </span> $${precio}`

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio)

    })
    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre: </span>${nombre}`;

    // Formatear la fecha en Español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year, mes, dia))
    const opciones = { weekday:'long', year: 'numeric', month:'long', day: 'numeric'.trim()}
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span>${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Fecha: </span>${hora}`;

    // Boton para Crear una cita 
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    
    // Heading para Datos de la cita 
    const headindCita = document.createElement('H3')
    headindCita.textContent = 'Resumen de Servicios'
    resumen.appendChild(headindCita)

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);

}
async function reservarCita(){
    const {nombre, fecha, hora, servicios, id} = cita;

    const idServicios = servicios.map(servicio => servicio.id)
    console.log(idServicios)
    
    const datos = new FormData();
    datos.append('fecha', fecha); 
    datos.append('hora', hora);
    datos.append('usuarioId', id); 
    datos.append('servicios', idServicios);

    //  Peticion hacia la api
    const url = '/api/citas'
    try {
        const respuesta = await fetch(url,{
            method: 'POST',
            body: datos // Enviamos los datos
        } );
        if(!respuesta.ok){
            throw new Error(`Error HTTP: ${ respuesta.status}`)
        }
        const resultado = await respuesta.json();
        console.log(resultado.resultado);
        if(resultado.resultado){
            Swal.fire({
                icon: "success",
                title: "Cita creada con Exito",
                text: "Something went wrong!",
                // footer: '<a href="#">Why do I have this issue?</a>'
                botton: 'OK'
            }).then(() => {
                setTimeout(()=>{
                    window.location.reload();

                }, 3000)
            })
        }
        
    }
    catch(error){
        console.error('Error al reservar la cita', error);
        Swal.fire({
            icon: "error",
            title: "No se pudo crear la cita",
            text: "Something went wrong!",
            botton: 'OK'
        }).then(() => {
                setTimeout(()=>{
                    window.location.reload();

                }, 3000)
            })
    }
    
}

