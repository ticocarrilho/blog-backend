const express = require('express');
const routes = require('./routes');
const app = express();
const port = process.env.PORT || 3333;
const dotenv = require('dotenv');
dotenv.config();

require('./database');

app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
