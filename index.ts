import express from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { generatrUUID } from "./utils";
import moment from "moment";
import { GeoPosition, MeteorImpact } from "./types";

const PORT = 4963;
const TIME_FORMAT = "DD/MM/yyyy - HH:mm";
const ISRAEL_COORDS: GeoPosition = {
  latitude: 31.5,
  longitude: 34.75
};


const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const impacts: MeteorImpact[] = [];

io.on("connection", (socket) => {
  console.log("a user connected");
  setInterval(() => {
    publishEntityUpdate(socket);
  }, 1000);
});

app.get("/impacts", (req, res) => {
  res.json({ impacts });
});

app.get("/impacts/:id", (req, res) => {
  const impact = impacts.find((p) => p.id === req.params.id);
  res.json(impact);
});

function getRandomLocation(): GeoPosition {
  const latitude = ISRAEL_COORDS.latitude + Math.random();
  const longitude = ISRAEL_COORDS.longitude + Math.random();
  return {latitude, longitude};
}

server.listen(PORT, () => {
  console.log("server listening on port", PORT);
  
  const threatRadius = Math.random() * 100;
  for (let i = 0; i < 50; i++) {
    impacts.push({
      id: generatrUUID(),
      type: `Type-${String(i+1).padStart(3, '0')}`,
      position: getRandomLocation(),
      threatRadius,
      impactTime: moment().add(Math.floor(Math.random()*10), "hours").format(TIME_FORMAT)
    });
  }
});

function publishEntityUpdate(socket: Socket) {
  const randomIndex = Math.floor(Math.random() * impacts.length);
  const randomImpact = impacts[randomIndex];
  const actionType = Math.floor(Math.random() * 3);
  switch (actionType) {
    case 0: // radius update
      const sign = Math.random() > 0.5? 1 : -1
      randomImpact.threatRadius += Math.random() * 100 * sign;
      if (randomImpact.threatRadius <= 0) {
        randomImpact.threatRadius = 10;
      }
      break;
    case 1: // time delay
      const delayByMin = Math.floor(Math.random() * 120);
      randomImpact.impactTime = moment(randomImpact.impactTime, TIME_FORMAT)
        .add(delayByMin, "minutes")
        .format(TIME_FORMAT);
      break;
    case 2: // location update
      randomImpact.position = getRandomLocation();
      break;
  }
  socket.emit("impact-update", randomImpact);
}
