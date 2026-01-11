const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const mongoConnection = async () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGO_PATH)
      .then(() => {
        resolve(null);
      })
      .catch((error) => reject(error));
  });
};

module.exports = { mongoConnection };
