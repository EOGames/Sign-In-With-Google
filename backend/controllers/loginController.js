

const jwt = require('jsonwebtoken');
const User = require('../model/userDetail');


module.exports.loginWithGoogle = (async (req, res) => {

    try {
        console.log('Was Here: 2 In Login Controller');
        
        let decode = jwt.decode(req.headers.authorization.split(" ")[1]);
        console.log("Decoded: ", decode);


        console.log('[Login Controller] Session Token Expire Time :', process.env.USER_SESSION_TOKEN_EXPIRE_TIME);

        let newToken = jwt.sign({ userName: decode.name, picLink: decode.picture, email: decode.email }, process.env.MY_JWT_PRIVATE_KEY, { expiresIn: process.env.USER_SESSION_TOKEN_EXPIRE_TIME });

        console.log('NEW TOKEN: ', newToken);
        let data = {
            token: newToken,
            userName: decode.name,
            picLink: decode.picture,
            email: decode.email,
            message: 'Sucessfull Loged In',
        }

        let foundUser = await User.findOne({ email:decode.email });
        console.log('Found ::::::::::::::::::::::::::: ', foundUser);
        if (!foundUser)
        {
            let user = new User(
                {
                    userName: decode.name,
                    picLink: decode.picture,
                    email: decode.email,
                    registrationTime: new Date(Date.now()),
                    loginTime:[{time: new Date(Date.now())}],
                    refreshToken:''
                }
            );

            let result = await user.save();
            console.log("New User Saved ", result);
        }
        else
        {
            console.log("User Already Registred ", foundUser);
            foundUser.loginTime.push({time: new Date(Date.now())});
            await foundUser.save();

        }
        res.send(data);

    }
    catch (error) {
        console.log('Got Error While Logging : ', error);
    }

});

