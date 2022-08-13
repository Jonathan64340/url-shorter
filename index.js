const express = require('express');
const app = express();
const routes = require('./config/routes.js');
const cors = require('cors');

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(routes);
console.log(process.env.DATABASE);
app.listen(process.env.PORT || 1234, () => console.log('Server starting on port 1234'));

