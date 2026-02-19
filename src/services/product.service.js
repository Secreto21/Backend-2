class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  createProduct(data) {
    return this.productRepository.create(data);
  }

  getProducts() {
    return this.productRepository.getAll();
  }

  getProductById(id) {
    return this.productRepository.getById(id);
  }

  updateProduct(id, data) {
    return this.productRepository.updateById(id, data);
  }

  deleteProduct(id) {
    return this.productRepository.deleteById(id);
  }
}

module.exports = ProductService;
