const TicketModel = require('../../models/ticket.model');

class TicketDao {
  create(data) {
    return TicketModel.create(data);
  }

  findAll() {
    return TicketModel.find();
  }
}

module.exports = TicketDao;
