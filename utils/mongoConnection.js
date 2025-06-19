import mongoose from 'mongoose';
import "dotenv/config";

const mongoConnection = async () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb://inesPrime:lesinesdufonddelaclasse@127.0.0.1:28017/")
      .then(() => {
        resolve(null);
      })
      .catch((error) => reject(error));
  });
};

export { mongoConnection };
