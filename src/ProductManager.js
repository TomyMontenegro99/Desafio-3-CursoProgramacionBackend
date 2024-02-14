const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error("Error al guardar los productos:", error);
    }
  }

  addProduct(product) {
    const newProduct = {
      id: this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1,
      ...product
    };
    this.products.push(newProduct);
    this.saveProducts();
    console.log("Producto agregado:", newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(existingProduct => existingProduct.id === id);
    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado. ID:", id);
      return null;
    }
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields };
      this.saveProducts();
      console.log("Producto actualizado:", this.products[index]);
    } else {
      console.error("Producto no encontrado para actualizar. ID:", id);
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      console.log("Producto eliminado. ID:", id);
    } else {
      console.error("Producto no encontrado para eliminar. ID:", id);
    }
  }
}


const productManager = new ProductManager('productos.json');


console.log("Productos al inicio:", productManager.getProducts()); // Debería mostrar []


productManager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25
});


console.log("Productos después de agregar uno:", productManager.getProducts());


const productIdToSearch = 1;
const foundProduct = productManager.getProductById(productIdToSearch);
console.log("Producto encontrado por ID:", foundProduct);


productManager.updateProduct(1, { price: 250 }); 
console.log("Producto actualizado:", productManager.getProductById(1)); 


productManager.deleteProduct(2);
console.log("Productos después de eliminar uno:", productManager.getProducts());

module.exports = ProductManager;