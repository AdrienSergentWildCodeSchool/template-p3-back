const connection = require('../db-config');
const router = require('express').Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM product', (err, result) => {
        if (err) {
          res.status(500).send('Error retrieving product from database');
        } else {
          res.json(result);
        }
      });

});

router.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
connection.query(
    'SELECT * FROM product WHERE id = ?',
    [animalId],
    (err, results) => {
    if (err) {
        res.status(500).send('Error retrieving product from database');
    } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('product not found');
    }
    }
);

});

router.post('/api/products', (req, res) => {
    const { name, price, description, picture } = req.body;
  connection.query(
    'INSERT INTO animal (name, species, description, picture) VALUES (?, ?, ?, ?)',
    [name, price, description, picture],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the animal');
      } else {
        const id = result.insertId;
        const createdProduct = { id, name, price, description, picture };
        res.status(201).json(createdProduct);
      }
    }
  );

});

router.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const db = connection.promise();
    let existingProduct = null;
    db.query('SELECT * FROM product WHERE id = ?', [productId])
      .then(([results]) => {
        existingProduct = results[0];
        if (!existingProduct) return Promise.reject('RECORD_NOT_FOUND');
        return db.query('UPDATE Product SET ? WHERE id = ?', [req.body, productId]);
      })
      .then(() => {
        res.status(200).json({ ...existingProduct, ...req.body });
      })
      .catch((err) => {
        console.error(err);
        if (err === 'RECORD_NOT_FOUND')
          res.status(404).send(`Product with id ${productId} not found.`);
        else res.status(500).send('Error updating a Product');
      });
});

router.delete('/api/products/:id', (req, res) => {
    connection.query(
        'DELETE FROM product WHERE id = ?',
        [req.params.id],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send('Error deleting an product');
          } else {
            if (result.affectedRows) res.status(200).send('🎉 Product deleted!');
            else res.status(404).send('Product not found.');
          }
        }
      );

});

module.exports = router;
