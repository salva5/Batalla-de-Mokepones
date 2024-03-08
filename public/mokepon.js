

const botonSeleccionar = document.getElementById("botonSeleccionar");
const sectionSeleccionarAtaque = document.getElementById("seleccionarAtaque");
const sectionReiniciar = document.getElementById("reiniciar");
const botonReiniciar = document.getElementById("botonReiniciar");

const sectionSeleccionarMascota = document.getElementById("seleccionarMascota");
const spanMascotaJugador = document.getElementById("mascotaJugador");

const spanMascotaEnemigo = document.getElementById("mascotaEnemigo");

const spanVictoriasJugador = document.getElementById("victorias-jugador");
const spanVictoriasEnemigo = document.getElementById("victorias-enemigo");

const parrafoResultado = document.getElementById("resultado");
const ataqueDelJugador = document.getElementById("ataqueJugador");
const ataqueDelEnemigo = document.getElementById("ataqueEnemigo");
const contenedorTarjetas = document.getElementById("contenedor-tarjetas")
const contenedorAtaques = document.getElementById("contenedor-ataques")

const sectionVerMapa = document.getElementById("ver-mapa")
const mapa = document.getElementById("mapa")

let enemigoId
let jugadorId
let mokepones = []
let mokeponesEnemigos = []
let opcionDeMokepones;
let inputHipodoge; 
let inputCapipepo;
let inputRatigueya;
let mokeponElegido
let mascotaJugador
let botonFuego 
let botonAgua 
let botonTierra 
let botones = [];
let indexAtaqueEnemigo
let indexAtaqueJugador
let ataqueJugador = []
let ataqueEnemigo = []
let ataquesMokeponEnemigo 
let victoriasJugador = 0
let victoriasEnemigo = 0
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = "./assets/mokemap.png"

let heightMapa
let widthMapa = window.innerWidth - 20
const widthMaxMapa = 400

if(widthMapa > widthMaxMapa) {
  widthMapa = widthMaxMapa - 20
}
heightMapa = widthMapa * (600 / 800 )
mapa.width = widthMapa
mapa.height = heightMapa

class Mokepon {
  constructor(nombre, imagen, vida,mokeponMapa, id) {
    this.id = id
    this.nombre = nombre,
    this.imagen = imagen,
    this.vida = vida
    this.ataques = []
    this.width = 40
    this.height = 40
    this.x = aleatorio(0, mapa.width - this.width)
    this.y = aleatorio(0, mapa.height - this.height)
    this.mapaImagen = new Image()
    this.mapaImagen.src = mokeponMapa
    this.velocidadX = 0
    this.velocidadY = 0
  }
  pintarMokepon() {
    lienzo.drawImage(
      this.mapaImagen, 
      this.x, 
      this.y, 
      this.width, 
      this.height
    )
  }
}

let capipepo = new Mokepon("Capipepo", "assets/mokepons_mokepon_capipepo_attack.png", 5, "assets/capipepo.png")
let hipodoge = new Mokepon("Hipodoge", "assets/mokepons_mokepon_hipodoge_attack.png", 5, "assets/hipodoge.png")
let ratigueya = new Mokepon("Ratigueya", "assets/mokepons_mokepon_ratigueya_attack.png", 5, "assets/ratigueya.png")

capipepoAtaques = [
  {nombre: "Tierra", id: "boton-tierra"},
  {nombre: "Tierra", id: "boton-tierra"},
  {nombre: "Tierra", id: "boton-tierra"},
  {nombre: "Agua", id: "boton-agua"},
  {nombre: "Fuego", id: "boton-fuego"}
]
ratigueyaAtaques = [
  {nombre: "Fuego", id: "boton-fuego"},
  {nombre: "Fuego", id: "boton-fuego"},
  {nombre: "Fuego", id: "boton-fuego"},
  {nombre: "Agua", id: "boton-agua"},
  {nombre: "Tierra", id: "boton-tierra"},
]
hipodogeAtaques = [
  {nombre: "Agua", id: "boton-agua"},
  {nombre: "Agua", id: "boton-agua"},
  {nombre: "Agua", id: "boton-agua"},
  {nombre: "Tierra", id: "boton-tierra"},
  {nombre: "Fuego", id: "boton-fuego"}
]
capipepo.ataques.push(...capipepoAtaques)
hipodoge.ataques.push(...hipodogeAtaques)
ratigueya.ataques.push(...ratigueyaAtaques)

mokepones.push(capipepo,hipodoge,ratigueya)


function iniciarJuego() {
  sectionSeleccionarAtaque.style.display = "none";
  sectionReiniciar.style.display = "none";
  sectionVerMapa.style.display = "none"

  mokepones.forEach(mokepon => {
    opcionDeMokepones =
    `<input type="radio" name="mascota" id=${mokepon.nombre}>
    <label class="tarjetaDeMokepon"for=${mokepon.nombre}>
      <p>${mokepon.nombre}</p>
      <img src=${mokepon.imagen} alt=${mokepon.nombre}> 
    </label>`
    
    contenedorTarjetas.innerHTML += opcionDeMokepones
  })
  inputHipodoge = document.getElementById("Hipodoge");
  inputCapipepo = document.getElementById("Capipepo");
  inputRatigueya = document.getElementById("Ratigueya");

  botonSeleccionar.addEventListener("click", seleccionarMascotaJugador);

  botonReiniciar.addEventListener("click", reiniciarJuego);
  unirseAlJuego()
}
function unirseAlJuego() {
  fetch("http://localhost:8080/unirse")
  .then(response => response.json())
  .then(response => jugadorId = response)
}

