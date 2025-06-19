const functionsMongo = {};

functionsMongo.insert = (collection, object) => {
  return new Promise((resolve, reject) => {
    collection
      .insertOne(object)
      .then((obj) => {
        resolve(obj);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

functionsMongo.update = (collection, _id, object) => {
  return new Promise((resolve, reject) => {
    collection
      .findOne({ _id: _id })
      .then((obj) => {
        collection
          .updateOne({ _id: obj._id }, object)
          .then(() => {
            resolve({ ...object, _id: _id });
            return;
          })
          .catch((err) => {
            reject(err);
            return;
          });
      })
      .catch((err) => {
        reject(err);
        return;
      });
  });
};

functionsMongo.delete = (collection, _id) => {
  return new Promise((resolve, reject) => {
    collection
      .findOne({ _id: _id })
      .then(() => {
        collection
          .deleteOne({ _id: _id })
          .then(() => {
            resolve({});
            return;
          })
          .catch((err) => {
            reject(err);
            return;
          });
      })
      .catch((err) => {
        reject(err);
        return;
      });
  });
};

functionsMongo.deleteMany = (collection, ids) => {
  return new Promise((resolve, reject) => {
    collection.deleteMany({ _id: { $in: ids } }, (err) => {
      if (err) reject(err);
      else resolve(null);
      return;
    });
  });
};

functionsMongo.find = (
  collection,
  object,
  populate = null,
  sortObject = null
) => {
  return new Promise((resolve, reject) => {
    collection
      .find(object)
      .lean()
      .sort(sortObject)
      .populate(populate)
      .then((objs) => {
        resolve(objs);
        return;
      })
      .catch((err) => {
        reject(err);
      });
  });
};

functionsMongo.findOne = (
  collection,
  object,
  populate = null
) => {
  return new Promise((resolve, reject) => {
    collection
      .findOne(object)
      .lean()
      .populate(populate)
      .then((obj) => {
        resolve(obj);
        return;
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default functionsMongo;
