const express = require("express");
const http = require("http");
const { mongoConnection } = require('./utils/mongoConnection.js');
const UserRouter = require("./routers/UserRouter.js");
const UserController = require("./controllers/UserController.js");
const cors = require("cors");
const dotenv = require("dotenv");

(async () => {
    dotenv.config()

    const app = express();

    app.use(express.json());
    app.use(cors({
        origin: [process.env.CLIENT_URL],
        credentials: true,
    }))

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

    const userController = new UserController();
    app.use("/user", new UserRouter(userController).router);

    const PORT = process.env.PORT;
    const server = http.createServer(app);
    server.setTimeout(24 * 3600 * 1000);
    app.listen(PORT, (err) => {
        if (err) console.log(err);
        console.log('Server listening on PORT', PORT);
    });
})();