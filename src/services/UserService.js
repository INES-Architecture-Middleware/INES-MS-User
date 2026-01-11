const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const uid = require("uid-safe");
const functionsMongo = require("../utils/functionsMongo.js");
const User = require("../models/User.js");

class UserService {
  constructor() {
    this.users = [];
    this.secretKey = process.env.JWT_SECRET || "fallback-secret-token-for-dev";
  }

  createUser(req, res) {
    if (
      !req.body ||
      !req.body.username ||
      !req.body.password ||
      !req.body.confirmPassword
    ) {
      res.sendStatus(500);
      return;
    }

    if (req.body.password !== req.body.confirmPassword) {
      res.sendStatus(403);
      return;
    }

    bcrypt.hash(password, config.saltRounds, async (err, hash) => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      uid(18, async (err, verificationToken) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }

        const username = req.body.username.trim();
        const confirmedPassword = req.body.password.trim();
        const newUser = {
          username,
          password: confirmedPassword,
        };

        this.generateToken(newUser, async (err, token) => {
          if (err) {
            res.sendStatus(500);
            return;
          }

          await functionsMongo
            .insert(User, newUser)
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
          res.json({ token: token, user: newUser });
        });
      });
    });
  }

  async login(req) {
    if (!req.body.username || !req.body.password) {
      res.sendStatus(500);
      return;
    }

    const username = req.body.username.trim();
    const password = req.body.password.trim();

    functionsMongo
      .findOne(User, username)
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

          this.generateToken(user, async (err, token) => {
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

  validateCredentials(username, password) {
    const user = this.users.find(
      (user) => user.username === username && user.password === password
    );
    return user || null;
  }

  generateToken(user) {
    const token = jwt.sign(
      { id: user.id, username: user.username },
      this.secretKey,
      { expiresIn: "1h" }
    );
    return token;
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  async getUserById(id) {
    return await functionsMongo.findOne(User, { _id: id });
  }

  update(id, username, password) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { id, username, password };
      return this.users[userIndex];
    }
    return null;
  }

  delete(id) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return true;
    }
    return false;
  }
}

module.exports = UserService;
