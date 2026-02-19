const crypto = require('crypto');

class CartService {
  constructor(cartRepository, productRepository, ticketRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.ticketRepository = ticketRepository;
  }

  async addProductToCart(userId, productId, quantity = 1) {
    const cart = await this.cartRepository.getByUserId(userId);
    if (!cart) throw new Error('Carrito no encontrado');

    const product = await this.productRepository.getById(productId);
    if (!product || !product.status) throw new Error('Producto no disponible');

    const item = cart.products.find((p) => p.product._id.toString() === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.products.push({ product: product._id, quantity });
    }

    await cart.save();
    return this.cartRepository.getById(cart._id);
  }

  async purchaseCart(user) {
    const cart = await this.cartRepository.getByUserId(user._id);
    if (!cart) throw new Error('Carrito no encontrado');

    const purchasable = [];
    const notProcessed = [];

    for (const item of cart.products) {
      const product = await this.productRepository.getById(item.product._id);
      if (product && product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        purchasable.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });
      } else {
        notProcessed.push({ product: item.product._id, quantity: item.quantity });
      }
    }

    let ticket = null;
    if (purchasable.length) {
      const amount = purchasable.reduce((acc, i) => acc + i.quantity * i.price, 0);
      ticket = await this.ticketRepository.create({
        code: crypto.randomUUID(),
        amount,
        purchaser: user.email,
        products: purchasable,
      });
    }

    cart.products = notProcessed;
    await cart.save();

    return {
      ticket,
      productsNotProcessed: notProcessed,
      cart,
    };
  }
}

module.exports = CartService;
