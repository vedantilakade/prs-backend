const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./reviews.db', (err) => {
  if (err) console.error(err.message);
  else console.log('✅ Connected to SQLite database.');
});

db.run(`
  CREATE TABLE IF NOT EXISTS Product_Review (
    review_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id  INTEGER NOT NULL,
    user_id     INTEGER NOT NULL,
    username    VARCHAR(255) NOT NULL,
    rating      INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    review_text VARCHAR(1000),
    review_date DATE DEFAULT CURRENT_DATE,
    status      TEXT DEFAULT 'Visible' CHECK(status IN ('Visible','Hidden','Reported')),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;