const { v4: uuidv4 } = require('uuid');

class User {
  constructor(name) {
    this.id = uuidv4();
    this.name = name;
    this.created = new Date().toLocaleString();
  }
}

module.exports = User;