function seleccionarMascotaJugador() {
  if (inputHipodoge.checked) {
    mokeponElegido = hipodoge
    mostrarMascotaJugador(inputHipodoge.id)
  } else if (inputCapipepo.checked) {
    mokeponElegido = capipepo
    mostrarMascotaJugador(inputCapipepo.id)
  } else if (inputRatigueya.checked) {
    mokeponElegido = ratigueya
    mostrarMascotaJugador(inputRatigueya.id)
  } else {
    alert("elige una mascota");
  }
}
function mostrarMascotaJugador(mombreMascota) {

  mascotaJugador = mombreMascota
  spanMascotaJugador.innerHTML = mombreMascota
  
  sectionSeleccionarMascota.style.display = "none";
  sectionVerMapa.style.display = "flex"
  enviarMokepon(mascotaJugador)
  iniciarMapa()
  extraerAtaquesJugador(mascotaJugador)
  
}
function enviarMokepon(mascotaJugador) {
  fetch(`http://localhost:8080/mokepon/${jugadorId}`,{
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mokepon: mascotaJugador
    })
  })
}
function iniciarMapa() {
  intervalo = setInterval(pintarCanvas, 50)
  window.addEventListener("keydown", sePresionoUnaTecla)
  window.addEventListener("keyup", detenerMovimiento)
}
function pintarCanvas () {
  mokeponElegido.x = mokeponElegido.x + mokeponElegido.velocidadX
  mokeponElegido.y = mokeponElegido.y + mokeponElegido.velocidadY

  lienzo.clearRect(0,0, mapa.width, mapa.height)
  lienzo.drawImage(
    mapaBackground,
    0,
    0,
    mapa.width,
    mapa.height
  )
  mokeponElegido.pintarMokepon()
  mokeponesEnemigos.forEach(mokepon => {
    mokepon.pintarMokepon()
    revisarColision(mokepon)

  })
  enviarPosicion(mokeponElegido.x,mokeponElegido.y)
  
}
function seleccionarMascotaEnemigo(enemigo) {
  spanMascotaEnemigo.innerHTML = enemigo.nombre
  ataquesMokeponEnemigo = enemigo.ataques
  secuenciaAtaque()
}
function enviarPosicion(x, y) {
  fetch(`http://localhost:8080/mokepon/${jugadorId}/posicion`,{
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      x,
      y
    })
  })
  .then(response => {
    if (response.ok) {
      return response.json()
    }
  })
  .then(({enemigos}) =>  {
    let mokeponEnemigo 
    mokeponesEnemigos = enemigos.map(enemigo => {
      
      if(enemigo.mokepon.nombre === "Hipodoge") {
        mokeponEnemigo = new Mokepon("Hipodoge", "assets/mokepons_mokepon_hipodoge_attack.png", 5, "assets/hipodoge.png", enemigo.id)
      }  
      if(enemigo.mokepon.nombre === "Capipepo") {
        mokeponEnemigo = new Mokepon("Capipepo", "assets/mokepons_mokepon_capipepo_attack.png", 5, "assets/capipepo.png", enemigo.id)
      }
      if(enemigo.mokepon.nombre === "Ratigueya") {
        mokeponEnemigo = new Mokepon("Ratigueya", "assets/mokepons_mokepon_ratigueya_attack.png", 5, "assets/ratigueya.png", enemigo.id)
      }
      mokeponEnemigo.x = enemigo.x
      mokeponEnemigo.y = enemigo.y
      return mokeponEnemigo
    })
  })
}
function sePresionoUnaTecla (event) {
  switch (event.key) {
    case "ArrowUp":
      moverArriba()
      break;
    case "ArrowDown":
      moverAbajo()
      break
    case "ArrowLeft":
      moverIzquierda()
      break
    case "ArrowRight":
      moverDerecha()
      break
    default:
      break;
  }
}
function moverArriba(){
  mokeponElegido.velocidadY = - 5
}
function moverAbajo(){
  mokeponElegido.velocidadY = 5
}
function moverIzquierda() {
  mokeponElegido.velocidadX = - 5

}
function moverDerecha() {
  mokeponElegido.velocidadX = 5
  
}
function detenerMovimiento() {
  mokeponElegido.velocidadX = 0
  mokeponElegido.velocidadY = 0
}
function revisarColision (enemigo){
  const arribaEnemigo = enemigo.y
  const abajoEnemigo = enemigo.y + enemigo.height
  const derechaEnemigo = enemigo.x + enemigo.width
  const izquierdaEnemigo = enemigo.x 

  const arribaMascota = mokeponElegido.y
  const abajoMascota = mokeponElegido.y + mokeponElegido.height
  const derechaMascota = mokeponElegido.x + mokeponElegido.width
  const izquierdaMascota = mokeponElegido.x 
  if (
    abajoMascota < arribaEnemigo ||
    arribaMascota > abajoEnemigo ||
    derechaMascota < izquierdaEnemigo ||
    izquierdaMascota > derechaEnemigo
  ) {
    return
  }
  detenerMovimiento()
  clearInterval(intervalo)
  enemigoId = enemigo.id
  sectionSeleccionarAtaque.style.display = "flex"; 
  sectionVerMapa.style.display = "none"; 
  seleccionarMascotaEnemigo(enemigo);
}
function mostrarAtaques(ataques) {
  ataques.forEach(ataque => {
    let botonAtaque = ` <button id=${ataque.id} class="botones bAtaque">${ataque.nombre}</button>`
    contenedorAtaques.innerHTML += botonAtaque

  })
  botonFuego = document.getElementById("boton-fuego");
  botonAgua = document.getElementById("boton-agua");
  botonTierra = document.getElementById("boton-tierra");
  botones = document.querySelectorAll(".bAtaque")
  
}
function secuenciaAtaque () {
  
  botones.forEach(boton => {
    boton.addEventListener("click", (e) => {
      if(e.target.textContent === "Tierra"){
        ataqueJugador.push(e.target.textContent)
        boton.style.background = "#112f58"
        boton.disabled = true
      } 
      if(e.target.textContent === "Fuego") {
        ataqueJugador.push(e.target.textContent)
        boton.style.background = "#112f58"
        boton.disabled = true
      }
      if(e.target.textContent === "Agua") {
        ataqueJugador.push(e.target.textContent)
        boton.style.background = "#112f58"
        boton.disabled = true
      }
      if(ataqueJugador.length === 5) enviarAtaques()
    })
  })
}
function enviarAtaques () {
  fetch(`http://localhost:8080/mokepon/${jugadorId}/ataques`, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ataques: ataqueJugador
    })
  })
  intervalo = setInterval(obtenerAtaques, 50)
}
function obtenerAtaques() {
  fetch(`http://localhost:8080/mokepon/${enemigoId}/ataques`)
  .then(res => {
    if (res.ok) {
      return res.json()
    }
  })
  .then(({ataques}) => {
    if (ataques.length === 5) {
      ataqueEnemigo = ataques
      combate()
    }
  })
}
function extraerAtaquesJugador(mascotaJugador) {
  let ataques
  mokepones.forEach(mokepon => {
    if(mokepon.nombre === mascotaJugador) ataques = mokepon.ataques
    
  })
  mostrarAtaques(ataques)
}
function combate() {
  clearInterval(intervalo)

  for (let i = 0; i < ataqueJugador.length; i++) {
    if(ataqueJugador[i] === ataqueEnemigo[i]) {
      indexAmbosOponentes(i, i)
      crearMensaje("Empate")
    }
    else if( (ataqueJugador[i] === "Fuego" && ataqueEnemigo[i] === "Tierra") ||
      (ataqueJugador[i] === "Agua" && ataqueEnemigo[i] === "Fuego") ||
      (ataqueJugador[i] === "Tierra" && ataqueEnemigo[i] === "Agua")
    ) {
      indexAmbosOponentes(i, i)
      crearMensaje("Ganaste😎")
      victoriasJugador++
      spanVictoriasJugador.innerHTML = victoriasJugador;
    }
    else {
      indexAmbosOponentes(i,i)
      crearMensaje("Perdiste😞");
      victoriasEnemigo++
      spanVictoriasEnemigo.innerHTML = victoriasEnemigo;
    }
  }
  revisarVictorias();
}
function indexAmbosOponentes(jugador, enemigo) {
  indexAtaqueJugador = ataqueJugador[jugador]
  indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}
function crearMensaje(mensaje) {
  parrafoJugador = document.createElement("p");
  ParrafoEnemigo = document.createElement("p");

  parrafoResultado.innerHTML = mensaje;
  parrafoJugador.innerHTML = indexAtaqueJugador;
  ParrafoEnemigo.innerHTML = indexAtaqueEnemigo;

  ataqueDelJugador.appendChild(parrafoJugador);
  ataqueDelEnemigo.appendChild(ParrafoEnemigo);
}
function revisarVictorias() {
  if (victoriasJugador === victoriasEnemigo) {
    crearMensajeFinal("Empate");
  } else if (victoriasJugador > victoriasEnemigo) {
    crearMensajeFinal("Bien hecho crack, Ganaste");
  } else {
    crearMensajeFinal("Game Over")
  }
}
function crearMensajeFinal(mensajeFinal) {
  sectionReiniciar.style.display = "block";
  parrafoResultado.innerHTML = mensajeFinal;

  botonFuego.disabled = true;
  botonAgua.disabled = true;
  botonTierra.disabled = true;
}

function reiniciarJuego() {
  location.reload();
}
function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


window.addEventListener("load", iniciarJuego);
