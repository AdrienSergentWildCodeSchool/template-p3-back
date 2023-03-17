const connection = require("../db-config");

class Product {

  static manager() {
    return {
      getAllProducts: () => {
        return connection.query("SELECT * FROM products");
      },
      getProductById: (id) => {
        return connection.query("SELECT * FROM products WHERE id = ?", [id]);
      },
      createProduct: (product) => {
        return connection.query("INSERT INTO products SET ?", [product]);
      },
      updateProduct: (id, product) => {
        return connection.query("UPDATE products SET ? WHERE id = ?", [product, id]);
      },
      deleteProduct: (id) => {
        return connection.query("DELETE FROM products WHERE id = ?", [id]);
      },
    };
  }
}

module.exports = Product;
