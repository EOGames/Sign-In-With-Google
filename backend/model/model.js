const mongoose = require('mongoose');
require('dotenv').config();
const dbLink = process.env.DATABASE_LINK;

mongoose.connect(`${dbLink}/TestApi`);


const Schema = new mongoose.Schema(
    {
        model : String,
        brand: String,
        price: String,
    }
);

const Model = mongoose.model('Phones',Schema);
module.exports = Model;