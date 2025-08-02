const fs = require('fs').promises;

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async #writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async addProduct(product) {
    const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
    for (const field of requiredFields) {
      if (!product.hasOwnProperty(field)) {
        throw new Error(`Falta el campo obligatorio: ${field}`);
      }
    }

    const products = await this.#readFile();
    const codeExists = products.find(p => p.code === product.code);
    if (codeExists) throw new Error('Ya existe un producto con ese código');

    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = { id: newId, ...product };
    products.push(newProduct);
    await this.#writeFile(products);
    return newProduct;
  }

  async getProducts() {
    return await this.#readFile();
  }

  async getProductById(id) {
    const products = await this.#readFile();
    return products.find(p => p.id === id);
  }

  async updateProduct(id, updateFields) {
    const products = await this.#readFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    // Evitar que se actualice el ID
    if ('id' in updateFields) delete updateFields.id;

    products[index] = { ...products[index], ...updateFields };
    await this.#writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.#readFile();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;

    await this.#writeFile(filtered);
    return true;
  }
}

module.exports = ProductManager;
