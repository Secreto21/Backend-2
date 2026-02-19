class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(ticket) {
    return this.dao.create(ticket);
  }

  getAll() {
    return this.dao.findAll();
  }
}

module.exports = TicketRepository;
