"use strict";

// It takes in a schema in the constructor and uses that instead of every collection
// being the same and requiring their own schema.
class DataCollection {
  constructor(model) {
    this.model = model;
  }

  getByName(username) {
    if (username) {
      return this.model.findAll({ where: {username} });
    }
  }

  get(id) {
    if (id) {
      return this.model.findOne({ where: { id } });
    } else {
      return this.model.findAll({});
    }
  }

  create(record) {
    return this.model.create(record);
  }

  update(id, data) {
    return this.model
      .findOne({ where: { id } })
      .then((record) => record.update(data));
  }

  delete(id) {
    return this.model.destroy({ where: { id } });
  }
}

module.exports = DataCollection;
