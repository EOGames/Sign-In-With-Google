

const jwt = require('jsonwebtoken');

module.exports.loginWithGoogle = (async (req, res) => {

    console.log('Was Here: 2 In Login Controller');

    let decode = jwt.decode(req.headers.authorization.split(" ")[1]);
    console.log("Decoded: ",decode);

    
    console.log('[Login Controller] Session Token Expire Time :',process.env.USER_SESSION_TOKEN_EXPIRE_TIME);

    let newToken = jwt.sign({userName:decode.name,picLink:decode.picture,email: decode.email},process.env.MY_JWT_PRIVATE_KEY,{expiresIn:process.env.USER_SESSION_TOKEN_EXPIRE_TIME});

    console.log('NEW TOKEN: ', newToken);
    let data = {
        token: newToken,
        userName: decode.name,
        picLink: decode.picture,
        email: decode.email,
        message: 'Sucessfull Loged In',
    }

    res.send(data);

});

