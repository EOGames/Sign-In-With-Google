const User = require('../model/userDetail');
const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;

const { OAuth2Client } = require('google-auth-library');

const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.REDIRECT_URI);

module.exports.GenrateRefreshToken = async (req,res) =>
{
    try
    {
        const {email,acessCode} = req.body;
        // const email = req.parms.email;
        // const acessCode = req.parms.acessCode;

        let foundUser = await User.findOne({email:email});

        let refreshToken = foundUser.refreshToken;

        if (refreshToken === '')
        {
            const { tokens } = await oauth2Client.getToken(acessCode);
            // accessToken = tokens.access_token;
            refreshToken = tokens.refresh_token;           
            foundUser.refreshToken =  tokens.refresh_token;
            console.log('Refresh Token  Not Found Getting New ',refreshToken); 
            await foundUser.save();       
        }

    }
    catch(error)
    {
        res.status(403).json({error:error});
        console.log('[genrateRefreshTokenController] Got Error: ',error);
    }

}