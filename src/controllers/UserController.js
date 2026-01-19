const User = require("../models/User.js");
const UserService = require("../services/UserService.js");
const functionsMongo = require("../utils/functionsMongo.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  generateToken(userId, isAdmin, passwordChangedDate, cb) {
    const payload = {
      id: userId.toString(),
      iat: Date.now(),
      isAdmin: isAdmin || false,
      passwordChangedDate : new Date(passwordChangedDate).getTime()
    };
    jwt.sign(payload, process.env.JWT_SECRET, cb);
  }

  async login(req, res) {
    if (!req.body.username || !req.body.password) {
      res.sendStatus(500);
      return;
    }

    const username = req.body.username.trim();
    const password = req.body.password.trim();

    functionsMongo
      .findOne(User, { username: username })
      .then((user) => {
        if (!user) {
          res.sendStatus(500);
          return;
        }

        bcrypt.compare(password, user.password, (err, match) => {
          if (err) {
            res.sendStatus(500);
            return;
          }

          if (!match) {
            res.sendStatus(401);
            return;
          }

          this.generateToken(user._id, user.isAdmin, user.passwordChangedDate, async (err, token) => {
            if (err) {
              res.sendStatus(500);
              return;
            }

            res.json({ token, user });
          });
        });
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
        return;
      });
  }

  async register(req, res) {
    if (
      !req.body ||
      !req.body.username ||
      !req.body.password ||
      !req.body.confirmPassword ||
      !req.body.registerToken
    ) {
      res.sendStatus(500);
      return;
    }

    if (req.body.password !== req.body.confirmPassword) {
      res.sendStatus(403);
      return;
    }

    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const registerToken = req.body.registerToken.trim();

    functionsMongo
      .find(User, { username: username })
      .then((isUserExist) => {
        if (isUserExist && isUserExist.length > 0) {
          res.json({ status: 401, error: "username-already-exist" });
          return;
        }

        functionsMongo
          .findOne(User, {registerToken : registerToken})
          .then((user) => {
            if(!user){
              console.log("Erreur : Le token \"" + registerToken + "\" n'est attribué à aucun utilisateur !")
              res.sendStatus(500)
              return
            }

            bcrypt.hash(password, 10, async (err, hash) => {
              if (err) {
                console.log("Hash error", err)
                res.sendStatus(500);
                return;
              }
               
              const newUser = await functionsMongo.update(User, user._id, {
                username: username,
                password: hash,
                registerToken: null,
                verificationDate:new Date(),
                passwordChangedDate:new Date(),
                isAdmin:false
              });

              this.generateToken(newUser._id, newUser.isAdmin, newUser.passwordChangedDate, async (err, token) => {
                if (err) {
                  console.log("Token error : ", err)
                  res.sendStatus(500);
                  return;
                }

                res.json({ token: token, user: newUser });
              });
            });
          }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
            return;
          });
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
        return;
      });
  }

  async update(req, res) {
    if (!req.body._id) {
      res.sendStatus(500);
      return;
    }

    let username;
    if (req.body.username) username = req.body.username.trim();

    functionsMongo
      .findOne(User, { _id: req.body._id })
      .then((user) => {
        functionsMongo
          .update(User, user._id, {
            username: username,
          })
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
            res.sendStatus(500);
            return;
          });
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
        return;
      });
  }

  async logout(req, res) {
    // Implement logout logic if needed (e.g., invalidate token)
    res.status(200).send("User logged out successfully");
  }

  async getUserById(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ code: "NotFound", message: error.message });
    }
  }

  async findOne(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) res.status(400).send("User not found");
      res.json(user);
    } catch (error) {
      res.status(400).json({ code: "BadRequest", message: error.message });
    }
  }

  async delete(req, res) {
    if (!req.body._id) {
      res.sendStatus(500);
      return;
    }

    functionsMongo
      .findOne(User, { _id: req.body._id })
      .then(() => {
        functionsMongo
          .delete(User, req.body._id)
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
            res.sendStatus(500);
            return;
          });
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
        return;
      });
  }

  async find(req, res) {
    functionsMongo
      .find(User, {})
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
        return;
      });
  }

  async findOne(req, res) {
    if (!req.params.id) {
      res.sendStatus(500);
      return;
    }

    functionsMongo
      .findOne(User, { _id: req.params.id })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
        return;
      });
  }
}

module.exports = UserController;
