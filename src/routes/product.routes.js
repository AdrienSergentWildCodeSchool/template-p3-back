const connection = require("../db-config");
const router = require("express").Router();

// GET all products
router.get("/", (req, res) => {
  connection.query("SELECT * FROM product", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving products from database");
    } else {
      res.json(results);
    }
  });
});

// GET product by ID
router.get("/:id", (req, res) => {
  const productId = req.params.id;
  connection.query(
    "SELECT * FROM product WHERE id = ?",
    [productId],
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving product from database");
      } else {
        if (results.length === 0) {
          res.status(404).send("Product not found");
        } else {
          res.json(results[0]);
        }
      }
    }
  );
});

// POST a new product
router.post("/", (req, res) => {
  const { name, price, description, picture } = req.body;
  connection.query(
    "INSERT INTO product (name, price, description, picture) VALUES (?, ?, ?, ?)",
    [name, price, description, picture],
    (err, result) => {
      if (err) {
        res.status(500).send("Error saving product to database");
      } else {
        res.status(201).json({ id: result.insertId, ...req.body });
      }
    }
  );
});

// PUT (update) a product by ID
router.put("/:id", (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  connection.query(
    "UPDATE product SET ? WHERE id = ?",
    [updatedProduct, productId],
    (err, results) => {
      if (err) {
        res.status(500).send("Error updating product in database");
      } else {
        if (results.affectedRows === 0) {
          res.status(404).send("Product not found");
        } else {
          res.status(200).json({ id: parseInt(productId), ...updatedProduct });
        }
      }
    }
  );
});

// DELETE a product by ID
router.delete("/:id", (req, res) => {
  const productId = req.params.id;
  connection.query(
    "DELETE FROM product WHERE id = ?",
    [productId],
    (err, results) => {
      if (err) {
        res.status(500).send("Error deleting product from database");
      } else {
        if (results.affectedRows === 0) {
          res.status(404).send("Product not found");
        } else {
          res.status(200).send(`Product with ID ${productId} was deleted`);
        }
      }
    }
  );
});

module.exports = router;
