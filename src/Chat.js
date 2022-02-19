const User = require('./User');

class Chat {
  constructor() {
    this.messages = [];
    this.users = [];
  }

  getAllUsers() {
    return this.users;
  }

  allMessages() {
    return this.messages;
  }

  createUser(object) {
    const data = JSON.parse(object);
    const user = new User(data);
    this.users.push(user);
    return user;
  }
}

module.exports = Chat;
