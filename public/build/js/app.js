let paso=1;const pasoInitial=1,pasoFinal=3,cita={id:"",nombre:"",fecha:"",hora:"",servicios:[]};function iniciarApp(){mostrarSeccion(),tabs(),botonesPaginador(),paginaAnterior(),paginaSiguiente(),consultarAPI(),idCliente(),nombreCliente(),seleccionarFecha(),seleccionarHora(),mostrarResumen()}function mostrarSeccion(){const e=document.querySelector(".mostrar");e&&e.classList.remove("mostrar");const t=`#paso-${paso}`;document.querySelector(t).classList.add("mostrar");const o=document.querySelector(".actual");o&&o.classList.remove("actual");document.querySelector(`[data-paso="${paso}"]`).classList.add("actual")}function tabs(){document.querySelectorAll(".tabs button").forEach((e=>{e.addEventListener("click",(function(e){paso=parseInt(e.target.dataset.paso),mostrarSeccion(),botonesPaginador(),3===paso&&mostrarResumen()}))}))}function botonesPaginador(){const e=document.querySelector("#anterior"),t=document.querySelector("#siguiente");1===paso?(e.classList.add("ocultar"),t.classList.remove("ocultar")):3===paso?(e.classList.remove("ocultar"),t.classList.add("ocultar"),mostrarResumen()):(e.classList.remove("ocultar"),t.classList.remove("ocultar")),mostrarSeccion()}function paginaAnterior(){document.querySelector("#anterior").addEventListener("click",(()=>{paso<=1||(paso--,botonesPaginador())}))}function paginaSiguiente(){document.querySelector("#siguiente").addEventListener("click",(()=>{paso>=3||(paso++,botonesPaginador())}))}async function consultarAPI(){try{const e="/api/servicios",t=await fetch(e);mostrarServicios(await t.json())}catch(e){console.log(e)}}function mostrarServicios(e){e.forEach((e=>{const{id:t,nombre:o,precio:n}=e,a=document.createElement("P");a.classList.add("nombre-servicio"),a.textContent=o;const r=document.createElement("P");r.classList.add("precio-servicio"),r.textContent=`$${n}`;const c=document.createElement("DIV");c.classList.add("servicio"),c.dataset.idServicio=t,c.onclick=()=>selecionarServicio(e),c.appendChild(a),c.appendChild(r),document.querySelector("#servicios").appendChild(c)}))}function selecionarServicio(e){const{id:t}=e,{servicios:o}=cita,n=document.querySelector(`[data-id-servicio="${t}"]`);o.some((e=>e.id===t))?(cita.servicios=o.filter((e=>e.id!==t)),n.classList.remove("seleccionado")):(cita.servicios=[...o,e],n.classList.add("seleccionado"))}function idCliente(){cita.id=document.querySelector("#id").value}function nombreCliente(){cita.nombre=document.querySelector("#nombre").value}function seleccionarFecha(){document.querySelector("#fecha").addEventListener("input",(function(e){const t=new Date(e.target.value).getUTCDay();[6,0].includes(t)?(e.target.value="",mostrarAlerta("Fines de semana no Permitimo","error",".formulario")):cita.fecha=e.target.value}))}function seleccionarHora(){document.querySelector("#hora").addEventListener("input",(function(e){const t=e.target.value.split(":")[0];t<10||t>20?(e.target.value=" ",mostrarAlerta("Hora No Válida","error",".formulario")):cita.hora=e.target.value}))}function mostrarAlerta(e,t,o,n=!0){const a=document.querySelector(".alerta");a&&a.remove();const r=document.createElement("Div");r.textContent=e,r.classList.add("alerta"),r.classList.add(t);document.querySelector(o).appendChild(r),n&&setTimeout((()=>{r.remove}),3e3)}function mostrarResumen(){const e=document.querySelector(".contenido-resumen");for(;e.firstChild;)e.removeChild(e.firstChild);if(Object.values(cita).includes("")||0===cita.servicios.length)return void mostrarAlerta("Faltan datos de servicios, Fecha u Hora","error",".contenido-resumen",".contenido-resumen");const{nombre:t,fecha:o,hora:n,servicios:a}=cita,r=document.createElement("H3");r.textContent="Resumen de Servicios",e.appendChild(r),a.forEach((t=>{const{id:o,precio:n,nombre:a}=t,r=document.createElement("DIV");r.classList.add("contenedor-servicio");const c=document.createElement("P");c.textContent=a;const i=document.createElement("P");i.innerHTML=`<span>Precio: </span> $${n}`,r.appendChild(c),r.appendChild(i),e.appendChild(r)}));const c=document.createElement("P");c.innerHTML=`<span>Nombre: </span>${t}`;const i=new Date(o),s=i.getMonth(),d=i.getDate()+2,l=i.getFullYear(),u=new Date(Date.UTC(l,s,d)),m={weekday:"long",year:"numeric",month:"long",day:"numeric".trim()},p=u.toLocaleDateString("es-MX",m),v=document.createElement("P");v.innerHTML=`<span>Fecha: </span>${p}`;const h=document.createElement("P");h.innerHTML=`<span>Fecha: </span>${n}`;const f=document.createElement("BUTTON");f.classList.add("boton"),f.textContent="Reservar Cita",f.onclick=reservarCita;const S=document.createElement("H3");S.textContent="Resumen de Servicios",e.appendChild(S),e.appendChild(c),e.appendChild(v),e.appendChild(h),e.appendChild(f)}async function reservarCita(){const{nombre:e,fecha:t,hora:o,servicios:n,id:a}=cita,r=n.map((e=>e.id));console.log(r);const c=new FormData;c.append("fecha",t),c.append("hora",o),c.append("usuarioId",a),c.append("servicios",r);try{const e=await fetch("/api/citas",{method:"POST",body:c});if(!e.ok)throw new Error(`Error HTTP: ${e.status}`);const t=await e.json();console.log(t.resultado),t.resultado&&Swal.fire({icon:"success",title:"Cita creada con Exito",text:"Something went wrong!",botton:"OK"}).then((()=>{setTimeout((()=>{window.location.reload()}),3e3)}))}catch(e){console.error("Error al reservar la cita",e),Swal.fire({icon:"error",title:"No se pudo crear la cita",text:"Something went wrong!",botton:"OK"}).then((()=>{setTimeout((()=>{window.location.reload()}),3e3)}))}}document.addEventListener("DOMContentLoaded",(function(){iniciarApp()}));