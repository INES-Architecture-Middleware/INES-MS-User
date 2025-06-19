import express from "express";
import http from "http";
import { mongoConnection } from './utils/mongoConnection.js';
import { UserRouter } from "./routes/UserRouter.js";
import UserController from "./controllers/UserController.js";

const app = express();
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

    // app.use("/user", router);
    const userController = new UserController();
    app.use("/user", new UserRouter(userController).router);

    const PORT = 3002;
    const server = http.createServer(app);
    server.setTimeout(24 * 3600 * 1000);
    app.listen(PORT, (err) => {
      if (err) console.log(err);
      console.log('Server listening on PORT', PORT);
    });
  })();