const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/route');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://Project-4-Group:KYbNPiQVZYeMXbKO@cluster0.w5bka.mongodb.net/test")
        .then(()=>console.log("Mongodb connected"))
        .catch(err => console.log(err));

app.use('/',router);

app.listen(process.env.PORT || 3000, function(){
    console.log("Express app running on port"+(process.env.PORT||3000));
});