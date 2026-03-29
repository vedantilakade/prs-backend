const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/reviews', reviewRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});