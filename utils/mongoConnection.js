import mongoose from 'mongoose';
import dotenv from "dotenv";
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

export { mongoConnection };
