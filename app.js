import express from "express";
import http from "http";
import { mongoConnection } from './utils/mongoConnection.js';

const app = express();
// app.use();
app.use(express.json());

(async () => {
    let bddConnected;
    while (!bddConnected) {
      try {
        await mongoConnection();
        bddConnected = true;
      } catch (err) {
        console.log('BDD CONNECTION ERROR : ', err);
        bddConnected = false;
      }
    }
    const PORT = 3002;
    const server = http.createServer(app);
    server.setTimeout(24 * 3600 * 1000);
    app.listen(PORT, (err) => {
      if (err) console.log(err);
      console.log('Server listening on PORT', PORT);
    });
  })();