const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(express.static("public"));
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
const jugadores = [];
class Jugador {
  constructor(id) {
    this.id = id;
  }
  asignarMokepon(mokepon) {
    this.mokepon = mokepon;
  }
  actualizarPosicion(x, y) {
    this.x = x;
    this.y = y;
  }
  asignarAtaques(ataques) {
    this.ataques = ataques;
  }
}
class Mokepon {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

app.get("/unirse", (req, res) => {
  const id = `${Math.random()}`;
  const jugador = new Jugador(id);
  jugadores.push(jugador);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(id);
});
app.post("/mokepon/:jugadorId", (req, res) => {
  const { jugadorId } = req.params || "";
  const { mokepon } = req.body || "";
  const newMokepon = new Mokepon(mokepon);

  const jugadorIndex = jugadores.findIndex(
    (jugador) => jugadorId === jugador.id
  );
  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].asignarMokepon(newMokepon);
  }

  res.end();
});
app.post("/mokepon/:jugadorId/posicion", (req, res) => {
  const { jugadorId } = req.params || "";
  const { x, y } = req.body || 0;

  const jugadorIndex = jugadores.findIndex(
    (jugador) => jugadorId === jugador.id
  );
  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].actualizarPosicion(x, y);
  }

  const enemigos = jugadores.filter((jugador) => jugador.id !== jugadorId);

  res.send({ enemigos });
});
app.post("/mokepon/:jugadorId/ataques", (req, res) => {
  const { jugadorId } = req.params || "";
  const { ataques } = req.body || "";

  const jugadorIndex = jugadores.findIndex(
    (jugador) => jugadorId === jugador.id
  );
  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].asignarAtaques(ataques);
  }

  const enemigos = jugadores.filter((jugador) => jugador.id !== jugadorId);

  res.send({ enemigos });
});
app.get("/mokepon/:jugadorId/ataques", (req, res) => {
  const { jugadorId } = req.params || "";
  const jugador = jugadores.find((jugador) => jugador.id === jugadorId);
  res.send({
    ataques: jugador.ataques || [],
  });
});

app.listen(8080, () => {
  console.log("server levantado");
});
