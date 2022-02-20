const { v4: uuidv4 } = require('uuid');

class Post {
  constructor(user, text) {
    this.id = uuidv4();
    this.user = user;
    this.text = text;
    this.created = new Date().toLocaleString();
  }
}

module.exports = Post;
