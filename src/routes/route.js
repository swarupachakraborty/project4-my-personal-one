const express = require('express');
const {shortenURL,getURL} = require('../controllers/controller');

const router = express.Router();


router.post('/url/shorten',shortenURL);

router.get('/:urlCode',getURL);


module.exports=router;