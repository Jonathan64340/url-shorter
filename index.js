const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./config/routes');

app.use(cors());
app.use(routes);

// listen server on port 1234
app.listen(process.env.PORT || 1234, () => console.log('This server is started on port 1234'));