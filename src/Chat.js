const User = require('./User');
const Post = require('./Post');

class Chat {
  constructor() {
    this.posts = [];
    this.users = [];
  }

  getAllUsers() {
    return this.users;
  }

  getAllPosts() {
    return this.posts;
  }

  createUser(object) {
    const data = JSON.parse(object);
    const user = new User(data);
    this.users.push(user);
    return user;
  }

  createPost(object) {
    const data = JSON.parse(object);
    const post = new Post(data.user.name, data.text);
    this.posts.push(post);
    return post;
  }
}

module.exports = Chat;
