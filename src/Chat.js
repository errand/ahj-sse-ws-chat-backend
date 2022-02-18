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
    const user = new User(data.name);
    this.users.push(user);

    return user;
  }

  getIndexId(id) {
    const index = this.tickets.findIndex((elem) => elem.id === id);
    return index;
  }

  getTicketById(id) {
    const ticket = this.descriptions.find((elem) => elem.id === id);

    return ticket;
  }

  deleteTicket(id) {
    const item = this.getIndexId(id);
    return !!this.tickets.splice(item, 1);
  }

  toggleTicketStatus(id) {
    const index = this.getIndexId(id);
    const item = this.tickets[index];
    item.status === false ? (item.status = true) : (item.status = false);
    return item.status;
  }

  editTicket(object) {
    const data = JSON.parse(object);

    const index = this.getIndexId(data.id);

    const item = this.tickets[index];

    item.name = data.name;
    item.description = data.description;
    const ticketDescription = this.descriptions.find(
      (elem) => elem.id === data.id,
    );
    ticketDescription.description = data.description;

    return item;
  }
}

module.exports = Chat;
