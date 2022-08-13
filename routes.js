const UrlController = require('../controller/UrlController');
const path = require('path');

const Router = require('express').Router();

Router.get('/:link', (req, res) => {
    UrlController({ request: req, response: res }).redirectToShorterLink();
});

Router.post('/create-short-link', (req, res) => {
    UrlController({ request: req, response: res }).createShorterLink();
});

Router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

module.exports = Router;