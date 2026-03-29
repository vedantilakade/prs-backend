const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all reviews
router.get('/', (req, res) => {
  db.all('SELECT * FROM Product_Review ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET single review
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM Product_Review WHERE review_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Review not found' });
    res.json(row);
  });
});

// POST - add new review
router.post('/', (req, res) => {
  const { product_id, user_id, username, rating, review_text, status } = req.body;

  if (!product_id || !user_id || !username || !rating)
    return res.status(400).json({ error: 'product_id, user_id, username, and rating are required.' });
  if (rating < 1 || rating > 5)
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });

  db.run(
    `INSERT INTO Product_Review (product_id, user_id, username, rating, review_text, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [product_id, user_id, username, rating, review_text || null, status || 'Visible'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Review created!', review_id: this.lastID });
    }
  );
});

// PUT - edit a review
router.put('/:id', (req, res) => {
  const { username, rating, review_text, status } = req.body;

  if (rating && (rating < 1 || rating > 5))
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });

  db.run(
    `UPDATE Product_Review
     SET username = ?, rating = ?, review_text = ?, status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE review_id = ?`,
    [username, rating, review_text, status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Review not found' });
      res.json({ message: 'Review updated!' });
    }
  );
});

// DELETE - remove a review
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM Product_Review WHERE review_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted!' });
  });
});

module.exports = router;