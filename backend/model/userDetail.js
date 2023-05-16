const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userName:String,
    email:String,
    picLink:String,
    registrationTime:String,
    loginTime:
        [
            {
              time:String
            }
        ],
   
    refreshToken:String,
    acessCode: String

});

const User = mongoose.model('userDetail',schema);
module.exports = User;