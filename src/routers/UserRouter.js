const express = require('express');
const { authenticate, requestDetails } = require('./../middleware/auth.js');

class UserRouter {
  constructor(userController) {
    this.router = express.Router();

    this.router.route('/')
      // .post(async (req, res) => {
      //   await userController.register(req, res);
      // })
      .get(requestDetails, authenticate, async (req, res) => {
        await userController.find(req, res);
      });

    this.router.route("/login").post(requestDetails, authenticate, async (req, res) => {
      await userController.login(req, res);
    });

    this.router.route("/logout").get(requestDetails, authenticate, async (req, res) => {
      await userController.logout(req, res);
    });

    this.router.route("/register").post(requestDetails, authenticate, async (req, res) => {
      await userController.register(req, res);
    });

    this.router.route("/:id")
      .get(requestDetails, authenticate, async (req, res) => {
        await userController.findOne(req, res);
      })
      .put(requestDetails, authenticate, async (req, res) => {
        await userController.update(req, res);
      })
      .delete (requestDetails, authenticate, async (req, res) => {
        await userController.delete(req, res);
      });
  }
}

module.exports = UserRouter;
