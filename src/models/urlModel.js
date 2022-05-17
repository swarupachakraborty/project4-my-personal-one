const mongoose = require('mongoose');

const urlSchema = mongoose.Schema(
    {

    }
);

module.exports=mongoose.model('urls',urlSchema);