import express from 'express';

class UserRouter {
  router;

  constructor(userController) {
    this.router = express.Router();

    this.router.route('/').post(async (req, res) => {
      await userController.create(req, res);
    });

    this.router.route("/login").post(async (req, res) => {
      await userController.login(req, res);
    });

    this.router.route("/logout").get(async (req, res) => {
      await userController.logout(req, res);
    });

    this.router
      .route("/user/:id")
      .get(async (req, res) => {
        await userController.findOne(req, res);
      })
      .put(async (req, res) => {
        await userController.update(req, res);
      })
      .delete (async (req, res) => {
        await userController.delete(req, res);
      });
  }
}

export { UserRouter };
