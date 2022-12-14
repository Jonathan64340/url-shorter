const UrlController = require('../controller/UrlController');

const path = require('path');



const Router = require('express').Router();



Router.get('/count-short-link', (req, res) => {

    UrlController({ request: req, response: res }).getTotalShorterLink();

});



Router.get('/top-link', (req, res) => {

    UrlController({ request: req, response: res }).getTopLink();

});


Router.get('/get-random', (req, res) => {
    UrlController({ request: req, response: res }).getRandom();
});


Router.get('/short-link/:link', (req, res) => {

    UrlController({ request: req, response: res }).redirectToShorterLink();

});



Router.post('/create-short-link', (req, res) => {

    UrlController({ request: req, response: res }).createShorterLink();

});



Router.get('*', (req, res) => {

    res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));

});



module.exports = Router;