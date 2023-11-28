const express = require('express');
const path = require('path');
const fs = require('fs');

const routes = require('./routes/index');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(routes);

app.listen(PORT, () => 
console.log(`App listening at <a href="http:localhost:${PORT}">http://localhost:${PORT}</a>`)
);