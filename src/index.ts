import { app } from "@app";
import { CLIENT_ORIGIN, PORT } from "@const";
import { connectToDb } from "@db";
import { createServer } from "node:http";
import { Server } from "socket.io";
// WEB SOCKETS
export const server = createServer(app);
export const io = new Server(server, { cors: { origin: CLIENT_ORIGIN } });

io.on("connection", (socket) => {
  console.log("web socket connected", socket.id);
});
server.listen(PORT, async () => {
  await connectToDb();
  console.log(`Listen on: ${PORT}`);
});
